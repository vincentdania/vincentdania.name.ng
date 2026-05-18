import { redirect } from "next/navigation";

interface ArticleRedirectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticleRedirectPage({ params }: ArticleRedirectPageProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
