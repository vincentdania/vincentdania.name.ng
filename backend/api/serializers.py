from rest_framework import serializers

from content.models import Article, Project
from core.models import (
    Certification,
    CredibilityStat,
    EducationCredential,
    Experience,
    ExpertiseCategory,
    ImpactMetric,
    Opportunity,
    ProfileContent,
    SiteSettings,
    SocialLink,
)
from engagement.models import ContactMessage, Subscriber


def media_url(request, value):
    if not value:
        return ""
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
    body = serializers.CharField()
    meta_title = serializers.CharField()
    meta_description = serializers.CharField()

    class Meta(ArticleListSerializer.Meta):
        fields = ArticleListSerializer.Meta.fields + ["body", "meta_title", "meta_description"]


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
            subscriber.save(update_fields=["is_active", "updated_at"])
        return subscriber


class ContactMessageCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    email = serializers.EmailField()
    subject = serializers.CharField(max_length=180)
    message = serializers.CharField(min_length=20, max_length=4000)
    company = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate_company(self, value):
        if value:
            raise serializers.ValidationError("Invalid submission.")
        return value

    def create(self, validated_data):
        validated_data.pop("company", "")
        return ContactMessage.objects.create(**validated_data)
