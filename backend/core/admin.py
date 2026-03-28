from django.contrib import admin

from .models import (
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


class SingletonAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not self.model.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    list_display = ("site_name", "public_email", "location")


@admin.register(ProfileContent)
class ProfileContentAdmin(SingletonAdmin):
    list_display = ("hero_title", "opportunities_title")


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

# Register your models here.
