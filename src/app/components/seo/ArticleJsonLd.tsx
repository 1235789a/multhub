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
    alternateTitle: post.title[lang === "en" ? "zh" : "en"],
    description: articleDescription,
    datePublished: post.date,
    dateModified: post.date,
    dateCreated: post.date,
    author: {
      "@type": "Organization",
      name: "蜕羽",
      url: "https://multhub.top",
      sameAs: ["https://github.com/1235789a/multhub"],
    },
    publisher: {
      "@type": "Organization",
      name: "蜕羽",
      url: "https://multhub.top",
      logo: {
        "@type": "ImageObject",
        url: "https://multhub.top/favicon.ico",
      },
    },
    url: articleUrl,
    keywords: post.tags.join(", "),
    articleSection: post.tags[0],
    about: post.tags.map((tag) => ({
      "@type": "Thing",
      name: tag,
    })),
    image: "https://multhub.top/favicon.ico",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    isPartOf: {
      "@type": "Blog",
      name: "蜕羽技术博客",
      url: "https://multhub.top/log",
    },
    genre: post.tags[0],
    wordCount: post.body[lang]?.split(/\s+/).length || 0,
    inLanguage: lang === "en" ? "en-US" : "zh-CN",
    isBasedOn: "https://multhub.top",
    isAccessibleForFree: true,
    copyrightHolder: {
      "@type": "Organization",
      name: "蜕羽",
      url: "https://multhub.top",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
