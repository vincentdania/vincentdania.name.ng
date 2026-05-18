import type { Metadata } from "next";

import { fetchSitePayload } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";

import { BlogIndexPageView } from "@/components/blog/blog-index-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await fetchSitePayload().catch(() => null);
  const blog = siteData?.blog_settings;

  return {
    title: blog?.meta_title || "Blog",
    description: blog?.meta_description || siteData?.site_settings.site_description,
    alternates: {
      canonical: absoluteUrl("/blog"),
    },
  };
}

export default function BlogPage() {
  return <BlogIndexPageView />;
}
