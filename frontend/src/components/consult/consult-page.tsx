import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Landmark,
  Store,
  Workflow,
} from "lucide-react";

import { fetchSitePayload } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { ConsultIntakeForm } from "@/components/consult/consult-intake-form";

const consultationEmail = "Vincent@hyrax.ng";
const linkedinUrl = "https://linkedin.com/in/vincentdania";
const pageTitle = "Practical AI Consultation | Vincent Dania";
const pageDescription =
  "Practical AI advisory and coaching for small business owners, NGOs, professionals, educators, and leaders who want to use generative AI confidently and productively.";
const heroImagePath = "/consult/vincent-dania-consult-hero.jpg";
const zohoCalendarUrl =
  "https://calendar.zoho.com/zc/view/slot-booking/zz080112204c4e961cc75553bdcc448603745de96d46a8c07a83b6e00a6908d5be3e62da7a";

const trustIndicators = [
  {
    icon: GraduationCap,
    label: "IT Instructor since 2011",
  },
  {
    icon: BriefcaseBusiness,
    label: "15+ Years in IT Education",
  },
  {
    icon: FlaskConical,
    label: "PhD Researcher",
  },
];

const services = [
  {
    icon: Store,
    title: "AI for Small Business",
    description:
      "Automate routine tasks, enhance customer communication, and leverage generative tools to punch above your weight class.",
    linkLabel: "Discuss your business",
  },
  {
    icon: Landmark,
    title: "Executive Advisory",
    description:
      "Strategic guidance for leaders needing to understand AI implications for their teams, risks, and institutional strategy.",
    linkLabel: "Schedule advisory",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "Identify bottlenecks in your daily operations and implement practical AI solutions to save hours every week.",
    linkLabel: "Optimize workflows",
  },
];

export function generateConsultMetadata(): Metadata {
  return {
    title: {
      absolute: pageTitle,
    },
    description: pageDescription,
    alternates: {
      canonical: absoluteUrl("/consult"),
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: absoluteUrl("/consult"),
      images: [absoluteUrl("/og-default.svg")],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [absoluteUrl("/og-default.svg")],
    },
  };
}

