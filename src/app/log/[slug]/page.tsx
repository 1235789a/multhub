import { BLOG_POSTS } from "../../data/blog";
import BlogDetailClient from "./BlogDetailClient";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <BlogDetailClient slug={params.slug} />;
}