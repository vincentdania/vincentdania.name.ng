export interface NamedSlug {
  name: string;
  slug: string;
}

export interface SiteSettings {
  site_name: string;
  short_name: string;
  site_description: string;
  site_keywords: string;
  location: string;
  public_email: string;
  whatsapp_number: string;
  whatsapp_url: string;
  linkedin_url: string;
  contact_intro: string;
  footer_note: string;
  meta_title: string;
  meta_description: string;
  cv_file_url: string;
  portrait_image_url: string;
}

export interface ProfileContent {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_body: string;
  about_paragraphs: string[];
  builder_title: string;
  builder_intro: string;
  expertise_title: string;
  expertise_intro: string;
  education_title: string;
  education_intro: string;
  thought_leadership_title: string;
  thought_leadership_intro: string;
  opportunities_title: string;
  opportunities_copy: string;
  contact_title: string;
  contact_copy: string;
}

export interface CredibilityStat {
  label: string;
  order: number;
}

export interface ImpactMetric {
  icon: string;
  value: string;
  label: string;
  detail: string;
  order: number;
}

export interface Experience {
  title: string;
  organization: string;
  location: string;
  employment_type: string;
  summary: string;
  achievements: string[];
  period_label: string;
  featured: boolean;
  order: number;
}

export interface ExpertiseCategory {
  title: string;
  description: string;
  skills: string[];
  order: number;
}

export interface EducationCredential {
  title: string;
  institution: string;
  location: string;
  note: string;
  period_label: string;
  order: number;
}

export interface Certification {
  title: string;
  issuer: string;
  order: number;
}

export interface Opportunity {
  title: string;
  order: number;
}

export interface SocialLink {
  platform: string;
  label: string;
  url: string;
  order: number;
  visible_in_footer: boolean;
}

export interface Project {
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  live_url: string;
  display_order: number;
  category: string;
  category_label: string;
  tech_stack: string[];
  role_label: string;
  featured_image_url: string;
  featured: boolean;
}

export interface ArticlePreview {
  title: string;
  slug: string;
  summary: string;
  author_name: string;
  featured: boolean;
  published_at: string;
  reading_time_minutes: number;
  cover_image_url: string;
  categories: NamedSlug[];
  tags: NamedSlug[];
}

export interface Article extends ArticlePreview {
  body: string;
  meta_title: string;
  meta_description: string;
}

export interface SitePayload {
  site_settings: SiteSettings;
  profile: ProfileContent;
  credibility_stats: CredibilityStat[];
  impact_metrics: ImpactMetric[];
  experiences: Experience[];
  expertise_categories: ExpertiseCategory[];
  education: EducationCredential[];
  certifications: Certification[];
  opportunities: Opportunity[];
  social_links: SocialLink[];
  projects: Project[];
  featured_article: ArticlePreview | null;
  recent_articles: ArticlePreview[];
}
