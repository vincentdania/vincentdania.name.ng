import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  Globe2,
  Landmark,
  Mail,
  MessageCircleMore,
  MonitorCog,
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
  const heroPillars = [
    {
      title: "Programme leadership",
      detail: "Donor-funded delivery with pace, judgment, and accountability.",
      icon: Landmark,
    },
    {
      title: "Institutional strengthening",
      detail: "Systems, MEL discipline, and stakeholder alignment that hold.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Digital systems",
      detail: "Products and platforms that improve efficiency and reach.",
      icon: MonitorCog,
    },
  ];
  const aboutHighlights = [
    "14+ years across programme delivery, governance, and social protection.",
    "Strong range across MEL, donor reporting, coordination, and execution.",
    "Hands-on builder of learning systems, web platforms, and digital products.",
  ];
  const featuredExperience = data.experiences.slice(0, 4);
  const compactExpertise = data.expertise_categories.map((category) => ({
    ...category,
    previewSkills: category.skills.slice(0, 4),
    extraSkills: Math.max(category.skills.length - 4, 0),
  }));

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
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                {profile.hero_subtitle}
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroPillars.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.6rem] border border-border/70 bg-white/78 p-4 shadow-[0_14px_30px_rgba(23,34,28,0.04)]"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
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
              <Card className="absolute left-5 top-5 hidden w-[13rem] border-border/60 bg-white/92 lg:block">
                <CardContent className="space-y-2 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
                    Base
                  </p>
                  <p className="font-display text-2xl leading-none text-foreground">
                    Abuja, Nigeria
                  </p>
                  <p className="text-sm leading-6 text-muted">
                    Open to remote, onsite, and advisory opportunities.
                  </p>
                </CardContent>
              </Card>
              <Card className="absolute -bottom-6 left-5 w-[14rem] border-border/60 bg-white">
                <CardContent className="space-y-2 p-5">
                  <p className="font-display text-4xl leading-none text-accent">14+</p>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
                    Years of experience
                  </p>
                </CardContent>
              </Card>
              <Card className="absolute bottom-8 right-5 hidden w-[13rem] border-border/60 bg-accent text-white xl:block">
                <CardContent className="space-y-2 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Positioning
                  </p>
                  <p className="font-display text-2xl leading-none">
                    African-rooted.
                  </p>
                  <p className="text-sm leading-6 text-white/80">
                    Internationally credible. Built for delivery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="shell mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.credibility_stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-[1.75rem] border border-border/70 bg-white/80 px-5 py-5 text-sm font-medium text-muted shadow-sm"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                {stat.label}
              </div>
            ))}
          </div>
        </section>

        <section className="section-space">
          <div className="shell grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <SectionHeader
              eyebrow="About Vincent"
              title={profile.about_title}
              description="A compact view of the blend behind Vincent's work: programme rigor, institutional judgment, and builder-level fluency."
            />
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <Card className="editorial-panel overflow-hidden">
                <CardContent className="space-y-5">
                  {profile.about_paragraphs.slice(0, 2).map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-muted sm:text-[1.02rem]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>
              <div className="grid gap-4">
                {aboutHighlights.map((item, index) => (
                  <Card
                    key={item}
                    className={index === 1 ? "bg-accent text-white" : "bg-white/90"}
                  >
                    <CardContent className="p-5">
                      <p
                        className={`text-sm leading-7 ${
                          index === 1 ? "text-white/82" : "text-muted"
                        }`}
                      >
                        {item}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-surface">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <Globe2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Value proposition
                      </p>
                      <p className="mt-2 font-display text-2xl leading-tight text-foreground">
                        Strategy that stays executable.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="section-space bg-white/55">
          <div className="shell">
            <SectionHeader
              eyebrow="Impact"
              title="Career highlights backed by measurable delivery."
              description="Selected proof points from grant delivery, digital learning, and institution-facing systems work."
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
              description="Selected roles across movement building, governance work, MEL-heavy delivery, and technology-enabled implementation."
            />
            <div className="grid gap-6 xl:grid-cols-2">
              {featuredExperience.map((experience) => (
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
                description="A tighter view of the platforms and products that show Vincent can move from management into build execution."
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
              description="Capability clusters designed to scan quickly."
            />
            <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {compactExpertise.map((category) => (
                <Card key={category.title} className="h-full">
                  <CardContent className="space-y-4">
                    <div>
                      <p className="eyebrow">{category.title}</p>
                      <p className="clamp-3 mt-4 text-sm leading-6 text-muted">
                        {category.description}
                      </p>
                    </div>
                    <ul className="space-y-3 text-sm leading-6 text-muted-strong">
                      {category.previewSkills.map((skill) => (
                        <li key={skill} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                    {category.extraSkills > 0 ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        +{category.extraSkills} more capabilities
                      </p>
                    ) : null}
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
                description="Academic and professional depth, presented without the clutter."
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
                      <p className="text-sm leading-6 text-muted">
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
                <CardContent className="grid gap-4 sm:grid-cols-2">
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
                description="Recent writing, surfaced in a lighter editorial layout."
              />
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="overflow-hidden bg-white">
                  <CardContent className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4">
                      <Badge>{data.featured_article.categories[0]?.name || "Featured"}</Badge>
                      <h3 className="font-display text-4xl leading-tight text-foreground">
                        {data.featured_article.title}
                      </h3>
                      <p className="clamp-4 text-base leading-7 text-muted">
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
                    <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(0,128,128,0.15),rgba(0,128,128,0.03))] p-6">
                      <p className="eyebrow">Editorial note</p>
                      <p className="mt-5 font-display text-3xl leading-tight text-foreground">
                        Clear thinking on policy, technology, and practical delivery.
                      </p>
                      <p className="mt-4 text-sm leading-6 text-muted">
                        Research-led, implementation-aware, and written for people who need usable insight.
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
                description="Work settings and mandates where Vincent adds the most value."
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
                description="A cleaner path to start a conversation."
              />
              <Card>
                <CardContent className="space-y-5">
                  <p className="text-sm leading-6 text-muted">
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
