from django.core.management import call_command
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
        self.assertGreaterEqual(len(response.data["projects"]), 5)
        self.assertGreaterEqual(len(response.data["recent_articles"]), 1)

    def test_article_detail_endpoint_uses_slug(self):
        article = Article.objects.filter(status=Article.STATUS_PUBLISHED).first()
        response = self.client.get(f"/api/articles/{article.slug}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], article.slug)


class EngagementApiTests(APITestCase):
    def test_subscriber_creation_prevents_duplicates(self):
        payload = {"email": "reader@example.com", "company": ""}

        first_response = self.client.post("/api/subscribers/", payload, format="json")
        duplicate_response = self.client.post("/api/subscribers/", payload, format="json")

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Subscriber.objects.count(), 1)

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
