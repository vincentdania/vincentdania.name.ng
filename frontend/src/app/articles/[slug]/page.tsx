import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { fetchArticle, fetchSitePayload } from "@/lib/api";
import { absoluteUrl, formatDate } from "@/lib/utils";

import { SubscriptionForm } from "@/components/forms/subscription-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

function getArticleKicker(article: {
  categories: { name: string }[];
  tags: { name: string }[];
}) {
  return article.categories[0]?.name || article.tags[0]?.name || "Article";
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await fetchArticle(slug);
    return {
      title: article.meta_title || article.title,
      description: article.meta_description || article.summary,
      alternates: {
        canonical: absoluteUrl(`/articles/${slug}`),
      },
      openGraph: {
        title: article.meta_title || article.title,
        description: article.meta_description || article.summary,
        type: "article",
        url: absoluteUrl(`/articles/${slug}`),
        publishedTime: article.published_at,
        images: [article.cover_image_url || absoluteUrl("/og-default.svg")],
      },
      twitter: {
        card: "summary_large_image",
        title: article.meta_title || article.title,
        description: article.meta_description || article.summary,
        images: [article.cover_image_url || absoluteUrl("/og-default.svg")],
      },
    };
  } catch {
    return {
      title: "Article",
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const [siteData, article] = await Promise.all([
    fetchSitePayload().catch(() => null),
    fetchArticle(slug).catch(() => null),
  ]);

  if (!siteData || !article) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    author: {
      "@type": "Person",
      name: article.author_name,
    },
    datePublished: article.published_at,
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    image: article.cover_image_url || absoluteUrl("/og-default.svg"),
  };

  return (
    <>
      <SiteNavbar
        siteName={siteData.site_settings.site_name}
        cvUrl={siteData.site_settings.cv_file_url}
      />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />

        <section className="section-space pb-12 pt-8">
          <div className="shell space-y-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/articles">
                <ArrowLeft className="h-4 w-4" />
                Back to articles
              </Link>
            </Button>

            <div className="grid gap-10 xl:grid-cols-[0.94fr_1.06fr] xl:items-end">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category) => (
                    <Badge key={category.slug}>{category.name}</Badge>
                  ))}
                </div>

                <div className="space-y-5">
                  <p className="eyebrow">{getArticleKicker(article)}</p>
                  <h1 className="display-title max-w-5xl text-[clamp(3rem,6vw,5.8rem)] text-foreground">
                    {article.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
                    {article.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {formatDate(article.published_at)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {article.reading_time_minutes} min read
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    {article.author_name}
                  </span>
                </div>
              </div>

              <article className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-white shadow-[0_18px_40px_rgba(42,42,42,0.05)]">
                <div className="relative min-h-[22rem] bg-surface-strong">
                  {article.cover_image_url ? (
                    <Image
                      src={article.cover_image_url}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 38rem, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className="editorial-grid flex h-full items-end bg-[linear-gradient(180deg,rgba(237,229,215,0.7),rgba(220,239,238,0.55))] p-8 sm:p-10">
                      <div className="space-y-3">
                        <p className="eyebrow">Editorial note</p>
                        <p className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.04] text-foreground">
                          Writing that connects strategic thinking to practical delivery.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="surface-shift pb-20 pt-8">
          <div className="shell grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <Card className="overflow-hidden bg-white">
              <CardContent className="article-body max-w-none p-8 sm:p-10 lg:p-14">
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
              </CardContent>
            </Card>

            <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
              <div className="accent-panel overflow-hidden rounded-[1.6rem] px-6 py-7">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="eyebrow text-white/65">Stay updated</p>
                    <h2 className="font-display text-3xl leading-tight text-white">
                      Subscribe for new essays and practical reflections.
                    </h2>
                    <p className="text-sm leading-7 text-white/72">
                      Vincent writes on technology, policy, programme delivery, and systems that improve public value.
                    </p>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/10 bg-white/96 p-4">
                    <SubscriptionForm />
                  </div>
                </div>
              </div>

              <Card className="bg-white/92">
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <p className="eyebrow">Article details</p>
                    <h3 className="font-display text-3xl leading-tight text-foreground">
                      Context at a glance.
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm leading-7 text-muted">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Published
                      </p>
                      <p className="mt-1 text-foreground">{formatDate(article.published_at)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Reading time
                      </p>
                      <p className="mt-1 text-foreground">
                        {article.reading_time_minutes} minutes
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Topics
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {article.categories.map((category) => (
                          <span
                            key={category.slug}
                            className="rounded-lg bg-surface px-3 py-1 text-xs uppercase tracking-[0.14em] text-foreground"
                          >
                            {category.name}
                          </span>
                        ))}
                        {article.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag.slug}
                            className="rounded-lg border border-border px-3 py-1 text-xs uppercase tracking-[0.14em] text-muted-strong"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
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
