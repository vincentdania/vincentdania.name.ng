from django import forms


class SubscriberImportForm(forms.Form):
    emails_text = forms.CharField(
        label="Paste email addresses",
        required=False,
        widget=forms.Textarea(attrs={"rows": 12, "class": "vLargeTextField"}),
        help_text="Paste one email per line, comma-separated values, or any text that contains email addresses.",
    )
    csv_file = forms.FileField(
        label="Upload CSV",
        required=False,
        help_text="Optional CSV file with an email column or raw email values.",
    )
    source = forms.CharField(
        max_length=80,
        initial="admin-import",
        help_text="Saved with each imported subscriber.",
    )
    reactivate_existing = forms.BooleanField(
        required=False,
        initial=True,
        help_text="If checked, inactive subscribers found in the import are reactivated.",
    )

    def clean(self):
        cleaned_data = super().clean()
        emails_text = cleaned_data.get("emails_text")
        csv_file = cleaned_data.get("csv_file")

        if not emails_text and not csv_file:
            raise forms.ValidationError("Paste email addresses or upload a CSV file.")

        return cleaned_data