export async function ConsultPageView() {
  const siteData = await fetchSitePayload();
  const { site_settings: settings } = siteData;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: pageTitle,
    url: absoluteUrl("/consult"),
    email: consultationEmail,
    areaServed: ["Nigeria", "Africa", "Global"],
    sameAs: [linkedinUrl],
    description: pageDescription,
  };

  return (
    <>
      <SiteNavbar
        siteName={settings.site_name}
        navigationItems={siteData.navigation_items}
        cvUrl={settings.cv_file_url}
        cvLabel={settings.navbar_cv_label}
        primaryCtaLabel="Book Consultation"
        primaryCtaLink="#intake"
      />

      <main className="flex-1 bg-[#f8f9fa] text-[#191c1d]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />

        <section className="bg-white px-6 pb-14 pt-32 sm:px-8 md:pb-20 md:pt-36">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase leading-4 tracking-[0.18em] text-[#006565]">
                <span className="h-px w-8 bg-[#006565]" />
                <span>AI Advisory Services</span>
              </div>

              <h1 className="font-display text-[42px] font-bold leading-[1.08] tracking-[-0.035em] text-[#191c1d] sm:text-5xl lg:text-[54px] lg:leading-[1.08]">
                Practical AI Guidance for People Who Want to Work Smarter, Grow
                Faster, and Stay Relevant in the AI Age
              </h1>

              <p className="max-w-xl text-base leading-8 text-[#3e4949] sm:text-lg">
                I help small business owners, NGOs, executives, professionals,
                educators, and everyday people use generative AI practically - to
                save time, improve productivity, strengthen decision-making, grow
                income, and adapt confidently to the future of work.
              </p>

              <div className="flex flex-wrap gap-4 pt-5">
                <a
                  className="inline-flex items-center justify-center rounded-lg bg-[#008080] px-8 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#006565]"
                  href="#intake"
                >
                  Book Your Consultation
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-lg border-2 border-[#6e7979] bg-transparent px-8 py-4 text-sm font-semibold text-[#191c1d] transition-colors hover:bg-[#f3f4f5]"
                  href="#services"
                >
                  Explore Services
                </a>
              </div>
            </div>

            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:h-[430px] lg:h-[500px]">
              <Image
                alt="Vincent Dania seated in a professional portrait for AI advisory consultations."
                className="object-cover object-top"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                src={heroImagePath}
              />
            </div>
          </div>

          <div className="mx-auto mt-16 flex max-w-[1200px] flex-wrap justify-center gap-7 border-t border-[#bdc9c8]/50 pt-8 opacity-90 md:gap-16">
            {trustIndicators.map(({ icon: Icon, label }) => (
              <div
                className="flex items-center gap-3 text-[#3e4949]"
                key={label}
              >
                <Icon className="h-5 w-5 text-[#008080]" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em]">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </section>

        <section
          className="bg-[#f3f4f5] px-6 py-16 sm:px-8 md:py-24"
          id="services"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold leading-tight text-[#191c1d] sm:text-4xl">
                Strategic AI Services
              </h2>
              <p className="mt-4 text-base leading-7 text-[#3e4949] sm:text-lg">
                Tailored consulting to translate complex technology into
                practical, everyday value.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {services.map(({ icon: Icon, title, description, linkLabel }) => (
                <article
                  className="rounded-2xl border border-[#bdc9c8]/45 bg-white p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)] transition-colors hover:border-[#008080]/35"
                  key={title}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f4f5] text-[#008080]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold leading-8 text-[#191c1d]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#3e4949]">
                    {description}
                  </p>
                  <a
                    className="mt-6 inline-flex items-center gap-1 text-[13px] font-semibold tracking-[0.08em] text-[#006565] hover:underline"
                    href="#intake"
                  >
                    {linkLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="bg-white px-6 py-16 sm:px-8 md:py-24"
          id="intake"
        >
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-display text-3xl font-semibold leading-tight text-[#191c1d] sm:text-4xl">
                Start a Conversation
              </h2>
              <p className="mt-4 text-base leading-7 text-[#3e4949] sm:text-lg">
                Share a bit about your current challenges, and let&apos;s
                explore how practical AI implementation can help you achieve
                your goals.
              </p>
            </div>

            <div className="rounded-2xl border border-[#bdc9c8]/45 bg-[#f8f9fa] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:p-8 md:p-12">
              <ConsultIntakeForm />
            </div>

            <div className="mt-8 rounded-2xl border border-[#bdc9c8]/60 bg-[#f8f9fa] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e3fffe] text-[#006565]">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-8 text-[#191c1d]">
                      Schedule an Appointment directly with Vincent Dania
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#3e4949] sm:text-base">
                      Choose a convenient available slot on Vincent&apos;s Zoho
                      Calendar after sharing your consultation context.
                    </p>
                  </div>
                </div>
                <a
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#008080] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#006565]"
                  href={zohoCalendarUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open Calendar
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#191c1d] px-6 py-12 text-white sm:px-8">
          <div className="mx-auto max-w-[1200px] rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.18)] sm:p-8">
            <p className="text-base leading-8 text-white/82 sm:text-lg">
              Vincent Dania is an Adjunct Instructor at the University of the
              People, where he has taught over 500 students from more than 70
              countries in Programming Fundamentals using Python. He holds a
              Master&apos;s degree in Information Technology from the University
              of the People and a Doctorate in Management Studies from the
              Kazian School of Management. Vincent is also PMP and PMI-ACP
              certified. He is currently a PhD researcher on AI and labour
              market risks at the Institute of Social Policy, Nnamdi Azikiwe
              University, Awka.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter settings={settings} socialLinks={siteData.social_links} />
    </>
  );
}
