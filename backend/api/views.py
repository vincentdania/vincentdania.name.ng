from django.db.models import Prefetch
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

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

from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    CertificationSerializer,
    ContactMessageCreateSerializer,
    CredibilityStatSerializer,
    EducationCredentialSerializer,
    ExperienceSerializer,
    ExpertiseCategorySerializer,
    ImpactMetricSerializer,
    OpportunitySerializer,
    ProfileContentSerializer,
    ProjectSerializer,
    SiteSettingsSerializer,
    SocialLinkSerializer,
    SubscriberCreateSerializer,
)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


class PublicSiteView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        featured_article = (
            Article.objects.filter(status=Article.STATUS_PUBLISHED, featured=True)
            .prefetch_related("categories", "tags")
            .order_by("-published_at")
            .first()
        )
        recent_articles = (
            Article.objects.filter(status=Article.STATUS_PUBLISHED)
            .exclude(pk=getattr(featured_article, "pk", None))
            .prefetch_related("categories", "tags")
            .order_by("-published_at")[:4]
        )
        projects = Project.objects.filter(featured=True).order_by("display_order")

        payload = {
            "site_settings": SiteSettingsSerializer(SiteSettings.load(), context={"request": request}).data,
            "profile": ProfileContentSerializer(ProfileContent.load()).data,
            "credibility_stats": CredibilityStatSerializer(CredibilityStat.objects.all(), many=True).data,
            "impact_metrics": ImpactMetricSerializer(ImpactMetric.objects.all(), many=True).data,
            "experiences": ExperienceSerializer(Experience.objects.filter(featured=True), many=True).data,
            "expertise_categories": ExpertiseCategorySerializer(ExpertiseCategory.objects.all(), many=True).data,
            "education": EducationCredentialSerializer(EducationCredential.objects.all(), many=True).data,
            "certifications": CertificationSerializer(Certification.objects.all(), many=True).data,
            "opportunities": OpportunitySerializer(Opportunity.objects.all(), many=True).data,
            "social_links": SocialLinkSerializer(SocialLink.objects.filter(visible_in_footer=True), many=True).data,
            "projects": ProjectSerializer(projects, many=True, context={"request": request}).data,
            "featured_article": ArticleListSerializer(featured_article, context={"request": request}).data if featured_article else None,
            "recent_articles": ArticleListSerializer(recent_articles, many=True, context={"request": request}).data,
        }
        return Response(payload)


class ArticleListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer
    queryset = Article.objects.filter(status=Article.STATUS_PUBLISHED).prefetch_related("categories", "tags")
    search_fields = ["title", "summary", "body", "categories__name", "tags__name"]
    ordering_fields = ["published_at", "created_at", "title"]
    ordering = ["-published_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get("category")
        tag = self.request.query_params.get("tag")
        featured = self.request.query_params.get("featured")

        if category:
            queryset = queryset.filter(categories__slug=category)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        if featured in {"true", "1"}:
            queryset = queryset.filter(featured=True)
        return queryset.distinct()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class FeaturedArticleView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ArticleListSerializer

    def get_queryset(self):
        return (
            Article.objects.filter(status=Article.STATUS_PUBLISHED, featured=True)
            .prefetch_related("categories", "tags")
            .order_by("-published_at")[:1]
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ArticleDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ArticleDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Article.objects.filter(status=Article.STATUS_PUBLISHED).prefetch_related("categories", "tags")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ProjectListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all().order_by("display_order")
        featured = self.request.query_params.get("featured")
        if featured in {"true", "1"}:
            queryset = queryset.filter(featured=True)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class SubscriberCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = SubscriberCreateSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "subscriber"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "detail": "Subscription received. You are on the list for new articles.",
                "double_opt_in_ready": True,
            },
            status=status.HTTP_201_CREATED,
        )


class ContactMessageCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactMessageCreateSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "detail": "Message received. Vincent will be able to follow up from the admin console or future email automation.",
            },
            status=status.HTTP_201_CREATED,
        )

# Create your views here.
