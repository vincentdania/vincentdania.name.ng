import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Globe2,
  Landmark,
  Mail,
  ShieldCheck,
  Users2,
  Workflow,
} from "lucide-react";

import { fetchSitePayload } from "@/lib/api";
import { absoluteUrl, cn } from "@/lib/utils";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SectionHeader } from "@/components/sections/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const studyTitle =
  "Artificial Intelligence and Labour Market Risk in Nigeria: Implications for Adaptive Social Protection Design in High-Informality Contexts";
const studySummary =
  "A doctoral research project examining how AI-driven labour market risk in Nigeria should shape adaptive social protection design in high-informality contexts.";
const heroImagePath = "/phd/hero-portrait.jpg";

const researchQuestions = [
  "What labour market risks are likely to emerge in Nigeria in relation to AI?",
  "Which groups of workers are most exposed, particularly within the informal sector?",
  "How well do existing social protection programmes respond to these risks?",
  "What design features are required for a more adaptive social protection system?",
];

const studyObjectives = [
  {
    icon: BarChart3,
    text: "Analyse AI-related labour market risks in Nigeria.",
  },
  {
    icon: Users2,
    text: "Identify vulnerable groups and sectors.",
  },
  {
    icon: ShieldCheck,
    text: "Assess the responsiveness of existing social protection programmes.",
  },
  {
    icon: Workflow,
    text: "Propose an adaptive social protection framework.",
  },
];

const significanceItems = [
  {
    icon: Landmark,
    title: "Policy-relevant insights",
    description:
      "Provides evidence-based recommendations for Nigerian policymakers navigating digital transformation and labour market change.",
  },
  {
    icon: Globe2,
    title: "Global contribution",
    description:
      "Adds to the wider conversation on the future of work, AI, and social protection in emerging economies.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Systemic gaps",
    description:
      "Surfaces critical deficiencies in current social safety nets, especially for workers operating outside the formal economy.",
  },
  {
    icon: BrainCircuit,
    title: "Adaptive design",
    description:
      "Offers practical guidance for building social protection systems that can evolve alongside technological change.",
  },
];

