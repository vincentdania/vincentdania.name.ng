import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchArticles, fetchSitePayload } from "@/lib/api";
import { absoluteUrl, formatDate } from "@/lib/utils";

import { ArticlesBrowser } from "@/components/articles/articles-browser";
import { SubscriptionForm } from "@/components/forms/subscription-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
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

function getArticleKicker(
  article:
    | {
        categories: { name: string }[];
        tags: { name: string }[];
      }
    | null
    | undefined,
) {
  return article?.categories[0]?.name || article?.tags[0]?.name || "Featured article";
}

export default async function ArticlesPage() {
  const [siteData, articles] = await Promise.all([
    fetchSitePayload(),
    fetchArticles(),
  ]);

  const featured = siteData.featured_article || articles[0] || null;
  const archiveArticles = articles.filter((article) => article.slug !== featured?.slug);
  const topicCount = new Set(
    articles.flatMap((article) => article.categories.map((category) => category.slug)),
  ).size;

  return (
    <>
      <SiteNavbar
        siteName={siteData.site_settings.site_name}
        cvUrl={siteData.site_settings.cv_file_url}
      />
      <main className="flex-1">
        <section className="section-space pb-12 pt-8">
          <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-6">
              <Badge variant="muted">Articles</Badge>
              <h1 className="display-title max-w-4xl text-[clamp(3.2rem,7vw,6.5rem)] text-foreground">
                Writing on institutions, delivery, policy, and digital systems.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                A curated archive of essays, practical reflections, and research-led thinking
                grounded in programme implementation, public value, and technology-enabled
                systems change.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="bg-white/80">
                <CardContent className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Published pieces
                  </p>
                  <p className="font-display text-4xl text-foreground">{articles.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80">
                <CardContent className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Core themes
                  </p>
                  <p className="font-display text-4xl text-foreground">{topicCount || 1}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80">
                <CardContent className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Latest publication
                  </p>
                  <p className="font-display text-2xl leading-tight text-foreground">
                    {featured ? formatDate(featured.published_at) : "Coming soon"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {featured ? (
          <section className="pb-18">
            <div className="shell">
              <article className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-white shadow-[0_18px_40px_rgba(42,42,42,0.05)]">
                <div className="grid xl:grid-cols-[0.92fr_1.08fr]">
                  <div className="relative min-h-[24rem] bg-surface-strong">
                    {featured.cover_image_url ? (
                      <Image
                        src={featured.cover_image_url}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1280px) 36rem, 100vw"
                        unoptimized
                      />
                    ) : (
                      <div className="editorial-grid flex h-full items-end bg-[linear-gradient(180deg,rgba(237,229,215,0.7),rgba(220,239,238,0.6))] p-8 sm:p-10">
                        <div className="space-y-3">
                          <p className="eyebrow">Featured article</p>
                          <p className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-foreground">
                            Practical thinking for systems that serve people well.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6 p-8 sm:p-10 lg:p-12">
                    <Badge>{getArticleKicker(featured)}</Badge>
                    <div className="space-y-4">
                      <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[1.02] text-foreground">
                        {featured.title}
                      </h2>
                      <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                        {featured.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                      <span>{formatDate(featured.published_at)}</span>
                      <span>{featured.reading_time_minutes} min read</span>
                      <span>{featured.author_name}</span>
                    </div>

                    <Button asChild size="lg">
                      <Link href={`/articles/${featured.slug}`}>
                        Read featured article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="surface-shift section-space">
          <div className="shell space-y-10">
            <div className="max-w-3xl space-y-5">
              <p className="eyebrow">Archive</p>
              <h2 className="font-display text-[clamp(2.45rem,5vw,4.1rem)] leading-[1.02] text-foreground">
                Explore perspectives on governance, institutional effectiveness, social
                protection, and digital execution.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                Search by topic, filter the archive, and move from strategic reflections to
                implementation lessons with a more editorial reading experience.
              </p>
            </div>

            <ArticlesBrowser articles={archiveArticles.length ? archiveArticles : articles} />
          </div>
        </section>

        <section className="section-space">
          <div className="shell accent-panel overflow-hidden rounded-[1.8rem] px-6 py-10 sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
              <div className="space-y-5">
                <p className="eyebrow text-white/65">Subscribe</p>
                <h2 className="font-display text-[clamp(2.25rem,4vw,3.7rem)] leading-[1.04] text-white">
                  Receive new essays directly.
                </h2>
                <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                  Join the list for practical reflections on programme leadership, policy,
                  institutional performance, and digital systems that create measurable value.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/96 p-6 sm:p-7">
                <SubscriptionForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter
        settings={siteData.site_settings}
        socialLinks={siteData.social_links}
      />
    </>
  );
}
