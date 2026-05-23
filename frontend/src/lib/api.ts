import "server-only";

import { Article, ArticlePreview, SitePayload } from "@/lib/types";
import { fallbackArticles, fallbackSitePayload } from "@/lib/fallback-data";

const INTERNAL_API_BASE_URL =
  process.env.NEXT_INTERNAL_API_BASE_URL || "http://backend:8000/api";

const INTERNAL_API_TIMEOUT_MS = Number.parseInt(
  process.env.NEXT_INTERNAL_API_TIMEOUT_MS || "3000",
  10,
);

function buildInternalUrl(path: string) {
  return `${INTERNAL_API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(buildInternalUrl(path), {
    headers: {
      Accept: "application/json",
    },
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(INTERNAL_API_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchSitePayload() {
  return fetchJson<SitePayload>("site/").catch(() => fallbackSitePayload);
}

export async function fetchArticles() {
  return fetchJson<ArticlePreview[]>("articles/").catch(() => fallbackArticles);
}

export async function fetchFeaturedArticles() {
  return fetchJson<ArticlePreview[]>("articles/featured/").catch(() =>
    fallbackArticles.filter((article) => article.featured),
  );
}

export async function fetchArticle(slug: string) {
  return fetchJson<Article>(`articles/${slug}/`).catch(() => {
    const fallbackArticle = fallbackArticles.find((article) => article.slug === slug);
    if (!fallbackArticle) {
      throw new Error(`Article not found: ${slug}`);
    }
    return fallbackArticle;
  });
}
