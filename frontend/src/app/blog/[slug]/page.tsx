import { generateBlogPostMetadata, BlogPostPageView } from "@/components/blog/blog-post-page";

export const revalidate = 300;

interface BlogPostRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  return generateBlogPostMetadata(slug);
}

export default async function BlogPostPage({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  return <BlogPostPageView slug={slug} />;
}
