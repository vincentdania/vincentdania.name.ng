import csv
import io
import re
from urllib.parse import urljoin

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.db import transaction
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags

from core.models import SiteSettings
from core.richtext import render_rich_text

from .models import ContactMessage, NewsletterCampaign, NewsletterDelivery, Subscriber


EMAIL_PATTERN = re.compile(r"([A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,})", re.IGNORECASE)


def send_contact_message_notification(
    message: ContactMessage,
    *,
    recipient_email: str | None = None,
) -> bool:
    recipient = recipient_email or settings.CONTACT_NOTIFICATION_EMAIL
    if not recipient:
        return False

    subject = f"New website message: {message.subject}"
    body = "\n".join(
        [
            f"Name: {message.name}",
            f"Email: {message.email}",
            f"Subject: {message.subject}",
            "",
            message.message,
        ]
    )

    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
        reply_to=[message.email],
    )
    sent_count = email.send()
    if sent_count:
        message.notification_sent = True
        message.save(update_fields=["notification_sent", "updated_at"])
        return True
    return False


def extract_emails_from_text(value: str) -> set[str]:
    if not value:
        return set()

    emails: set[str] = set()
    for match in EMAIL_PATTERN.findall(value):
        email = match.lower().strip(".,;:()[]{}<>\"'")
        try:
            validate_email(email)
        except ValidationError:
            continue
        emails.add(email)
    return emails


def extract_emails_from_csv(file_obj) -> set[str]:
    if not file_obj:
        return set()

    content = file_obj.read()
    if isinstance(content, bytes):
        text = content.decode("utf-8-sig", errors="ignore")
    else:
        text = str(content)

    emails: set[str] = set()
    reader = csv.reader(io.StringIO(text))
    for row in reader:
        for cell in row:
            emails.update(extract_emails_from_text(cell))
    return emails


@transaction.atomic
def import_subscribers(
    *,
    pasted_text: str = "",
    csv_file=None,
    source: str = "admin-import",
    reactivate_existing: bool = True,
) -> dict[str, int]:
    emails = extract_emails_from_text(pasted_text)
    emails.update(extract_emails_from_csv(csv_file))

    created = 0
    reactivated = 0
    existing = 0

    for email in sorted(emails):
        subscriber, was_created = Subscriber.objects.get_or_create(
            email=email,
            defaults={
                "source": source,
                "is_active": True,
            },
        )
        if was_created:
            created += 1
            continue

        updates: list[str] = []
        if source and subscriber.source != source:
            subscriber.source = source
            updates.append("source")
        if reactivate_existing and not subscriber.is_active:
            subscriber.is_active = True
            updates.append("is_active")
        if reactivate_existing and not subscriber.confirmed_at:
            subscriber.confirmed_at = timezone.now()
            updates.append("confirmed_at")

        if updates:
            subscriber.save(update_fields=[*updates, "updated_at"])
            if "is_active" in updates:
                reactivated += 1
            else:
                existing += 1
        else:
            existing += 1

    return {
        "processed": len(emails),
        "created": created,
        "reactivated": reactivated,
        "existing": existing,
    }


def get_public_url(path: str) -> str:
    base = f"{settings.SITE_ORIGIN.rstrip('/')}/"
    return urljoin(base, path.lstrip("/"))


def get_article_url(campaign: NewsletterCampaign) -> str:
    if campaign.call_to_action_url:
        return campaign.call_to_action_url
    if campaign.article_id:
        return get_public_url(f"/blog/{campaign.article.slug}/")
    return ""


def build_unsubscribe_url(subscriber: Subscriber) -> str:
    return get_public_url(f"/api/subscribers/unsubscribe/{subscriber.confirmation_token}/")


def render_campaign_content(
    campaign: NewsletterCampaign,
    subscriber: Subscriber,
) -> tuple[str, str]:
    article = campaign.article
    body_html = render_rich_text(campaign.body)
    cta_url = get_article_url(campaign)

    if article and not body_html:
        body_html = render_rich_text(article.summary)

    context = {
        "campaign": campaign,
        "article": article,
        "heading": campaign.heading or (article.title if article else campaign.name),
        "preview_text": campaign.preview_text,
        "intro": campaign.intro or (article.summary if article else ""),
        "body_html": body_html,
        "body_text": strip_tags(body_html),
        "cta_label": campaign.call_to_action_label or ("Read the full post" if article else ""),
        "cta_url": cta_url,
        "site_name": SiteSettings.load().site_name,
        "site_origin": settings.SITE_ORIGIN.rstrip("/"),
        "unsubscribe_url": build_unsubscribe_url(subscriber),
        "subscriber": subscriber,
    }

    html_body = render_to_string("emails/newsletter.html", context)
    text_body = render_to_string("emails/newsletter.txt", context)
    return html_body, text_body


@transaction.atomic
def create_campaign_from_article(article, *, save: bool = True) -> NewsletterCampaign:
    campaign = NewsletterCampaign(
        name=f"Blog post: {article.title}",
        campaign_type=NewsletterCampaign.TYPE_BLOG_POST,
        subject=article.meta_title or article.title,
        preview_text=article.summary[:255],
        heading=article.title,
        intro=article.summary,
        call_to_action_label="Read the full post",
        article=article,
    )
    if save:
        campaign.save()
    return campaign


def send_campaign(campaign: NewsletterCampaign) -> dict[str, int]:
    recipients = Subscriber.objects.filter(is_active=True).exclude(
        newsletter_deliveries__campaign=campaign,
    )
    active_count = Subscriber.objects.filter(is_active=True).count()

    sent = 0
    failed = 0

    for subscriber in recipients.iterator():
        html_body, text_body = render_campaign_content(campaign, subscriber)
        message = EmailMultiAlternatives(
            subject=campaign.subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[subscriber.email],
        )
        message.attach_alternative(html_body, "text/html")

        try:
            message.send(fail_silently=False)
        except Exception as exc:  # pragma: no cover - exercised through mail backend behaviour
            failed += 1
            NewsletterDelivery.objects.create(
                campaign=campaign,
                subscriber=subscriber,
                status=NewsletterDelivery.STATUS_FAILED,
                error_message=str(exc),
            )
            continue

        sent += 1
        NewsletterDelivery.objects.create(
            campaign=campaign,
            subscriber=subscriber,
            status=NewsletterDelivery.STATUS_SENT,
            sent_at=timezone.now(),
        )

    delivered_count = campaign.deliveries.filter(status=NewsletterDelivery.STATUS_SENT).count()
    campaign.recipient_count = active_count
    campaign.delivered_count = delivered_count
    campaign.sent_at = timezone.now() if sent or delivered_count else campaign.sent_at
    campaign.status = (
        NewsletterCampaign.STATUS_SENT
        if sent or delivered_count
        else NewsletterCampaign.STATUS_DRAFT
    )
    campaign.last_error = "" if failed == 0 else f"{failed} delivery attempt(s) failed."
    campaign.save(
        update_fields=[
            "recipient_count",
            "delivered_count",
            "sent_at",
            "status",
            "last_error",
            "updated_at",
        ]
    )

    return {
        "active_subscribers": active_count,
        "sent": sent,
        "failed": failed,
        "already_sent": max(active_count - sent - failed, 0),
    }
