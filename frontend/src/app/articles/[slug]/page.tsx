import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        <section className="section-space">
          <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <Button asChild variant="ghost" size="sm">
                <Link href="/articles">
                  <ArrowLeft className="h-4 w-4" />
                  Back to articles
                </Link>
              </Button>
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category) => (
                  <Badge key={category.slug}>{category.name}</Badge>
                ))}
              </div>
              <h1 className="display-title text-5xl text-foreground sm:text-6xl">
                {article.title}
              </h1>
              <p className="text-lg leading-8 text-muted">{article.summary}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted">
                <span>{formatDate(article.published_at)}</span>
                <span>{article.reading_time_minutes} min read</span>
                <span>{article.author_name}</span>
              </div>
            </div>
            <Card className="bg-surface">
              <CardContent className="space-y-6">
                <p className="eyebrow">Stay updated</p>
                <p className="font-display text-4xl leading-tight text-foreground">
                  Subscribe for new essays and practical reflections.
                </p>
                <p className="text-base leading-8 text-muted">
                  Vincent writes on technology, policy, programme delivery, and systems that improve public value.
                </p>
                <SubscriptionForm />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-20">
          <div className="shell">
            <Card className="overflow-hidden">
              <CardContent className="article-body max-w-none p-8 sm:p-10 lg:p-14">
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
              </CardContent>
            </Card>
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
