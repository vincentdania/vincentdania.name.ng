"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";

import type { ArticlePreview } from "@/lib/types";

import { ArticleCard } from "@/components/articles/article-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ArticlesBrowserProps {
  articles: ArticlePreview[];
}

export function ArticlesBrowser({ articles }: ArticlesBrowserProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const categories = Array.from(
    new Set(articles.flatMap((article) => article.categories.map((category) => category.slug))),
  );

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" ||
      article.categories.some((category) => category.slug === activeCategory);
    const haystack = `${article.title} ${article.summary} ${article.categories
      .map((category) => category.name)
      .join(" ")} ${article.tags.map((tag) => tag.name).join(" ")}`.toLowerCase();
    const matchesSearch =
      deferredSearch.trim() === "" ||
      haystack.includes(deferredSearch.trim().toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <label htmlFor="article-search" className="mb-2 block text-sm font-medium text-foreground">
            Search articles
          </label>
          <Input
            id="article-search"
            placeholder="Search by title, theme, or topic"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
              activeCategory === "all"
                ? "bg-accent text-white"
                : "bg-white text-muted hover:text-foreground",
            )}
          >
            All
          </button>
          {categories.map((category) => {
            const label =
              articles
                .flatMap((article) => article.categories)
                .find((item) => item.slug === category)?.name || category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                  activeCategory === category
                    ? "bg-accent text-white"
                    : "bg-white text-muted hover:text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredArticles.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-border bg-white/70 p-10 text-center">
          <p className="font-display text-3xl text-foreground">No articles matched that search.</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Try a broader keyword or switch back to all categories.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/articles">Reset filters</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
