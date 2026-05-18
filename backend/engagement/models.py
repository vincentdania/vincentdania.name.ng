import secrets

from django.db import models
from django.utils import timezone

from content.models import Article


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Subscriber(TimestampedModel):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    confirmed_at = models.DateTimeField(blank=True, null=True)
    confirmation_token = models.CharField(max_length=64, blank=True)
    source = models.CharField(max_length=80, default="website")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Subscriber"
        verbose_name_plural = "Subscribers"

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        if not self.confirmation_token:
            self.confirmation_token = secrets.token_urlsafe(24)
        if self.is_active and not self.confirmed_at:
            self.confirmed_at = timezone.now()
        super().save(*args, **kwargs)


class ContactMessage(TimestampedModel):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=180)
    message = models.TextField()
    resolved = models.BooleanField(default=False)
    notification_sent = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact message"
        verbose_name_plural = "Contact messages"

    def __str__(self):
        return f"{self.subject} - {self.name}"

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        super().save(*args, **kwargs)


class NewsletterCampaign(TimestampedModel):
    TYPE_BLOG_POST = "blog_post"
    TYPE_NEWSLETTER = "newsletter"
    TYPE_ANNOUNCEMENT = "announcement"
    TYPE_CHOICES = [
        (TYPE_BLOG_POST, "Blog post announcement"),
        (TYPE_NEWSLETTER, "Newsletter"),
        (TYPE_ANNOUNCEMENT, "Announcement"),
    ]

    STATUS_DRAFT = "draft"
    STATUS_SENT = "sent"
    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_SENT, "Sent"),
    ]

    name = models.CharField(max_length=180)
    campaign_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_NEWSLETTER)
    subject = models.CharField(max_length=180)
    preview_text = models.CharField(max_length=255, blank=True)
    heading = models.CharField(max_length=220, blank=True)
    intro = models.TextField(blank=True)
    body = models.TextField(
        blank=True,
        help_text="Write in Markdown or paste HTML. Blog-post campaigns can leave this blank.",
    )
    call_to_action_label = models.CharField(max_length=80, blank=True)
    call_to_action_url = models.URLField(blank=True)
    article = models.ForeignKey(
        Article,
        on_delete=models.SET_NULL,
        related_name="newsletter_campaigns",
        blank=True,
        null=True,
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    recipient_count = models.PositiveIntegerField(default=0)
    delivered_count = models.PositiveIntegerField(default=0)
    sent_at = models.DateTimeField(blank=True, null=True)
    last_error = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Email campaign"
        verbose_name_plural = "Email campaigns"

    def __str__(self):
        return self.name


class NewsletterDelivery(TimestampedModel):
    STATUS_SENT = "sent"
    STATUS_FAILED = "failed"
    STATUS_CHOICES = [
        (STATUS_SENT, "Sent"),
        (STATUS_FAILED, "Failed"),
    ]

    campaign = models.ForeignKey(
        NewsletterCampaign,
        on_delete=models.CASCADE,
        related_name="deliveries",
    )
    subscriber = models.ForeignKey(
        Subscriber,
        on_delete=models.CASCADE,
        related_name="newsletter_deliveries",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    sent_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Email delivery"
        verbose_name_plural = "Email deliveries"
        constraints = [
            models.UniqueConstraint(
                fields=["campaign", "subscriber"],
                name="unique_newsletter_delivery",
            )
        ]

    def __str__(self):
        return f"{self.campaign.name} -> {self.subscriber.email}"

# Create your models here.
