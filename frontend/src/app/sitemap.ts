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
      url: absoluteUrl("/phd"),
      priority: 0.9,
    },
    {
      url: absoluteUrl("/consult"),
      priority: 0.95,
    },
    {
      url: absoluteUrl("/blog"),
      priority: 0.9,
    },
  ];

  try {
    const articles = await fetchArticles();
    return [
      ...baseEntries,
      ...articles.map((article) => ({
        url: absoluteUrl(`/blog/${article.slug}`),
        lastModified: article.published_at,
        priority: 0.8,
      })),
    ];
  } catch {
    return baseEntries;
  }
}
