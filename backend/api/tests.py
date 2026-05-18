from django.core import mail
from django.core.management import call_command
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from content.models import Article
from engagement.models import ContactMessage, Subscriber


class PublicApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_site")

    def test_site_endpoint_returns_seeded_payload(self):
        response = self.client.get("/api/site/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["site_settings"]["site_name"], "Vincent Dania")
        self.assertIn("blog_settings", response.data)
        self.assertIn("navigation_items", response.data)
        self.assertGreaterEqual(len(response.data["projects"]), 5)
        self.assertGreaterEqual(len(response.data["recent_articles"]), 1)

    def test_article_detail_endpoint_uses_slug(self):
        article = Article.objects.filter(status=Article.STATUS_PUBLISHED).first()
        response = self.client.get(f"/api/articles/{article.slug}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], article.slug)


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    CONTACT_NOTIFICATION_EMAIL="Vincent@hyrax.ng",
    CONSULTATION_NOTIFICATION_EMAIL="Vincent@hyrax.ng",
)
class EngagementApiTests(APITestCase):
    def test_subscriber_creation_prevents_duplicates(self):
        payload = {"email": "reader@example.com", "company": ""}

        first_response = self.client.post("/api/subscribers/", payload, format="json")
        duplicate_response = self.client.post("/api/subscribers/", payload, format="json")

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Subscriber.objects.count(), 1)

    def test_subscriber_creation_accepts_no_trailing_slash(self):
        payload = {"email": "reader@example.com", "company": ""}

        response = self.client.post("/api/subscribers", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Subscriber.objects.count(), 1)

    def test_subscriber_can_unsubscribe_with_token(self):
        subscriber = Subscriber.objects.create(email="reader@example.com")

        response = self.client.get(
            f"/api/subscribers/unsubscribe/{subscriber.confirmation_token}/"
        )

        subscriber.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(subscriber.is_active)

    def test_contact_messages_are_saved(self):
        payload = {
            "name": "Hiring Manager",
            "email": "manager@example.com",
            "subject": "Programme leadership conversation",
            "message": "We would like to discuss a leadership role that combines donor management and digital delivery.",
            "company": "",
        }

        response = self.client.post("/api/contact/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["Vincent@hyrax.ng"])

    def test_consultation_message_requires_correct_captcha(self):
        payload = {
            "name": "NGO Director",
            "email": "director@example.com",
            "subject": "AI Consultation Request",
            "message": "We need practical AI advisory support for our programme team and reporting workflows.",
            "budget": "Under ₦500,000 (Basic Consultation)",
            "preferred_date": "2026-06-15",
            "source": "consultation",
            "captcha_left": 2,
            "captcha_right": 3,
            "captcha_answer": 4,
            "company": "",
        }

        response = self.client.post("/api/contact/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_consultation_message_is_emailed_to_hyrax_address(self):
        payload = {
            "name": "NGO Director",
            "email": "director@example.com",
            "subject": "AI Consultation Request",
            "message": "We need practical AI advisory support for our programme team and reporting workflows.",
            "budget": "Under ₦500,000 (Basic Consultation)",
            "preferred_date": "2026-06-15",
            "source": "consultation",
            "captcha_left": 2,
            "captcha_right": 3,
            "captcha_answer": 5,
            "company": "",
        }

        response = self.client.post("/api/contact/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["notification_sent"])
        message = ContactMessage.objects.get()
        self.assertTrue(message.notification_sent)
        self.assertIn("Estimated budget: Under ₦500,000", message.message)
        self.assertIn("Preferred consultation date: June 15, 2026", message.message)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["Vincent@hyrax.ng"])
        self.assertEqual(mail.outbox[0].reply_to, ["director@example.com"])
