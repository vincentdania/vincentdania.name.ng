import { generateBlogPostMetadata, BlogPostPageView } from "@/components/blog/blog-post-page";
import { fetchArticles } from "@/lib/api";

export const revalidate = 300;

interface BlogPostRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  return generateBlogPostMetadata(slug);
}

export async function generateStaticParams() {
  const articles = await fetchArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  return <BlogPostPageView slug={slug} />;
}
