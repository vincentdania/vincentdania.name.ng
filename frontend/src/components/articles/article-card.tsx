import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { ArticlePreview } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function getArticleKicker(article: ArticlePreview) {
  return article.categories[0]?.name || article.tags[0]?.name || "Article";
}

export function ArticleCard({ article }: { article: ArticlePreview }) {
  const primaryCategory = getArticleKicker(article);

  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border/70 bg-white shadow-[0_14px_30px_rgba(42,42,42,0.04)] transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative min-h-[14rem] bg-surface-strong">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 30rem, (min-width: 768px) 50vw, 100vw"
              unoptimized
            />
          ) : (
            <div className="editorial-grid flex h-full items-end bg-[linear-gradient(180deg,rgba(237,229,215,0.7),rgba(220,239,238,0.5))] p-6">
              <p className="font-display text-3xl leading-tight text-foreground">
                {primaryCategory}
              </p>
            </div>
          )}
        </div>

        <div className="flex h-full flex-col gap-5 p-6 sm:p-7">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {primaryCategory}
            </p>
            <h3 className="font-display text-[2rem] leading-tight text-foreground">
              {article.title}
            </h3>
            <p className="text-sm leading-7 text-muted">{article.summary}</p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/70 pt-5 text-sm text-muted">
            <div className="space-x-3">
              <span>{formatDate(article.published_at)}</span>
              <span>{article.reading_time_minutes} min read</span>
            </div>
            <span className="inline-flex items-center gap-2 text-foreground transition-colors group-hover:text-accent">
              Read article
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
