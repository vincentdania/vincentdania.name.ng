import csv

from django.contrib import admin
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.response import TemplateResponse
from django.urls import path

from .forms import SubscriberImportForm
from .models import ContactMessage, NewsletterCampaign, NewsletterDelivery, Subscriber
from .services import import_subscribers, send_campaign


@admin.action(description="Export selected subscribers to CSV")
def export_subscribers(modeladmin, request, queryset):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="subscribers.csv"'
    writer = csv.writer(response)
    writer.writerow(["Email", "Active", "Confirmed at", "Created at", "Source"])
    for subscriber in queryset.order_by("email"):
        writer.writerow(
            [
                subscriber.email,
                subscriber.is_active,
                subscriber.confirmed_at.isoformat() if subscriber.confirmed_at else "",
                subscriber.created_at.isoformat(),
                subscriber.source,
            ]
        )
    return response


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    actions = [export_subscribers]
    change_list_template = "admin/engagement/subscriber/change_list.html"
    list_display = ("email", "is_active", "confirmed_at", "created_at", "source")
    list_filter = ("is_active", "source")
    search_fields = ("email",)
    readonly_fields = ("confirmation_token", "created_at", "updated_at")

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "import/",
                self.admin_site.admin_view(self.import_view),
                name="engagement_subscriber_import",
            ),
        ]
        return custom_urls + urls

    def import_view(self, request):
        form = SubscriberImportForm(request.POST or None, request.FILES or None)

        if request.method == "POST" and form.is_valid():
            summary = import_subscribers(
                pasted_text=form.cleaned_data["emails_text"],
                csv_file=form.cleaned_data.get("csv_file"),
                source=form.cleaned_data["source"],
                reactivate_existing=form.cleaned_data["reactivate_existing"],
            )
            self.message_user(
                request,
                (
                    f"Processed {summary['processed']} email(s): "
                    f"{summary['created']} created, "
                    f"{summary['reactivated']} reactivated, "
                    f"{summary['existing']} already present."
                ),
            )
            return redirect("..")

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "title": "Import subscribers",
            "form": form,
        }
        return TemplateResponse(
            request,
            "admin/engagement/subscriber/import_form.html",
            context,
        )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "resolved", "notification_sent", "created_at")
    list_filter = ("resolved", "notification_sent", "created_at")
    list_editable = ("resolved", "notification_sent")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "updated_at")


@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    actions = ["send_selected_campaigns"]
    list_display = (
        "name",
        "campaign_type",
        "status",
        "recipient_count",
        "delivered_count",
        "sent_at",
        "updated_at",
    )
    list_filter = ("campaign_type", "status", "sent_at")
    search_fields = ("name", "subject", "preview_text", "heading", "intro", "body")
    readonly_fields = (
        "recipient_count",
        "delivered_count",
        "sent_at",
        "last_error",
        "created_at",
        "updated_at",
    )
    fieldsets = (
        ("Campaign", {"fields": ("name", "campaign_type", "status")}),
        (
            "Email content",
            {
                "fields": (
                    "subject",
                    "preview_text",
                    "heading",
                    "intro",
                    "body",
                    "article",
                )
            },
        ),
        ("Call to action", {"fields": ("call_to_action_label", "call_to_action_url")}),
        (
            "Sending status",
            {
                "fields": (
                    "recipient_count",
                    "delivered_count",
                    "sent_at",
                    "last_error",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.action(description="Send selected email campaigns to active subscribers")
    def send_selected_campaigns(self, request, queryset):
        messages = []
        for campaign in queryset:
            summary = send_campaign(campaign)
            messages.append(
                (
                    f"{campaign.name}: sent {summary['sent']}, "
                    f"failed {summary['failed']}, "
                    f"already sent {summary['already_sent']}."
                )
            )

        for message in messages:
            self.message_user(request, message)


@admin.register(NewsletterDelivery)
class NewsletterDeliveryAdmin(admin.ModelAdmin):
    list_display = ("campaign", "subscriber", "status", "sent_at", "created_at")
    list_filter = ("status", "sent_at")
    search_fields = ("campaign__name", "subscriber__email", "error_message")
    readonly_fields = ("campaign", "subscriber", "status", "sent_at", "error_message", "created_at", "updated_at")
