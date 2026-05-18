from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from content.models import Article
from core.models import SiteSettings

from .models import NewsletterCampaign, NewsletterDelivery, Subscriber
from .services import create_campaign_from_article, import_subscribers, send_campaign


class SubscriberImportServiceTests(TestCase):
    def test_import_subscribers_from_text_and_csv(self):
        csv_file = SimpleUploadedFile(
            "subscribers.csv",
            b"email\nsecond@example.com\nthird@example.com\n",
            content_type="text/csv",
        )

        summary = import_subscribers(
            pasted_text="first@example.com\nsecond@example.com",
            csv_file=csv_file,
            source="bulk-upload",
        )

        self.assertEqual(summary["processed"], 3)
        self.assertEqual(summary["created"], 3)
        self.assertEqual(Subscriber.objects.count(), 3)


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class NewsletterCampaignServiceTests(TestCase):
    def setUp(self):
        SiteSettings.load()
        self.article = Article.objects.create(
            title="Test blog post",
            summary="A short summary for subscribers.",
            body="## Hello world\n\nThis is a markdown-powered body.",
            status=Article.STATUS_PUBLISHED,
        )
        self.subscriber = Subscriber.objects.create(email="reader@example.com")

    def test_send_campaign_delivers_to_active_subscribers(self):
        campaign = create_campaign_from_article(self.article)

        summary = send_campaign(campaign)

        campaign.refresh_from_db()
        self.assertEqual(summary["sent"], 1)
        self.assertEqual(campaign.status, NewsletterCampaign.STATUS_SENT)
        self.assertEqual(campaign.delivered_count, 1)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("/blog/test-blog-post/", mail.outbox[0].alternatives[0][0])
        self.assertEqual(
            NewsletterDelivery.objects.filter(
                campaign=campaign, status=NewsletterDelivery.STATUS_SENT
            ).count(),
            1,
        )
