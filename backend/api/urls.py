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
    SubscriberUnsubscribeView,
)

def route_with_optional_slash(pattern, view, name):
    normalized = pattern.rstrip("/")
    if not normalized:
        return [path(pattern, view, name=name)]

    return [
        path(f"{normalized}/", view, name=name),
        path(normalized, view, name=f"{name}-noslash"),
    ]


urlpatterns = [
    *route_with_optional_slash("health/", HealthCheckView.as_view(), "health"),
    *route_with_optional_slash("site/", PublicSiteView.as_view(), "site"),
    *route_with_optional_slash("articles/", ArticleListView.as_view(), "articles"),
    *route_with_optional_slash(
        "articles/featured/",
        FeaturedArticleView.as_view(),
        "featured-articles",
    ),
    *route_with_optional_slash(
        "articles/<slug:slug>/",
        ArticleDetailView.as_view(),
        "article-detail",
    ),
    *route_with_optional_slash("projects/", ProjectListView.as_view(), "projects"),
    *route_with_optional_slash(
        "subscribers/",
        SubscriberCreateView.as_view(),
        "subscriber-create",
    ),
    *route_with_optional_slash(
        "subscribers/unsubscribe/<str:token>/",
        SubscriberUnsubscribeView.as_view(),
        "subscriber-unsubscribe",
    ),
    *route_with_optional_slash(
        "contact/",
        ContactMessageCreateView.as_view(),
        "contact-create",
    ),
]
