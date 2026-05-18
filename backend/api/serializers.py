from urllib.parse import urljoin

from django.conf import settings
from rest_framework import serializers

from content.models import Article, Project
from core.models import (
    BlogSettings,
    Certification,
    CredibilityStat,
    EducationCredential,
    Experience,
    ExpertiseCategory,
    ImpactMetric,
    NavigationItem,
    Opportunity,
    ProfileContent,
    SiteSettings,
    SocialLink,
)
from engagement.models import ContactMessage, Subscriber


def media_url(request, value):
    if not value:
        return ""
    if str(value.url).startswith(("http://", "https://")):
        return value.url
    if settings.SITE_ORIGIN:
        return urljoin(f"{settings.SITE_ORIGIN.rstrip('/')}/", value.url.lstrip("/"))
    if request is None:
        return value.url
    return request.build_absolute_uri(value.url)


class SiteSettingsSerializer(serializers.ModelSerializer):
    cv_file_url = serializers.SerializerMethodField()
    portrait_image_url = serializers.SerializerMethodField()
    whatsapp_url = serializers.CharField(read_only=True)

    class Meta:
        model = SiteSettings
        fields = [
            "site_name",
            "short_name",
            "site_description",
            "site_keywords",
            "location",
            "public_email",
            "whatsapp_number",
            "whatsapp_url",
            "linkedin_url",
            "contact_intro",
            "footer_note",
            "hero_primary_cta_label",
            "hero_primary_cta_link",
            "hero_secondary_cta_label",
            "hero_secondary_cta_link",
            "navbar_contact_label",
            "navbar_contact_link",
            "navbar_cv_label",
            "contact_email_button_label",
            "contact_whatsapp_button_label",
            "contact_cv_button_label",
            "footer_copyright",
            "meta_title",
            "meta_description",
            "cv_file_url",
            "portrait_image_url",
        ]

    def get_cv_file_url(self, obj):
        return media_url(self.context.get("request"), obj.cv_file)

    def get_portrait_image_url(self, obj):
        return media_url(self.context.get("request"), obj.portrait_image)


class ProfileContentSerializer(serializers.ModelSerializer):
    about_paragraphs = serializers.SerializerMethodField()

    class Meta:
        model = ProfileContent
        fields = [
            "hero_eyebrow",
            "hero_title",
            "hero_subtitle",
            "about_title",
            "about_body",
            "about_paragraphs",
            "builder_title",
            "builder_intro",
            "expertise_title",
            "expertise_intro",
            "education_title",
            "education_intro",
            "thought_leadership_title",
            "thought_leadership_intro",
            "opportunities_title",
            "opportunities_copy",
            "contact_title",
            "contact_copy",
        ]

    def get_about_paragraphs(self, obj):
        return [item.strip() for item in obj.about_body.split("\n\n") if item.strip()]


class BlogSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogSettings
        fields = [
            "index_badge_label",
            "index_title",
            "index_intro",
            "featured_badge_label",
            "featured_fallback_title",
            "archive_eyebrow",
            "archive_title",
            "archive_intro",
            "archive_link_label",
            "subscribe_badge_label",
            "subscribe_title",
            "subscribe_description",
            "detail_back_label",
            "detail_meta_heading",
            "meta_title",
            "meta_description",
        ]


class CredibilityStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CredibilityStat
        fields = ["label", "order"]


class ImpactMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = ["icon", "value", "label", "detail", "order"]


class ExperienceSerializer(serializers.ModelSerializer):
    period_label = serializers.CharField(read_only=True)
    achievements = serializers.ListField(source="achievement_list", child=serializers.CharField(), read_only=True)

    class Meta:
        model = Experience
        fields = [
            "title",
            "organization",
            "location",
            "employment_type",
            "summary",
            "achievements",
            "period_label",
            "featured",
            "order",
        ]


class ExpertiseCategorySerializer(serializers.ModelSerializer):
    skills = serializers.ListField(source="skill_list", child=serializers.CharField(), read_only=True)

    class Meta:
        model = ExpertiseCategory
        fields = ["title", "description", "skills", "order"]


