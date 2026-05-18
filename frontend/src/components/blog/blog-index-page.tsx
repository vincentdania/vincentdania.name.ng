import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchArticles, fetchSitePayload } from "@/lib/api";
import { formatDate } from "@/lib/utils";

import { ArticlesBrowser } from "@/components/articles/articles-browser";
import { SubscriptionForm } from "@/components/forms/subscription-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function getArticleKicker(
  article:
    | {
        categories: { name: string }[];
        tags: { name: string }[];
      }
    | null
    | undefined,
) {
  return article?.categories[0]?.name || article?.tags[0]?.name || "Featured post";
}

export async function BlogIndexPageView() {
  const [siteData, articles] = await Promise.all([fetchSitePayload(), fetchArticles()]);
  const { blog_settings: blog, site_settings: settings } = siteData;

  const featured = siteData.featured_article || articles[0] || null;
  const archiveArticles = articles.filter((article) => article.slug !== featured?.slug);
  const topicCount = new Set(
    articles.flatMap((article) => article.categories.map((category) => category.slug)),
  ).size;

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
      <main className="flex-1">
        <section className="section-space pb-12 pt-8">
          <div className="shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-6">
              <Badge variant="muted">{blog.index_badge_label}</Badge>
              <h1 className="display-title max-w-4xl text-[clamp(3.2rem,7vw,6.5rem)] text-foreground">
                {blog.index_title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {blog.index_intro}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="bg-white/80">
                <CardContent className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Published posts
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
                          <p className="eyebrow">{blog.featured_badge_label}</p>
                          <p className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02] text-foreground">
                            {blog.featured_fallback_title}
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
                      <Link href={`/blog/${featured.slug}`}>
                        Read featured post
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
              <p className="eyebrow">{blog.archive_eyebrow}</p>
              <h2 className="font-display text-[clamp(2.45rem,5vw,4.1rem)] leading-[1.02] text-foreground">
                {blog.archive_title}
              </h2>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {blog.archive_intro}
              </p>
            </div>

            <ArticlesBrowser articles={archiveArticles.length ? archiveArticles : articles} />
          </div>
        </section>

        <section className="section-space">
          <div className="shell accent-panel overflow-hidden rounded-[1.8rem] px-6 py-10 sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
              <div className="space-y-5">
                <p className="eyebrow text-white/65">{blog.subscribe_badge_label}</p>
                <h2 className="font-display text-[clamp(2.25rem,4vw,3.7rem)] leading-[1.04] text-white">
                  {blog.subscribe_title}
                </h2>
                <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                  {blog.subscribe_description}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/96 p-6 sm:p-7">
                <SubscriptionForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} socialLinks={siteData.social_links} />
    </>
  );
}