export async function generatePhdMetadata(): Promise<Metadata> {
  const siteData = await fetchSitePayload().catch(() => null);
  const siteName = siteData?.site_settings.site_name || "Vincent Dania";

  return {
    title: studyTitle,
    description: studySummary,
    alternates: {
      canonical: absoluteUrl("/phd"),
    },
    openGraph: {
      title: `${studyTitle} | ${siteName}`,
      description: studySummary,
      url: absoluteUrl("/phd"),
      images: [absoluteUrl(heroImagePath)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${studyTitle} | ${siteName}`,
      description: studySummary,
      images: [absoluteUrl(heroImagePath)],
    },
  };
}

export async function PhdPageView() {
  const siteData = await fetchSitePayload();
  const { site_settings: settings } = siteData;
  const contactEmail = settings.public_email || "vincentdania@live.com";
  const linkedinUrl =
    settings.linkedin_url || "https://www.linkedin.com/in/vincentdania/";

  return (
    <>
      <SiteNavbar
        siteName={settings.site_name}
        navigationItems={siteData.navigation_items}
        cvUrl={settings.cv_file_url}
        cvLabel={settings.navbar_cv_label}
        primaryCtaLabel={settings.navbar_contact_label}
        primaryCtaLink={settings.navbar_contact_link}
      />

      <main className="flex-1 bg-background pt-24 text-foreground">
        <section className="section-space overflow-hidden">
          <div className="shell grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,27rem)]">
            <div className="space-y-8 fade-in">
              <Badge className="w-fit" variant="default">
                PhD Research in Social Protection
              </Badge>

              <div className="space-y-5">
                <h1 className="font-display text-[clamp(2.45rem,4.9vw,4.65rem)] leading-[1] tracking-[-0.04em] text-foreground">
                  {studyTitle}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                  {studySummary}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <span className="h-px w-12 bg-accent" />
                <span className="eyebrow text-accent">By Vincent Dania</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[29rem] fade-in">
              <div className="absolute -right-4 -top-4 h-full w-full rounded-[1.8rem] border border-accent/12" />
              <Card className="relative overflow-hidden rounded-[1.8rem] border-border/60 bg-white shadow-[0_18px_40px_rgba(42,42,42,0.05)]">
                <CardContent className="relative aspect-square p-5 sm:p-6">
                  <Image
                    src={heroImagePath}
                    alt="Vincent Dania speaking during a workshop session, styled for the PhD research page."
                    fill
                    priority
                    sizes="(min-width: 1024px) 28rem, 80vw"
                    className="rounded-xl object-cover"
                  />
                  <div className="editorial-grid pointer-events-none absolute inset-5 rounded-xl border border-white/35" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-32 bg-white py-20">
          <div className="shell grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl lg:sticky lg:top-32">
                About the Study
              </h2>
            </div>
            <div className="max-w-4xl">
              <p className="text-base leading-8 text-muted sm:text-lg">
                This research investigates the intersection of rapid technological
                advancement and socio-economic stability in Africa&apos;s largest economy.
                As Artificial Intelligence begins to permeate global value chains, the
                study specifically focuses on the Nigerian labour market&apos;s unique
                architecture. By analyzing the vulnerabilities of both formal and
                informal sectors, the research aims to bridge the gap between
                AI-driven transformation and the necessary evolution of social safety
                nets.
              </p>
            </div>
          </div>
        </section>

        <section id="aim" className="scroll-mt-32 py-20">
          <div className="shell">
            <div className="rounded-[1.75rem] border border-border/70 bg-white p-8 shadow-[0_18px_40px_rgba(42,42,42,0.04)] sm:p-10 lg:p-12">
              <div className="border-l-[3px] border-accent pl-6 sm:pl-8">
                <p className="eyebrow text-accent">Primary Aim of the Study</p>
                <blockquote className="mt-5 max-w-5xl font-display text-[clamp(1.75rem,3vw,2.7rem)] leading-[1.35] text-foreground">
                  To examine emerging AI-related labour market risks in Nigeria and
                  assess how social protection systems can be designed or adapted to
                  respond effectively within a high-informality context.
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <section id="questions" className="scroll-mt-32 section-space pt-6">
          <div className="shell">
            <SectionHeader title="Research Questions" />

            <ol className="mt-12 grid gap-6 md:grid-cols-2">
              {researchQuestions.map((question, index) => (
                <li key={question} className="fade-in">
                  <Card className="h-full rounded-[1.2rem] border-border/70 bg-white shadow-none transition-colors hover:border-accent/30">
                    <CardContent className="flex h-full gap-5 p-6 sm:p-7">
                      <span className="font-display text-5xl leading-none text-accent/22">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-2 font-display text-xl leading-tight text-foreground sm:text-2xl">
                        {question}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="objectives"
          className="scroll-mt-32 accent-panel grain py-24"
        >
          <div className="shell">
            <SectionHeader
              title="Objectives of the Study"
              align="center"
              theme="inverse"
            />

            <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {studyObjectives.map(({ icon: Icon, text }) => (
                <li key={text} className="fade-in">
                  <Card className="h-full rounded-[1.25rem] border-white/10 bg-white/6 text-white shadow-none backdrop-blur-sm">
                    <CardContent className="flex h-full flex-col gap-5 p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-accent-soft">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold leading-7 text-white/92">
                        {text}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="significance"
          className="scroll-mt-32 section-space bg-white"
        >
          <div className="shell grid items-center gap-12 lg:grid-cols-[minmax(16rem,26rem)_1fr]">
            <div className="fade-in">
              <Card className="overflow-hidden rounded-[1.6rem] shadow-[0_20px_42px_rgba(42,42,42,0.07)]">
                <CardContent className="relative aspect-[4/5] p-0">
                  <Image
                    src="/phd/study-insights.png"
                    alt="Laptop and charts representing research analysis and evidence generation."
                    fill
                    sizes="(min-width: 1024px) 26rem, 100vw"
                    className="object-cover"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-10">
              <SectionHeader
                title="Significance of the Study"
                description="The study is designed to produce practical value for policy, labour market governance, and adaptive social protection design."
              />

              <ul className="space-y-6">
                {significanceItems.map(({ icon: Icon, title, description }) => (
                  <li key={title} className="fade-in">
                    <article className="flex gap-4 rounded-[1.2rem] bg-surface/70 p-5 transition-colors hover:bg-surface-strong/75">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl leading-tight text-foreground">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-muted sm:text-base">
                          {description}
                        </p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-32 py-20">
          <div className="shell border-t border-border/80 pt-14">
            <div className="max-w-3xl space-y-8">
              <SectionHeader
                title="Get in Touch"
                description="Open to research collaboration, policy engagement, and partnerships. If you are interested in the future of work, AI ethics, or social protection in Nigeria, let’s connect."
              />

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-accent text-white shadow-none hover:bg-accent-strong"
                >
                  <a href={`mailto:${contactEmail}`}>
                    <Mail className="h-4 w-4" />
                    {settings.contact_email_button_label || "Send Email"}
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-accent bg-transparent text-accent hover:bg-accent/5"
                >
                  <a href={linkedinUrl} target="_blank" rel="noreferrer">
                    <Globe2 className="h-4 w-4" />
                    LinkedIn Profile
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  ["About the Study", "#about"],
                  ["Aim", "#aim"],
                  ["Questions", "#questions"],
                  ["Objectives", "#objectives"],
                  ["Significance", "#significance"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className={cn(
                      "rounded-full border border-border bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent/30 hover:text-accent",
                    )}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} socialLinks={siteData.social_links} />
    </>
  );
}
