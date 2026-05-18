from django.contrib import admin

from .models import (
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


class SingletonAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    list_display = ("site_name", "public_email", "location")
    fieldsets = (
        (
            "Identity & SEO",
            {
                "fields": (
                    "site_name",
                    "short_name",
                    "site_description",
                    "site_keywords",
                    "meta_title",
                    "meta_description",
                )
            },
        ),
        (
            "Contact & files",
            {
                "fields": (
                    "location",
                    "public_email",
                    "whatsapp_number",
                    "linkedin_url",
                    "cv_file",
                    "portrait_image",
                )
            },
        ),
        (
            "Primary calls to action",
            {
                "fields": (
                    "hero_primary_cta_label",
                    "hero_primary_cta_link",
                    "hero_secondary_cta_label",
                    "hero_secondary_cta_link",
                    "navbar_contact_label",
                    "navbar_contact_link",
                    "navbar_cv_label",
                )
            },
        ),
        (
            "Contact buttons & footer",
            {
                "fields": (
                    "contact_intro",
                    "contact_email_button_label",
                    "contact_whatsapp_button_label",
                    "contact_cv_button_label",
                    "footer_note",
                    "footer_copyright",
                )
            },
        ),
    )


@admin.register(ProfileContent)
class ProfileContentAdmin(SingletonAdmin):
    list_display = ("hero_title", "opportunities_title")
    fieldsets = (
        ("Hero", {"fields": ("hero_eyebrow", "hero_title", "hero_subtitle")}),
        ("About", {"fields": ("about_title", "about_body")}),
        ("Builder portfolio", {"fields": ("builder_title", "builder_intro")}),
        ("Expertise", {"fields": ("expertise_title", "expertise_intro")}),
        ("Education", {"fields": ("education_title", "education_intro")}),
        (
            "Thought leadership",
            {"fields": ("thought_leadership_title", "thought_leadership_intro")},
        ),
        ("Opportunities", {"fields": ("opportunities_title", "opportunities_copy")}),
        ("Contact section", {"fields": ("contact_title", "contact_copy")}),
    )


@admin.register(BlogSettings)
class BlogSettingsAdmin(SingletonAdmin):
    list_display = ("index_title", "subscribe_title")
    fieldsets = (
        ("Index page", {"fields": ("index_badge_label", "index_title", "index_intro")}),
        (
            "Featured and archive",
            {
                "fields": (
                    "featured_badge_label",
                    "featured_fallback_title",
                    "archive_eyebrow",
                    "archive_title",
                    "archive_intro",
                    "archive_link_label",
                )
            },
        ),
        (
            "Subscription and SEO",
            {
                "fields": (
                    "subscribe_badge_label",
                    "subscribe_title",
                    "subscribe_description",
                    "detail_back_label",
                    "detail_meta_heading",
                    "meta_title",
                    "meta_description",
                )
            },
        ),
    )


@admin.register(CredibilityStat)
class CredibilityStatAdmin(admin.ModelAdmin):
    list_display = ("label", "order")
    list_editable = ("order",)
    ordering = ("order",)


@admin.register(ImpactMetric)
class ImpactMetricAdmin(admin.ModelAdmin):
    list_display = ("value", "label", "icon", "order")
    list_editable = ("icon", "order")
    ordering = ("order",)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "organization", "period_summary", "featured", "order")
    list_filter = ("featured", "is_current", "organization")
    list_editable = ("featured", "order")
    search_fields = ("title", "organization", "summary", "achievements")
    ordering = ("order", "-start_date")

    @admin.display(description="Period")
    def period_summary(self, obj):
        return obj.period_label


@admin.register(ExpertiseCategory)
class ExpertiseCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    list_editable = ("order",)
    search_fields = ("title", "description", "skills")


@admin.register(EducationCredential)
class EducationCredentialAdmin(admin.ModelAdmin):
    list_display = ("title", "institution", "period_summary", "order")
    list_editable = ("order",)
    search_fields = ("title", "institution", "note")

    @admin.display(description="Period")
    def period_summary(self, obj):
        return obj.period_label


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ("title", "issuer", "order")
    list_editable = ("order",)
    search_fields = ("title", "issuer")


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    list_editable = ("order",)
    search_fields = ("title",)


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ("label", "platform", "url", "visible_in_footer", "order")
    list_filter = ("platform", "visible_in_footer")
    list_editable = ("visible_in_footer", "order")
    search_fields = ("label", "url")


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ("label", "href", "visible", "open_in_new_tab", "order")
    list_editable = ("visible", "open_in_new_tab", "order")
    search_fields = ("label", "href")
