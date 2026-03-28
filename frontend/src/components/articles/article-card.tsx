import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ArticlePreview } from "@/lib/types";
import { formatDate } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";

export function ArticleCard({ article }: { article: ArticlePreview }) {
  const primaryCategory = article.categories[0]?.name || "Article";

  return (
    <Link href={`/articles/${article.slug}`} className="group h-full">
      <Card className="h-full border-border/60 bg-white/95 transition-transform duration-200 group-hover:-translate-y-1">
        <CardContent className="flex h-full flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-accent">
              {primaryCategory}
            </span>
            <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div className="space-y-3">
            <h3 className="clamp-3 font-display text-2xl leading-tight text-foreground sm:text-[1.9rem]">
              {article.title}
            </h3>
            <p className="clamp-3 text-sm leading-6 text-muted">{article.summary}</p>
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/70 pt-5 text-xs uppercase tracking-[0.2em] text-muted">
            <span>{formatDate(article.published_at)}</span>
            <span>{article.reading_time_minutes} min read</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
