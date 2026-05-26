import { BlogPost } from "../../data/blog";

interface ArticleJsonLdProps {
  post: BlogPost;
  lang?: "en" | "zh";
}

export default function ArticleJsonLd({
  post,
  lang = "en",
}: ArticleJsonLdProps) {
  const articleTitle = post.title[lang];
  const articleDescription = post.excerpt[lang];
  const articleUrl = `https://multhub.top/log/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleTitle,
    description: articleDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "蜕羽",
      url: "https://multhub.top",
    },
    publisher: {
      "@type": "Organization",
      name: "蜕羽",
      logo: {
        "@type": "ImageObject",
        url: "https://multhub.top/favicon.ico",
      },
    },
    url: articleUrl,
    keywords: post.tags.join(", "),
    articleSection: post.tags[0],
    image: "https://multhub.top/favicon.ico",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
