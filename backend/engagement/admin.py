import csv

from django.contrib import admin
from django.http import HttpResponse

from .models import ContactMessage, Subscriber


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
    list_display = ("email", "is_active", "confirmed_at", "created_at", "source")
    list_filter = ("is_active", "source")
    search_fields = ("email",)
    readonly_fields = ("confirmation_token", "created_at", "updated_at")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "resolved", "notification_sent", "created_at")
    list_filter = ("resolved", "notification_sent", "created_at")
    list_editable = ("resolved", "notification_sent")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "updated_at")

# Register your models here.
