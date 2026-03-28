import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchArticles, fetchSitePayload } from "@/lib/api";
import { absoluteUrl, formatDate } from "@/lib/utils";

import { ArticlesBrowser } from "@/components/articles/articles-browser";
import { SubscriptionForm } from "@/components/forms/subscription-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SectionHeader } from "@/components/sections/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Articles",
  description:
    "Articles and essays by Vincent Dania on social protection, digital systems, institutional effectiveness, and practical programme delivery.",
  alternates: {
    canonical: absoluteUrl("/articles"),
  },
};

export default async function ArticlesPage() {
  const [siteData, articles] = await Promise.all([
    fetchSitePayload(),
    fetchArticles(),
  ]);

  const featured = siteData.featured_article || articles[0];

  return (
    <>
      <SiteNavbar
        siteName={siteData.site_settings.site_name}
        cvUrl={siteData.site_settings.cv_file_url}
      />
      <main className="flex-1">
        <section className="section-space">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-5">
                <Badge>Featured article</Badge>
                <h1 className="display-title text-5xl text-foreground sm:text-7xl">
                  {featured?.title}
                </h1>
                <p className="clamp-4 max-w-2xl text-lg leading-8 text-muted">
                  {featured?.summary}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                  <span>{featured ? formatDate(featured.published_at) : ""}</span>
                  <span>{featured?.reading_time_minutes} min read</span>
                </div>
                {featured ? (
                  <Button asChild>
                    <Link href={`/articles/${featured.slug}`}>
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
              <Card className="overflow-hidden border-border/60 bg-white/92">
                <CardContent className="space-y-5">
                  <p className="eyebrow">Editorial focus</p>
                  <p className="font-display text-4xl leading-tight text-foreground">
                    Policy, delivery, and digital systems written with practical intent.
                  </p>
                  <p className="text-sm leading-7 text-muted">
                    The archive blends research-based thinking with field-tested lessons from governance work, donor-funded delivery, and technology-enabled execution.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] bg-surface p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Tone
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        Thoughtful, clear, and implementation-aware.
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] bg-surface p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Subjects
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        Social protection, systems, governance, and digital transformation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="section-space bg-white/55">
          <div className="shell space-y-10">
            <SectionHeader
              eyebrow="Archive"
              title="Perspectives and research"
              description="Search, filter, and scan the archive without wading through long previews."
            />
            <ArticlesBrowser articles={articles} />
          </div>
        </section>

        <section className="section-space">
          <div className="shell">
            <Card className="overflow-hidden">
              <CardContent className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <SectionHeader
                  eyebrow="Subscribe"
                  title="Receive new articles directly."
                  description="A lighter way to stay updated on new essays and reflections."
                />
                <SubscriptionForm />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter settings={siteData.site_settings} socialLinks={siteData.social_links} />
    </>
  );
}
