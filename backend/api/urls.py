from django.urls import path

from .views import (
    ArticleDetailView,
    ArticleListView,
    ContactMessageCreateView,
    FeaturedArticleView,
    HealthCheckView,
    ProjectListView,
    PublicSiteView,
    SubscriberCreateView,
)

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("site/", PublicSiteView.as_view(), name="site"),
    path("articles/", ArticleListView.as_view(), name="articles"),
    path("articles/featured/", FeaturedArticleView.as_view(), name="featured-articles"),
    path("articles/<slug:slug>/", ArticleDetailView.as_view(), name="article-detail"),
    path("projects/", ProjectListView.as_view(), name="projects"),
    path("subscribers/", SubscriberCreateView.as_view(), name="subscriber-create"),
    path("contact/", ContactMessageCreateView.as_view(), name="contact-create"),
]
