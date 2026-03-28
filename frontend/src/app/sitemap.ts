import type { MetadataRoute } from "next";

import { fetchArticles } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      priority: 1,
    },
    {
      url: absoluteUrl("/articles"),
      priority: 0.9,
    },
  ];

  try {
    const articles = await fetchArticles();
    return [
      ...baseEntries,
      ...articles.map((article) => ({
        url: absoluteUrl(`/articles/${article.slug}`),
        lastModified: article.published_at,
        priority: 0.8,
      })),
    ];
  } catch {
    return baseEntries;
  }
}
