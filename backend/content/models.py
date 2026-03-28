from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ArticleCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Article category"
        verbose_name_plural = "Article categories"

    def __str__(self):
        return self.name


class ArticleTag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Article tag"
        verbose_name_plural = "Article tags"

    def __str__(self):
        return self.name


class Article(TimestampedModel):
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"
    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_PUBLISHED, "Published"),
    ]

    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True, blank=True)
    summary = models.TextField()
    body = models.TextField(help_text="Rich-text compatible HTML content.")
    cover_image = models.ImageField(upload_to="articles/", blank=True, null=True)
    categories = models.ManyToManyField(ArticleCategory, related_name="articles", blank=True)
    tags = models.ManyToManyField(ArticleTag, related_name="articles", blank=True)
    author_name = models.CharField(max_length=120, default="Vincent Dania")
    featured = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    published_at = models.DateTimeField(blank=True, null=True)
    meta_title = models.CharField(max_length=160, blank=True)
    meta_description = models.TextField(blank=True)
    reading_time_minutes = models.PositiveIntegerField(default=6)

    class Meta:
        ordering = ["-featured", "-published_at", "-created_at"]
        verbose_name = "Article"
        verbose_name_plural = "Articles"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if self.status == self.STATUS_PUBLISHED and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)


class Project(TimestampedModel):
    CATEGORY_AI = "ai-education"
    CATEGORY_ECOMMERCE = "e-commerce"
    CATEGORY_SAAS = "saas"
    CATEGORY_CORPORATE = "corporate-website"
    CATEGORY_NONPROFIT = "nonprofit-platform"
    CATEGORY_CHOICES = [
        (CATEGORY_AI, "AI Education"),
        (CATEGORY_ECOMMERCE, "E-commerce"),
        (CATEGORY_SAAS, "SaaS"),
        (CATEGORY_CORPORATE, "Corporate Website"),
        (CATEGORY_NONPROFIT, "Nonprofit Platform"),
    ]

    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    short_description = models.TextField()
    long_description = models.TextField()
    live_url = models.URLField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    tech_stack = models.CharField(max_length=255, help_text="Comma-separated stack or role labels.")
    role_label = models.CharField(max_length=120, blank=True)
    featured_image = models.ImageField(upload_to="projects/", blank=True, null=True)
    featured = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "name"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def tech_stack_list(self) -> list[str]:
        return [item.strip() for item in self.tech_stack.split(",") if item.strip()]

    @property
    def category_label(self) -> str:
        return self.get_category_display()

# Create your models here.
