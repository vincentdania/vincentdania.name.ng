import Image from "next/image";
import Link from "next/link";
import { Noto_Serif } from "next/font/google";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Download,
  Globe2,
  GraduationCap,
  Landmark,
  Laptop2,
  MapPin,
  MessageCircleMore,
  ReceiptText,
  Send,
  ShieldCheck,
  Users2,
} from "lucide-react";

import { fetchSitePayload } from "@/lib/api";
import type { ArticlePreview, Experience, ExpertiseCategory, Project } from "@/lib/types";
import { absoluteUrl, cn } from "@/lib/utils";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Vincent",
  description:
    "Senior programme and project leader, IT professional, and digital builder with 14+ years of experience in donor-funded delivery and technology-enabled social impact.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const productVisuals: {
  matcher: string;
  icon: LucideIcon;
  toneClass: string;
}[] = [
  { matcher: "ai", icon: BrainCircuit, toneClass: "bg-[#008080]" },
  { matcher: "invoice", icon: ReceiptText, toneClass: "bg-slate-500" },
  { matcher: "hyrax", icon: BriefcaseBusiness, toneClass: "bg-[#515f74]" },
  { matcher: "patience", icon: Users2, toneClass: "bg-emerald-600" },
];

function getProductVisual(project: Project, index: number) {
  const normalized = `${project.slug} ${project.name}`.toLowerCase();
  const match = productVisuals.find((item) => normalized.includes(item.matcher));
  if (match) {
    return match;
  }

  const fallbackVisuals = [
    { icon: Landmark, toneClass: "bg-indigo-600" },
    { icon: Globe2, toneClass: "bg-amber-600" },
  ];

  return fallbackVisuals[index % fallbackVisuals.length];
}

function getExperienceHighlights(experiences: Experience[]) {
  const preferredTitles = [
    "Programme Coordinator - Male Feminists Network",
    "Programme Coordinator - BUILD Grant & Side by Side Movement",
    "Programme & Information Technology Officer",
    "Adjunct Instructor (Programming Fundamentals - Python)",
  ];

  const selected = preferredTitles
    .map((title) => experiences.find((experience) => experience.title === title))
    .filter((experience): experience is Experience => Boolean(experience));

  return selected.length > 0 ? selected : experiences.slice(0, 4);
}

function getExperienceKicker(experience: Experience) {
  const title = experience.title.toLowerCase();
  if (title.includes("male feminists") || title.includes("build grant")) {
    return "Programme Leadership & Delivery";
  }
  if (title.includes("technology") || title.includes("it")) {
    return "Systems Architecture & Operations";
  }
  if (title.includes("adjunct")) {
    return "Teaching & Capacity Building";
  }
  return experience.organization;
}

function getCompetencyHighlights(categories: ExpertiseCategory[]) {
  const preferred = [
    "Programme & Project Management",
    "Monitoring, Evaluation & Learning",
    "Digital Transformation & IT",
    "Stakeholder, Donor & Partnership Management",
  ];

  const selected = preferred
    .map((title) => categories.find((category) => category.title === title))
    .filter((category): category is ExpertiseCategory => Boolean(category));

  return selected.length > 0 ? selected : categories.slice(0, 4);
}

function getCompetencyIcon(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("programme")) {
    return BriefcaseBusiness;
  }
  if (normalized.includes("monitoring") || normalized.includes("evaluation")) {
    return BarChart3;
  }
  if (normalized.includes("digital") || normalized.includes("it")) {
    return Laptop2;
  }
  return Users2;
}

function abbreviateIssuer(issuer: string) {
  if (issuer.includes("PM4NGOs")) {
    return "PM4NGOs";
  }
  if (issuer.includes("Project Management Institute") || issuer.includes("(PMI)")) {
    return "PMI";
  }
  if (issuer.includes("CIPMN")) {
    return "CIPMN";
  }
  if (issuer.includes("Strategic Management")) {
    return "ISMN";
  }
  return issuer
    .split(" ")
    .map((part) => part.replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 6);
}

