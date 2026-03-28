import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Mail,
  MessageCircleMore,
} from "lucide-react";

import { fetchSitePayload } from "@/lib/api";
import type { ArticlePreview, ExpertiseCategory } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

import { ContactForm } from "@/components/forms/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Vincent",
  description:
    "Senior programme and project leader, IT professional, and digital builder with 14+ years of experience in donor-funded delivery and technology-enabled social impact.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const articleDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatArticleDate(dateString: string) {
  return articleDateFormatter.format(new Date(dateString));
}

function distributeIntoColumns<T>(items: T[], columnCount: number) {
  const columns = Array.from({ length: columnCount }, () => [] as T[]);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns.filter((column) => column.length > 0);
}

function getArticleKicker(article: ArticlePreview) {
  return article.categories[0]?.name || article.tags[0]?.name || "Article";
}

function ExpertiseColumn({
  categories,
}: {
  categories: ExpertiseCategory[];
}) {
  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category.title} className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {category.title}
            </p>
            <p className="text-sm leading-7 text-muted">{category.description}</p>
          </div>
          <ul className="space-y-3">
            {category.skills.map((skill) => (
              <li key={skill} className="flex items-start gap-3 text-sm leading-7 text-foreground">
                <span className="mt-3 h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const data = await fetchSitePayload();
  const { site_settings: settings, profile } = data;

  const featuredArticle = data.featured_article ?? data.recent_articles[0] ?? null;
  const additionalArticles = data.recent_articles
    .filter((article) => article.slug !== featuredArticle?.slug)
    .slice(0, 3);
  const expertiseColumns = distributeIntoColumns(data.expertise_categories, 3);
  const aboutParagraphs =
    profile.about_paragraphs.length > 0
      ? profile.about_paragraphs.slice(0, 2)
      : [profile.about_body];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.site_name,
    url: absoluteUrl("/"),
    image: settings.portrait_image_url || absoluteUrl("/og-default.svg"),
    jobTitle:
      "Senior Programme & Project Manager, IT Professional, and Digital Builder",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Abuja",
      addressCountry: "Nigeria",
    },
    sameAs: [settings.linkedin_url],
    email: settings.public_email,
  };

  return (
    <>
      <SiteNavbar siteName={settings.site_name} cvUrl={settings.cv_file_url} />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <section className="section-space pb-14 pt-8">
          <div className="shell grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="fade-in space-y-8">
              <Badge variant="muted">{profile.hero_eyebrow}</Badge>
              <div className="space-y-6">
                <h1 className="display-title max-w-4xl text-[clamp(3.4rem,8vw,7rem)] text-foreground">
                  {profile.hero_title}
                </h1>
                <p className="max-w-xl text-base leading-8 text-muted sm:text-lg">
                  {profile.hero_subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {settings.cv_file_url ? (
                  <Button asChild size="lg">
                    <a href={settings.cv_file_url} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                      Download CV
                    </a>
                  </Button>
                ) : null}
                <Button asChild size="lg" variant="secondary">
                  <Link href="#contact">Contact Me</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/articles">
                    Read Articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <a href={settings.whatsapp_url} target="_blank" rel="noreferrer">
                    <MessageCircleMore className="h-4 w-4" />
                    WhatsApp Me
                  </a>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {data.credibility_stats.slice(0, 4).map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.35rem] border border-border/60 bg-white/75 px-5 py-4 text-sm leading-6 text-muted shadow-[0_10px_24px_rgba(42,42,42,0.04)]"
                  >
                    {stat.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[38rem]">
              <div className="editorial-grid absolute inset-6 hidden rounded-[1.75rem] border border-border/60 lg:block" />
              <div className="editorial-panel relative ml-auto overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-surface-strong">
                  {settings.portrait_image_url ? (
                    <Image
                      src={settings.portrait_image_url}
                      alt="Portrait of Vincent Dania"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 34rem, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-accent-soft">
                      <p className="font-display text-4xl text-foreground">Vincent Dania</p>
                    </div>
                  )}
                </div>
              </div>

              <Card className="absolute -bottom-8 left-0 w-[13.5rem] bg-white/96">
                <CardContent className="space-y-2 p-5">
                  <p className="font-display text-5xl leading-none text-foreground">14+</p>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                    Years leading delivery
                  </p>
                  <p className="text-sm leading-6 text-muted">
                    Programme leadership across social impact, governance, and digital delivery.
                  </p>
                </CardContent>
              </Card>

              <Card className="absolute right-0 top-8 hidden w-[15rem] bg-white/90 lg:block">
                <CardContent className="space-y-3 p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                    Current focus
                  </p>
                  <p className="font-display text-2xl leading-tight text-foreground">
                    Open to remote, onsite, consulting, and advisory roles.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-xl space-y-5">
              <p className="eyebrow">About Vincent</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.6rem)] leading-[0.98] text-foreground">
                A synthesis of strategic leadership and technical precision.
              </h2>
            </div>

            <div className="space-y-5 text-base leading-8 text-muted sm:text-lg">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="shell mt-14 grid gap-4 md:grid-cols-3">
            {data.impact_metrics.slice(0, 3).map((metric) => (
              <Card key={metric.label} className="bg-white/82">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-display text-4xl leading-none text-foreground">
                      {metric.value}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {metric.label}
                    </p>
                  </div>
                  <p className="text-sm leading-7 text-muted">{metric.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="surface-shift section-space">
          <div className="shell space-y-10">
            <div className="max-w-3xl space-y-5">
              <p className="eyebrow">Professional Trajectory</p>
              <h2 className="font-display text-[clamp(2.45rem,5vw,4.2rem)] leading-[1.02] text-foreground">
                A career built on delivery discipline, institutional trust, and measurable execution.
              </h2>
            </div>

            <div className="space-y-4">
              {data.experiences.map((experience) => (
                <article
                  key={`${experience.title}-${experience.organization}`}
                  className="rounded-[1.5rem] border border-border/70 bg-white/88 px-6 py-6 shadow-[0_14px_30px_rgba(42,42,42,0.04)] sm:px-8 sm:py-8 lg:grid lg:grid-cols-[180px_1fr_1.1fr] lg:gap-8"
                >
                  <div className="space-y-3 border-border/60 pb-5 text-sm text-muted lg:border-r lg:pb-0 lg:pr-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                      {experience.period_label}
                    </p>
                    <p>{experience.location}</p>
                    <p>{experience.employment_type}</p>
                  </div>

                  <div className="space-y-3 pt-5 lg:pt-0">
                    <h3 className="font-display text-[1.9rem] leading-tight text-foreground">
                      {experience.title}
                    </h3>
                    <p className="text-sm uppercase tracking-[0.12em] text-muted">
                      {experience.organization}
                    </p>
                  </div>

                  <div className="space-y-4 pt-5 lg:pt-0">
                    <p className="text-sm leading-7 text-muted">{experience.summary}</p>
                    <ul className="space-y-3">
                      {experience.achievements.slice(0, 3).map((achievement) => (
                        <li
                          key={achievement}
                          className="flex items-start gap-3 text-sm leading-7 text-foreground"
                        >
                          <span className="mt-3 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="shell accent-panel grain overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="max-w-3xl space-y-5">
              <p className="eyebrow text-white/65">The Builder&apos;s Portfolio</p>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.4rem)] leading-[1.02] text-white">
                {profile.builder_title}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                {profile.builder_intro}
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              {data.projects.map((project) => (
                <article
                  key={project.slug}
                  className="rounded-[1.45rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Badge className="bg-white/8 text-white" variant="secondary">
                      {project.category_label}
                    </Badge>
                    {project.live_url ? (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
                      >
                        Live site
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-display text-3xl leading-tight text-white">
                        {project.name}
                      </h3>
                      <p className="text-sm leading-7 text-white/70">
                        {project.short_description}
                      </p>
                    </div>

                    <p className="text-sm leading-7 text-white/75">{project.long_description}</p>

                    <div className="space-y-4 pt-2">
                      <div className="rounded-[1rem] border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/72">
                        {project.role_label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((item) => (
                          <span
                            key={item}
                            className="rounded-md border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-white/62"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="shell grid gap-10 xl:grid-cols-[1fr_1fr_1fr_0.92fr]">
            <div className="space-y-6 xl:col-span-3">
              <div className="max-w-3xl space-y-5">
                <p className="eyebrow">Core Competencies</p>
                <h2 className="font-display text-[clamp(2.45rem,5vw,4.2rem)] leading-[1.02] text-foreground">
                  {profile.expertise_title}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {profile.expertise_intro}
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {expertiseColumns.map((column, index) => (
                  <ExpertiseColumn key={index} categories={column} />
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Card className="bg-surface">
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <p className="eyebrow">Academic Excellence</p>
                    <h3 className="font-display text-3xl leading-tight text-foreground">
                      Advanced study across technology, management, and social protection.
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {data.education.map((credential) => (
                      <div key={credential.title} className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
                          {credential.period_label}
                        </p>
                        <p className="font-medium text-foreground">{credential.title}</p>
                        <p className="text-sm leading-6 text-muted">
                          {credential.institution}
                          {credential.note ? ` • ${credential.note}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <p className="eyebrow">Certifications & Credentials</p>
                    <h3 className="font-display text-3xl leading-tight text-foreground">
                      Practice-led credentials aligned with complex programme delivery.
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {data.certifications.map((certification) => (
                      <div key={certification.title} className="space-y-1">
                        <p className="font-medium text-foreground">{certification.title}</p>
                        <p className="text-sm leading-6 text-muted">{certification.issuer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {featuredArticle ? (
          <section className="surface-shift section-space">
            <div className="shell space-y-10">
              <div className="max-w-3xl space-y-5">
                <p className="eyebrow">Thought Leadership</p>
                <h2 className="font-display text-[clamp(2.45rem,5vw,4.2rem)] leading-[1.02] text-foreground">
                  {profile.thought_leadership_title}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {profile.thought_leadership_intro}
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
                <article className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-white shadow-[0_16px_36px_rgba(42,42,42,0.05)]">
                  <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
                    <div className="relative min-h-[18rem] bg-surface-strong">
                      {featuredArticle.cover_image_url ? (
                        <Image
                          src={featuredArticle.cover_image_url}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1280px) 34rem, 100vw"
                          unoptimized
                        />
                      ) : (
                        <div className="editorial-grid flex h-full items-end bg-[linear-gradient(180deg,rgba(237,229,215,0.7),rgba(218,210,196,0.95))] p-8">
                          <p className="font-display text-4xl leading-tight text-foreground">
                            Clear thinking on policy, governance, and delivery.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6 p-8">
                      <Badge variant="muted">{getArticleKicker(featuredArticle)}</Badge>
                      <div className="space-y-4">
                        <h3 className="font-display text-[2.2rem] leading-tight text-foreground">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-sm leading-7 text-muted">
                          {featuredArticle.summary}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                        <span>{formatArticleDate(featuredArticle.published_at)}</span>
                        <span>{featuredArticle.reading_time_minutes} min read</span>
                      </div>
                      <Button asChild>
                        <Link href={`/articles/${featuredArticle.slug}`}>
                          Read featured article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>

                <div className="grid gap-4">
                  {additionalArticles.map((article) => (
                    <article
                      key={article.slug}
                      className="overflow-hidden rounded-[1.45rem] border border-border/70 bg-white shadow-[0_14px_30px_rgba(42,42,42,0.04)]"
                    >
                      <div className="grid sm:grid-cols-[170px_1fr]">
                        <div className="relative min-h-[11rem] bg-surface-strong">
                          {article.cover_image_url ? (
                            <Image
                              src={article.cover_image_url}
                              alt={article.title}
                              fill
                              className="object-cover"
                              sizes="170px"
                              unoptimized
                            />
                          ) : (
                            <div className="editorial-grid flex h-full items-end bg-[linear-gradient(180deg,rgba(220,239,238,0.4),rgba(237,229,215,0.85))] p-5">
                              <p className="font-display text-2xl leading-tight text-foreground">
                                {getArticleKicker(article)}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4 p-6">
                          <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                              {getArticleKicker(article)}
                            </p>
                            <h3 className="font-display text-[1.75rem] leading-tight text-foreground">
                              {article.title}
                            </h3>
                            <p className="text-sm leading-7 text-muted">{article.summary}</p>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-sm text-muted">
                            <span>{formatArticleDate(article.published_at)}</span>
                            <Link
                              href={`/articles/${article.slug}`}
                              className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-accent"
                            >
                              Read article
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <Button asChild variant="secondary">
                <Link href="/articles">View all articles</Link>
              </Button>
            </div>
          </section>
        ) : null}

        <section className="section-space pb-0">
          <div className="shell accent-panel overflow-hidden rounded-[1.8rem] px-6 py-10 sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="space-y-5">
                <p className="eyebrow text-white/65">Open to opportunities</p>
                <h2 className="font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.04] text-white">
                  Open to high-impact opportunities.
                </h2>
                <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                  {profile.opportunities_copy}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {data.opportunities.map((opportunity) => (
                  <span
                    key={opportunity.title}
                    className="rounded-lg border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/82"
                  >
                    {opportunity.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-space">
          <div className="shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-7">
              <div className="space-y-5">
                <p className="eyebrow">Contact</p>
                <h2 className="font-display text-[clamp(2.55rem,5vw,4.6rem)] leading-[1.02] text-foreground">
                  Initiate a conversation.
                </h2>
                <p className="max-w-xl text-base leading-8 text-muted sm:text-lg">
                  {profile.contact_copy}
                </p>
              </div>

              <div className="grid gap-3">
                <a
                  href={`mailto:${settings.public_email}`}
                  className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-border/70 bg-white px-5 py-4 transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      Email Vincent
                    </span>
                  </span>
                  <span className="text-sm text-muted">{settings.public_email}</span>
                </a>

                <a
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-border/70 bg-white px-5 py-4 transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircleMore className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      WhatsApp Vincent
                    </span>
                  </span>
                  <span className="text-sm text-muted">Quick response channel</span>
                </a>

                {settings.cv_file_url ? (
                  <a
                    href={settings.cv_file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-border/70 bg-white px-5 py-4 transition-colors hover:bg-surface"
                  >
                    <span className="flex items-center gap-3">
                      <Download className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">
                        Download CV
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted" />
                  </a>
                ) : null}
              </div>
            </div>

            <Card className="bg-white/96">
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="eyebrow">Send a message</p>
                  <p className="text-sm leading-7 text-muted">{settings.contact_intro}</p>
                </div>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} socialLinks={data.social_links} />
    </>
  );
}
