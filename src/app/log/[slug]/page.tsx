import { Metadata } from "next";
import { BLOG_POSTS } from "../../data/blog";
import BlogDetailClient from "./BlogDetailClient";
import ArticleJsonLd from "../../components/seo/ArticleJsonLd";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title.en,
    description: post.excerpt.en,
    alternates: {
      canonical: `https://multhub.top/log/${post.slug}`,
    },
    openGraph: {
      title: post.title.en,
      description: post.excerpt.en,
      type: "article",
      publishedTime: post.date,
      authors: ["蜕羽"],
      url: `https://multhub.top/log/${post.slug}`,
      images: [{ url: "https://multhub.top/favicon.ico" }],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  return (
    <>
      {post && <ArticleJsonLd post={post} />}
      <BlogDetailClient slug={resolvedParams.slug} />
    </>
  );
}