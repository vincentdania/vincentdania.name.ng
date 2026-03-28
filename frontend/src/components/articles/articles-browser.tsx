"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";

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

  const categoryItems = Array.from(
    new Map(
      articles.flatMap((article) =>
        article.categories.map((category) => [category.slug, category.name] as const),
      ),
    ),
  ).map(([slug, name]) => ({ slug, name }));

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

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[1.6rem] border border-border/70 bg-white/90 p-6 shadow-[0_14px_30px_rgba(42,42,42,0.04)] sm:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
          <div className="space-y-3">
            <label
              htmlFor="article-search"
              className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted"
            >
              Search articles
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                id="article-search"
                placeholder="Search by title, theme, or topic"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Filter by topic
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                  activeCategory === "all"
                    ? "bg-foreground text-white"
                    : "bg-surface text-muted hover:text-foreground",
                )}
              >
                All
              </button>
              {categoryItems.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => setActiveCategory(category.slug)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
                    activeCategory === category.slug
                      ? "bg-foreground text-white"
                      : "bg-surface text-muted hover:text-foreground",
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5 text-sm text-muted">
          <p>
            Showing <span className="font-medium text-foreground">{filteredArticles.length}</span>{" "}
            article{filteredArticles.length === 1 ? "" : "s"}
            {activeCategory !== "all" ? " in the selected topic" : ""}
            {deferredSearch.trim() ? " matching your search" : ""}.
          </p>

          {(activeCategory !== "all" || search.trim() !== "") && (
            <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
              Reset filters
            </Button>
          )}
        </div>
      </div>

      {filteredArticles.length ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.6rem] border border-dashed border-border bg-white/70 p-10 text-center">
          <p className="font-display text-3xl text-foreground">No articles matched that search.</p>
          <p className="mt-3 text-sm leading-7 text-muted">
            Try a broader keyword or return to all topics.
          </p>
          <Button type="button" variant="secondary" className="mt-6" onClick={resetFilters}>
            Show all articles
          </Button>
        </div>
      )}
    </div>
  );
}
