import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  Mail,
  MessageCircleMore,
} from "lucide-react";

import { fetchSitePayload } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

import { ArticleCard } from "@/components/articles/article-card";
import { ContactForm } from "@/components/forms/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { ExperienceCard } from "@/components/sections/experience-card";
import { MetricCard } from "@/components/sections/metric-card";
import { ProjectCard } from "@/components/sections/project-card";
import { SectionHeader } from "@/components/sections/section-header";
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

export default async function HomePage() {
  const data = await fetchSitePayload();
  const { site_settings: settings, profile } = data;

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

        <section className="section-space pb-10">
          <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="fade-in">
              <Badge>{profile.hero_eyebrow}</Badge>
              <h1 className="display-title mt-8 text-5xl text-foreground sm:text-7xl">
                {profile.hero_title}
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                {profile.hero_subtitle}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
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
            </div>

            <div className="relative mx-auto max-w-[34rem]">
              <div className="hero-orbit inset-8 hidden lg:block" />
              <div className="hero-orbit -inset-3 hidden lg:block" />
              <div className="editorial-panel relative overflow-hidden rounded-[2.2rem] p-4 sm:p-5">
                <div className="grain relative overflow-hidden rounded-[1.9rem] bg-surface-strong">
                  <div className="relative aspect-[4/5]">
                    {settings.portrait_image_url ? (
                      <Image
                        src={settings.portrait_image_url}
                        alt="Portrait of Vincent Dania"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-accent-soft">
                        <p className="font-display text-3xl text-accent">
                          Vincent Dania
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Card className="absolute -bottom-6 left-5 w-[14rem] bg-white">
                <CardContent className="space-y-2 p-5">
                  <p className="font-display text-4xl leading-none text-accent">14+</p>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
                    Years of experience
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="shell mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.credibility_stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.75rem] border border-border/70 bg-white/80 px-5 py-5 text-sm font-medium text-muted shadow-sm"
              >
                {stat.label}
              </div>
            ))}
          </div>
        </section>

        <section className="section-space">
          <div className="shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeader
              eyebrow="About Vincent"
              title={profile.about_title}
              description="A personal brand built around delivery, public value, and technology-enabled execution."
            />
            <div className="space-y-6 text-base leading-8 text-muted sm:text-lg">
              {profile.about_paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space bg-white/55">
          <div className="shell">
            <SectionHeader
              eyebrow="Impact"
              title="Career highlights backed by measurable delivery."
              description="Programme leadership, digital systems, and community-facing outcomes drawn directly from Vincent's work."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.impact_metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="shell space-y-10">
            <SectionHeader
              eyebrow="Experience"
              title="A professional trajectory defined by leadership, accountability, and structured execution."
            />
            <div className="space-y-6">
              {data.experiences.map((experience) => (
                <ExperienceCard
                  key={`${experience.title}-${experience.organization}`}
                  experience={experience}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="shell accent-panel grain overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="max-w-3xl">
              <SectionHeader
                eyebrow="Digital Products & Platforms"
                title={profile.builder_title}
                description={profile.builder_intro}
                theme="inverse"
              />
            </div>
            <div className="mt-12 grid gap-5 xl:grid-cols-2">
              {data.projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-space bg-white/55">
          <div className="shell">
            <SectionHeader
              eyebrow="Expertise"
              title={profile.expertise_title}
              description={profile.expertise_intro}
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {data.expertise_categories.map((category) => (
                <Card key={category.title} className="h-full">
                  <CardContent className="space-y-5">
                    <div>
                      <p className="eyebrow">{category.title}</p>
                      <p className="mt-4 text-sm leading-7 text-muted">
                        {category.description}
                      </p>
                    </div>
                    <ul className="space-y-3 text-sm leading-7 text-muted-strong">
                      {category.skills.map((skill) => (
                        <li key={skill} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <SectionHeader
                eyebrow="Education"
                title={profile.education_title}
                description={profile.education_intro}
              />
              <div className="space-y-4">
                {data.education.map((credential) => (
                  <Card key={credential.title}>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="font-display text-2xl text-foreground">
                          {credential.title}
                        </p>
                        <Badge variant="muted">{credential.period_label}</Badge>
                      </div>
                      <p className="text-base font-medium text-accent">
                        {credential.institution}
                      </p>
                      <p className="text-sm leading-7 text-muted">
                        {credential.location}
                        {credential.note ? ` • ${credential.note}` : ""}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <SectionHeader
                eyebrow="Certifications"
                title="Globally recognized professional credentials."
              />
              <Card className="bg-surface">
                <CardContent className="space-y-4">
                  {data.certifications.map((certification) => (
                    <div
                      key={certification.title}
                      className="rounded-[1.5rem] border border-border/60 bg-white px-5 py-5"
                    >
                      <p className="font-medium text-foreground">
                        {certification.title}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {certification.issuer}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {data.featured_article ? (
          <section className="section-space bg-white/55">
            <div className="shell space-y-10">
              <SectionHeader
                eyebrow="Thought Leadership"
                title={profile.thought_leadership_title}
                description={profile.thought_leadership_intro}
              />
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="overflow-hidden bg-white">
                  <CardContent className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <Badge>{data.featured_article.categories[0]?.name || "Featured"}</Badge>
                      <h3 className="font-display text-4xl leading-tight text-foreground">
                        {data.featured_article.title}
                      </h3>
                      <p className="text-base leading-8 text-muted">
                        {data.featured_article.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                        <span>{new Date(data.featured_article.published_at).toLocaleDateString()}</span>
                        <span>{data.featured_article.reading_time_minutes} min read</span>
                      </div>
                      <Button asChild>
                        <Link href={`/articles/${data.featured_article.slug}`}>
                          Read featured article
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(15,91,76,0.16),rgba(15,91,76,0.03))] p-6">
                      <p className="eyebrow">Editorial note</p>
                      <p className="mt-6 font-display text-3xl leading-tight text-foreground">
                        Clear thinking on policy, technology, and practical delivery.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6">
                  {data.recent_articles.slice(0, 3).map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
              <Button asChild variant="secondary">
                <Link href="/articles">View all articles</Link>
              </Button>
            </div>
          </section>
        ) : null}

        <section className="section-space">
          <div className="shell accent-panel overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="space-y-5">
              <SectionHeader
                eyebrow="Open to opportunities"
                title={profile.opportunities_title}
                description={profile.opportunities_copy}
                theme="inverse"
              />
                <div className="flex flex-wrap gap-3">
                  {data.opportunities.map((opportunity) => (
                    <span
                      key={opportunity.title}
                      className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/88"
                    >
                      {opportunity.title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/6 p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.18em] text-white/65">
                      Availability
                    </p>
                    <p className="mt-1 font-display text-3xl text-white">
                      Remote, onsite, consulting, and advisory work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-space bg-white/55">
          <div className="shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <SectionHeader
                eyebrow="Contact"
                title={profile.contact_title}
                description={profile.contact_copy}
              />
              <Card>
                <CardContent className="space-y-5">
                  <p className="text-sm leading-7 text-muted">
                    {settings.contact_intro}
                  </p>
                  <div className="grid gap-3">
                    <a
                      href={`mailto:${settings.public_email}`}
                      className="flex items-center gap-3 rounded-[1.5rem] bg-surface-strong px-4 py-4 text-sm text-foreground transition-colors hover:bg-accent-soft"
                    >
                      <Mail className="h-4 w-4 text-accent" />
                      {settings.public_email}
                    </a>
                    <a
                      href={settings.whatsapp_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-[1.5rem] bg-surface-strong px-4 py-4 text-sm text-foreground transition-colors hover:bg-accent-soft"
                    >
                      <MessageCircleMore className="h-4 w-4 text-accent" />
                      WhatsApp Vincent
                    </a>
                    {settings.cv_file_url ? (
                      <a
                        href={settings.cv_file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-[1.5rem] bg-surface-strong px-4 py-4 text-sm text-foreground transition-colors hover:bg-accent-soft"
                      >
                        <Download className="h-4 w-4 text-accent" />
                        Download CV
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent>
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
