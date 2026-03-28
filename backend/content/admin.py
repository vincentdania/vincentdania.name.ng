from django.contrib import admin

from .models import Article, ArticleCategory, ArticleTag, Project


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "description")


@admin.register(ArticleTag)
class ArticleTagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "featured", "published_at", "updated_at")
    list_filter = ("status", "featured", "categories", "tags")
    list_editable = ("featured",)
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "summary", "body", "meta_title", "meta_description")
    filter_horizontal = ("categories", "tags")
    fieldsets = (
        ("Core content", {"fields": ("title", "slug", "summary", "body", "cover_image")}),
        ("Taxonomy", {"fields": ("categories", "tags")}),
        ("Publishing", {"fields": ("author_name", "status", "featured", "published_at", "reading_time_minutes")}),
        ("SEO", {"fields": ("meta_title", "meta_description")}),
    )


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "featured", "display_order")
    list_filter = ("category", "featured")
    list_editable = ("featured", "display_order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "short_description", "long_description", "tech_stack", "role_label")

# Register your models here.
