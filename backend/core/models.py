from django.core.validators import RegexValidator
from django.db import models


phone_validator = RegexValidator(
    regex=r"^\+?[0-9\s\-]{10,20}$",
    message="Enter a valid phone number.",
)


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SingletonModel(models.Model):
    singleton_pk = 1

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = self.singleton_pk
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=cls.singleton_pk)
        return obj


class SiteSettings(SingletonModel):
    site_name = models.CharField(max_length=120, default="Vincent Dania")
    short_name = models.CharField(max_length=80, default="Vincent Dania")
    site_description = models.TextField(
        default=(
            "Senior programme and project leader, IT professional, and digital builder "
            "working at the intersection of social impact, governance, and technology."
        )
    )
    site_keywords = models.CharField(
        max_length=255,
        default="Vincent Dania, programme manager, project manager, IT professional, digital transformation, social impact",
    )
    location = models.CharField(max_length=120, default="Abuja, Nigeria")
    public_email = models.EmailField(default="vincentdania@live.com")
    whatsapp_number = models.CharField(
        max_length=20,
        validators=[phone_validator],
        default="+2348034210082",
    )
    linkedin_url = models.URLField(default="https://www.linkedin.com/in/vincentdania/")
    cv_file = models.FileField(upload_to="cv/", blank=True, null=True)
    portrait_image = models.ImageField(upload_to="profile/", blank=True, null=True)
    contact_intro = models.TextField(
        default="For senior programme leadership, technology-enabled delivery, consulting, or advisory opportunities, get in touch."
    )
    footer_note = models.CharField(
        max_length=160,
        default="African-rooted, globally relevant leadership across programmes, policy, and technology.",
    )
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return self.site_name

    @property
    def whatsapp_url(self) -> str:
        digits = "".join(char for char in self.whatsapp_number if char.isdigit())
        if digits.startswith("0"):
            digits = f"234{digits[1:]}"
        return f"https://wa.me/{digits}"


class ProfileContent(SingletonModel):
    hero_eyebrow = models.CharField(max_length=120, default="Programme Leadership. Technology Delivery. Thoughtful Systems Change.")
    hero_title = models.CharField(
        max_length=255,
        default="Leading donor-funded programmes and building digital systems that deliver measurable social impact.",
    )
    hero_subtitle = models.TextField(
        default=(
            "Vincent Dania is a senior programme and project leader, IT professional, and "
            "product-minded builder working across governance, gender justice, social protection, and digital transformation."
        )
    )
    about_title = models.CharField(max_length=160, default="A hybrid professional built for complex delivery.")
    about_body = models.TextField(
        default=(
            "With more than 14 years of experience, Vincent Dania brings together programme "
            "leadership, donor accountability, monitoring and learning, and systems thinking.\n\n"
            "His work spans donor-funded implementation, institutional strengthening, gender "
            "justice, social protection, and technology-enabled delivery. He is equally "
            "comfortable coordinating multi-stakeholder programmes, translating policy into "
            "implementation, or working directly with builders to deliver digital products that improve accountability and learning."
        )
    )
    builder_title = models.CharField(max_length=160, default="He does not just manage projects. He builds systems.")
    builder_intro = models.TextField(
        default=(
            "Alongside programme leadership, Vincent has built and shipped public-facing digital products spanning AI education, "
            "SaaS, e-commerce, corporate web platforms, and nonprofit digital presence."
        )
    )
    expertise_title = models.CharField(max_length=160, default="Core competencies shaped by delivery, policy, and execution.")
    expertise_intro = models.TextField(
        default="The strongest thread across Vincent's work is execution: designing clear systems, aligning stakeholders, and delivering outcomes that hold under scrutiny."
    )
    education_title = models.CharField(max_length=160, default="Credentials that reinforce technical depth and management discipline.")
    education_intro = models.TextField(
        default="His academic and professional training strengthens a practice grounded in programme discipline, digital fluency, and continuous learning."
    )
    thought_leadership_title = models.CharField(max_length=160, default="Writing on technology, policy, and practical delivery.")
    thought_leadership_intro = models.TextField(
        default="Recent essays and research explore how technology, governance, and public systems can be designed for credibility, inclusion, and long-term value."
    )
    opportunities_title = models.CharField(max_length=160, default="Open to opportunities that require judgment, delivery discipline, and systems thinking.")
    opportunities_copy = models.TextField(
        default="Vincent is open to senior programme leadership, project management, consulting, advisory, remote, and onsite opportunities where strategy must translate into execution."
    )
    contact_title = models.CharField(max_length=160, default="Initiate a conversation.")
    contact_copy = models.TextField(
        default="If you are hiring, building a programme, or need a technology-enabled delivery partner, Vincent welcomes a thoughtful conversation."
    )

    class Meta:
        verbose_name = "Profile content"
        verbose_name_plural = "Profile content"

    def __str__(self):
        return "Profile content"