function getThoughtLeadershipArticles(
  featured: ArticlePreview | null,
  recent: ArticlePreview[],
) {
  if (!featured) {
    return recent.slice(0, 2);
  }

  return [featured, ...recent.filter((article) => article.slug !== featured.slug)].slice(0, 2);
}

function getArticleKicker(article: ArticlePreview) {
  return article.categories[0]?.name || article.tags[0]?.name || "Thought Leadership";
}

export default async function HomePage() {
  const data = await fetchSitePayload();
  const { profile, site_settings: settings } = data;

  const experienceHighlights = getExperienceHighlights(data.experiences);
  const competencyHighlights = getCompetencyHighlights(data.expertise_categories);
  const thoughtLeadershipArticles = getThoughtLeadershipArticles(
    data.featured_article,
    data.recent_articles,
  );

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

      <main className="bg-[#f9fafb] pt-24 text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:items-center lg:py-28 sm:px-8">
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center space-x-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#0f766e]">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>Global Impact & Systems Design</span>
            </div>

            <h1
              className={cn(
                notoSerif.className,
                "max-w-4xl text-[2.85rem] leading-[0.95] text-slate-900 sm:text-5xl lg:text-7xl",
              )}
            >
              {profile.hero_title}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-slate-500 sm:text-xl">
              {profile.hero_subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-4 font-bold text-white transition-all hover:bg-accent-strong sm:px-8"
                href="#contact"
              >
                Work with Vincent
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                className="inline-flex rounded-lg border border-slate-200 bg-white px-6 py-4 font-bold text-slate-900 transition-all hover:bg-slate-100 sm:px-8"
                href="#tech"
              >
                View Portfolio
              </a>
            </div>
          </div>

          <div className="group relative lg:col-span-5">
            <div className="absolute -inset-4 rounded-2xl bg-accent/5 transition-transform group-hover:rotate-0 group-hover:scale-[1.01] lg:rotate-3" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-2xl">
              {settings.portrait_image_url ? (
                <Image
                  src={settings.portrait_image_url}
                  alt="Vincent Dania professional portrait"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200">
                  <p className={cn(notoSerif.className, "text-4xl text-slate-700")}>
                    Vincent Dania
                  </p>
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 left-0 hidden rounded-lg bg-white p-5 shadow-xl md:block lg:-left-6">
              <div className={cn(notoSerif.className, "text-4xl font-bold text-accent")}>14+</div>
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-slate-500">
                Years Experience
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white px-5 py-24 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-start gap-16 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className={cn(notoSerif.className, "text-4xl text-slate-900")}>
                  A Synthesis of Strategic Leadership and Technical Precision.
                </h2>
                <div className="h-1 w-24 bg-accent" />
              </div>

              <div className="space-y-8 text-lg leading-relaxed text-slate-500">
                <p>
                  With over <span className="font-bold text-accent">14 years of professional trajectory</span>, I
                  have dedicated my career to the intersection of digital transformation and
                  international development. My work bridges the gap between complex donor
                  mandates and ground-level execution.
                </p>
                <p>
                  I specialize in <span className="font-bold text-accent">IT-enabled systems thinking</span>,
                  leveraging data and scalable platforms to maximize program efficiency. From
                  managing multi-million dollar donor portfolios to building custom enterprise
                  tools, my approach is defined by intentionality, governance, and measurable
                  outcomes.
                </p>
              </div>
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Building2,
                  value: "$2M+",
                  label: "Donor-Funded Portfolios",
                  borderClass: "border-accent",
                },
                {
                  icon: GraduationCap,
                  value: "8,000+",
                  label: "Learners Managed (LMS)",
                  borderClass: "border-accent/60",
                },
                {
                  icon: ShieldCheck,
                  value: "5,000+",
                  label: "Successful Completions",
                  borderClass: "border-accent/30",
                },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className={cn(
                      "flex flex-col justify-between rounded-xl border-b-4 bg-[#f9fafb] p-8 transition-transform hover:-translate-y-1",
                      metric.borderClass,
                    )}
                  >
                    <Icon className="mb-4 h-10 w-10 text-accent" />
                    <div>
                      <div className={cn(notoSerif.className, "mb-1 text-3xl font-bold text-slate-900")}>
                        {metric.value}
                      </div>
                      <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                        {metric.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="experience" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className={cn(notoSerif.className, "mb-4 text-4xl text-slate-900")}>
              Career Highlights
            </h2>
          </div>

          <div className="space-y-12">
            {experienceHighlights.map((experience, index) => (
              <div
                key={`${experience.title}-${experience.organization}`}
                className="group grid items-start gap-8 pb-12 md:grid-cols-12"
              >
                <div className="md:col-span-3">
                  <span className={cn(index === 0 ? "font-bold text-accent" : "font-medium text-slate-500", "text-lg")}>
                    {experience.period_label}
                  </span>
                  {index === 0 ? (
                    <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Current Mandate
                    </div>
                  ) : null}
                </div>

                <div className="rounded-xl bg-[#f3f4f6] p-8 transition-colors group-hover:bg-accent/5 md:col-span-9">
                  <h3 className={cn(notoSerif.className, "mb-2 text-2xl text-slate-900")}>
                    {experience.title}
                  </h3>
                  <p className="mb-4 font-semibold italic text-accent">
                    {getExperienceKicker(experience)}
                  </p>
                  <ul className="space-y-3 leading-relaxed text-slate-500">
                    <li className="flex gap-3">
                      <span className="text-accent">/</span>
                      <span>{experience.summary}</span>
                    </li>
                    {experience.achievements.slice(0, 2).map((achievement) => (
                      <li key={achievement} className="flex gap-3">
                        <span className="text-accent">/</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="tech" className="relative overflow-hidden bg-slate-900 px-5 py-24 sm:px-8">
          <div className="absolute right-0 top-0 h-full w-1/3 translate-x-32 skew-x-12 bg-accent/10" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className={cn(notoSerif.className, "mb-4 text-4xl text-white")}>
                  The Builder Portfolio
                </h2>
                <p className="max-w-xl text-slate-400">
                  A portfolio of purpose-built digital solutions addressing complex organisational
                  and educational challenges.
                </p>
              </div>
              <a
                className="inline-flex items-center gap-2 font-bold text-accent hover:underline"
                href="#tech-grid"
              >
                View Technical Stack
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div id="tech-grid" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((project, index) => {
                const visual = getProductVisual(project, index);
                const Icon = visual.icon;
                return (
                  <article
                    key={project.slug}
                    className="group rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:border-accent/50"
                  >
                    <div
                      className={cn(
                        "mb-6 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                        visual.toneClass,
                      )}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={cn(notoSerif.className, "mb-2 text-xl text-white")}>
                      {project.name}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-slate-400">
                      {project.short_description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[project.category_label, project.tech_stack[0]].filter(Boolean).map((item) => (
                        <span
                          key={`${project.slug}-${item}`}
                          className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-16 px-5 py-24 lg:grid-cols-12 sm:px-8">
          <div className="space-y-4 lg:col-span-4">
            <h2 className={cn(notoSerif.className, "text-4xl text-slate-900")}>Core Competencies</h2>
            <p className="leading-relaxed text-slate-500">
              A multidimensional skill set honed through high-stakes project delivery, academic
              rigor, and hands-on technology building.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:col-span-8">
            {competencyHighlights.map((category) => {
              const Icon = getCompetencyIcon(category.title);
              return (
                <div key={category.title} className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">
                    <Icon className="h-4 w-4" />
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-slate-900"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-[#f3f4f6] px-5 py-24 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-16 md:flex-row">
            <div className="flex-1 space-y-8">
              <h3 className={cn(notoSerif.className, "border-l-4 border-accent pl-6 text-2xl text-slate-900")}>
                Academic Excellence
              </h3>
              <div className="space-y-8">
                {data.education.slice(0, 3).map((credential) => (
                  <div key={credential.title}>
                    <p className="font-bold text-slate-900">{credential.title}</p>
                    <p className="text-sm text-slate-500">
                      {credential.institution}
                      {credential.location ? `, ${credential.location}` : ""}
                      {credential.note ? (
                        <>
                          {" – "}
                          <span className="italic">{credential.note}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <h3
                className={cn(
                  notoSerif.className,
                  "border-l-4 border-accent/50 pl-6 text-2xl text-slate-900",
                )}
              >
                Global Certifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {data.certifications.slice(0, 4).map((certification) => (
                  <div
                    key={certification.title}
                    className="rounded-lg border-t-2 border-accent bg-white p-4 shadow-sm"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {abbreviateIssuer(certification.issuer)}
                    </p>
                    <p className="text-sm font-bold text-slate-900">{certification.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="articles" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <h2 className={cn(notoSerif.className, "mb-2 text-4xl text-slate-900")}>
                Thought Leadership
              </h2>
              <p className="text-slate-500">Selected writings on policy and program management.</p>
            </div>
            <Link
              href="/articles"
              className="group inline-flex items-center gap-1 font-bold text-accent"
            >
              Full Archive
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {thoughtLeadershipArticles.map((article, index) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
                <article>
                  <div className="relative mb-6 aspect-video overflow-hidden rounded-xl bg-slate-200">
                    {article.cover_image_url ? (
                      <Image
                        src={article.cover_image_url}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        unoptimized
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-full items-end p-6 transition-transform duration-700 group-hover:scale-105",
                          index === 0
                            ? "bg-[linear-gradient(135deg,#dbeafe,#f3f4f6)]"
                            : "bg-[linear-gradient(135deg,#e0f2fe,#ecfeff)]",
                        )}
                      >
                        <p className={cn(notoSerif.className, "max-w-xs text-2xl leading-tight text-slate-900")}>
                          {getArticleKicker(article)}
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-accent/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    {getArticleKicker(article)}
                  </span>
                  <h3
                    className={cn(
                      notoSerif.className,
                      "mb-3 text-2xl text-slate-900 transition-colors group-hover:text-accent",
                    )}
                  >
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {article.summary}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 px-5 py-20 text-center text-white sm:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex justify-center">
              <span className="rounded-full border border-accent px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Global Availability
              </span>
            </div>
            <h2 className={cn(notoSerif.className, "text-4xl")}>Open to High-Impact Opportunities.</h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-accent" />
                <span className="font-medium text-slate-300">Remote</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="font-medium text-slate-300">Onsite</span>
              </div>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-accent" />
                <span className="font-medium text-slate-300">Advisory & Consulting</span>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-white p-10 shadow-xl sm:p-12 lg:p-20">
            <div className="absolute right-0 top-0 hidden p-12 text-accent/5 lg:block">
              <Send className="h-64 w-64 stroke-1" />
            </div>

            <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8">
                <h2 className={cn(notoSerif.className, "text-4xl text-slate-900 sm:text-5xl")}>
                  Start a Conversation
                </h2>
                <p className="max-w-md text-xl leading-relaxed text-slate-500">
                  Whether it&apos;s AI, programme design and delivery, or capacity-building and
                  training, I&apos;m available to explore how I can support your goals.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-accent py-5 text-center text-lg font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-strong"
                  href={`mailto:${settings.public_email}`}
                >
                  <Send className="h-5 w-5" />
                  Send Email
                </a>
                <a
                  className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#25D366] py-5 text-center text-lg font-bold text-white shadow-lg shadow-[#25D366]/25 transition-all hover:bg-[#1ebe5d]"
                  href={settings.whatsapp_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircleMore className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
                {settings.cv_file_url ? (
                  <a
                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#f3f4f6] py-5 text-center text-lg font-bold text-slate-900 transition-all hover:bg-slate-200"
                    href={settings.cv_file_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Download className="h-5 w-5" />
                    Download Full CV
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} socialLinks={data.social_links} />
    </>
  );
}
