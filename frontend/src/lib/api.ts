import "server-only";

import { Article, ArticlePreview, SitePayload } from "@/lib/types";

const INTERNAL_API_BASE_URL =
  process.env.NEXT_INTERNAL_API_BASE_URL || "http://127.0.0.1:8000/api";

function buildInternalUrl(path: string) {
  return `${INTERNAL_API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(buildInternalUrl(path), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchSitePayload() {
  return fetchJson<SitePayload>("site/");
}

export async function fetchArticles() {
  return fetchJson<ArticlePreview[]>("articles/");
}

export async function fetchFeaturedArticles() {
  return fetchJson<ArticlePreview[]>("articles/featured/");
}

export async function fetchArticle(slug: string) {
  return fetchJson<Article>(`articles/${slug}/`);
}