class CredibilityStat(models.Model):
    label = models.CharField(max_length=120)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Credibility stat"
        verbose_name_plural = "Credibility stats"

    def __str__(self):
        return self.label


class ImpactMetric(models.Model):
    icon = models.CharField(max_length=40, default="briefcase")
    value = models.CharField(max_length=80)
    label = models.CharField(max_length=120)
    detail = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Impact metric"
        verbose_name_plural = "Impact metrics"

    def __str__(self):
        return f"{self.value} {self.label}"


class Experience(TimestampedModel):
    title = models.CharField(max_length=160)
    organization = models.CharField(max_length=180)
    location = models.CharField(max_length=120, blank=True)
    employment_type = models.CharField(max_length=120, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    summary = models.TextField()
    achievements = models.TextField(
        help_text="Add one achievement per line.",
    )
    order = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-start_date"]
        verbose_name = "Experience"
        verbose_name_plural = "Experience"

    def __str__(self):
        return f"{self.title} - {self.organization}"

    @property
    def achievement_list(self) -> list[str]:
        return [item.strip() for item in self.achievements.splitlines() if item.strip()]

    @property
    def period_label(self) -> str:
        start = self.start_date.strftime("%b %Y")
        if self.is_current:
            return f"{start} - Present"
        if self.end_date:
            return f"{start} - {self.end_date.strftime('%b %Y')}"
        return start


class ExpertiseCategory(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    skills = models.TextField(help_text="Add one skill per line.")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Expertise category"
        verbose_name_plural = "Expertise categories"

    def __str__(self):
        return self.title

    @property
    def skill_list(self) -> list[str]:
        return [item.strip() for item in self.skills.splitlines() if item.strip()]


class EducationCredential(models.Model):
    title = models.CharField(max_length=180)
    institution = models.CharField(max_length=180)
    location = models.CharField(max_length=120, blank=True)
    start_year = models.PositiveIntegerField(blank=True, null=True)
    end_year = models.PositiveIntegerField(blank=True, null=True)
    is_in_progress = models.BooleanField(default=False)
    note = models.CharField(max_length=160, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "-end_year", "-start_year"]
        verbose_name = "Education credential"
        verbose_name_plural = "Education credentials"

    def __str__(self):
        return self.title

    @property
    def period_label(self) -> str:
        if self.is_in_progress and self.start_year and self.end_year:
            return f"{self.start_year} - {self.end_year} (In progress)"
        if self.start_year and self.end_year:
            return f"{self.start_year} - {self.end_year}"
        if self.end_year:
            return str(self.end_year)
        if self.start_year:
            return str(self.start_year)
        return ""


class Certification(models.Model):
    title = models.CharField(max_length=180)
    issuer = models.CharField(max_length=180)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Certification"
        verbose_name_plural = "Certifications"

    def __str__(self):
        return self.title


class Opportunity(models.Model):
    title = models.CharField(max_length=120)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Opportunity"
        verbose_name_plural = "Opportunities"

    def __str__(self):
        return self.title


class SocialLink(models.Model):
    LINKEDIN = "linkedin"
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    CUSTOM = "custom"
    PLATFORM_CHOICES = [
        (LINKEDIN, "LinkedIn"),
        (EMAIL, "Email"),
        (WHATSAPP, "WhatsApp"),
        (CUSTOM, "Custom"),
    ]

    platform = models.CharField(max_length=30, choices=PLATFORM_CHOICES, default=CUSTOM)
    label = models.CharField(max_length=60)
    url = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)
    visible_in_footer = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Social link"
        verbose_name_plural = "Social links"

    def __str__(self):
        return self.label

# Create your models here.