class EducationCredentialSerializer(serializers.ModelSerializer):
    period_label = serializers.CharField(read_only=True)

    class Meta:
        model = EducationCredential
        fields = ["title", "institution", "location", "note", "period_label", "order"]


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ["title", "issuer", "order"]


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = ["title", "order"]


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["platform", "label", "url", "order", "visible_in_footer"]


class NavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = ["label", "href", "order", "visible", "open_in_new_tab"]


class ProjectSerializer(serializers.ModelSerializer):
    featured_image_url = serializers.SerializerMethodField()
    category_label = serializers.CharField(read_only=True)
    tech_stack = serializers.ListField(source="tech_stack_list", child=serializers.CharField(), read_only=True)

    class Meta:
        model = Project
        fields = [
            "name",
            "slug",
            "short_description",
            "long_description",
            "live_url",
            "display_order",
            "category",
            "category_label",
            "tech_stack",
            "role_label",
            "featured_image_url",
            "featured",
        ]

    def get_featured_image_url(self, obj):
        return media_url(self.context.get("request"), obj.featured_image)


class ArticleListSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "title",
            "slug",
            "summary",
            "author_name",
            "featured",
            "published_at",
            "reading_time_minutes",
            "cover_image_url",
            "categories",
            "tags",
        ]

    def get_cover_image_url(self, obj):
        return media_url(self.context.get("request"), obj.cover_image)

    def get_categories(self, obj):
        return list(obj.categories.values("name", "slug"))

    def get_tags(self, obj):
        return list(obj.tags.values("name", "slug"))


class ArticleDetailSerializer(ArticleListSerializer):
    body = serializers.SerializerMethodField()
    meta_title = serializers.CharField()
    meta_description = serializers.CharField()

    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + ["body", "meta_title", "meta_description"]

    def get_body(self, obj):
        return obj.rendered_body


class SubscriberCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    company = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate_email(self, value):
        email = value.lower().strip()
        if Subscriber.objects.filter(email=email, is_active=True).exists():
            raise serializers.ValidationError("This address is already subscribed.")
        return email

    def validate_company(self, value):
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        subscriber, created = Subscriber.objects.get_or_create(
            email=email,
            defaults={"is_active": True},
        )
        if not created:
            subscriber.is_active = True
            subscriber.save(update_fields=["is_active", "confirmed_at", "updated_at"])
        return subscriber


class ContactMessageCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=180)
    message = serializers.CharField(min_length=20, max_length=4000)
    budget = serializers.CharField(required=False, allow_blank=True, max_length=120, write_only=True)
    preferred_date = serializers.DateField(required=False, write_only=True)
    source = serializers.CharField(required=False, allow_blank=True, max_length=80, write_only=True)
    captcha_left = serializers.IntegerField(required=False, write_only=True)
    captcha_right = serializers.IntegerField(required=False, write_only=True)
    captcha_answer = serializers.IntegerField(required=False, write_only=True)
    company = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate_company(self, value):
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def validate(self, attrs):
        source = attrs.get("source", "")
        if source == "consultation":
            captcha_fields = ("captcha_left", "captcha_right", "captcha_answer")
            if any(field not in attrs for field in captcha_fields):
                raise serializers.ValidationError({"captcha_answer": "Please complete the simple security question."})
            if attrs["captcha_left"] + attrs["captcha_right"] != attrs["captcha_answer"]:
                raise serializers.ValidationError({"captcha_answer": "That answer is not correct. Please try again."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("company", "")
        budget = validated_data.pop("budget", "").strip()
        preferred_date = validated_data.pop("preferred_date", None)
        source = validated_data.pop("source", "").strip()
        validated_data.pop("captcha_left", None)
        validated_data.pop("captcha_right", None)
        validated_data.pop("captcha_answer", None)

        context_lines = []
        if source:
            context_lines.append(f"Source: {source}")
        if budget and budget != "Select a range":
            context_lines.append(f"Estimated budget: {budget}")
        if preferred_date:
            formatted_date = f"{preferred_date.strftime('%B')} {preferred_date.day}, {preferred_date.year}"
            context_lines.append(f"Preferred consultation date: {formatted_date}")
        if context_lines:
            validated_data["message"] = f"{validated_data['message']}\n\n" + "\n".join(context_lines)
        return ContactMessage.objects.create(**validated_data)
