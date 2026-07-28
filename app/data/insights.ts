export type Insight = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  video?: string;
  publishedDate?: string;
  readingTime?: string;
  tags: string[];
  author?: string;
  status: "draft" | "published" | "coming-soon";
  featured?: boolean;
};

export const insights: Insight[] = [
  {
    title: "Why AI May Ignore a Web3 Project",
    slug: "why-ai-may-ignore-a-web3-project",
    excerpt:
      "A practical look at the clarity, evidence, and source gaps that can make a project difficult for AI systems to understand.",
    category: "AI Visibility",
    tags: ["GEO", "Web3", "AI search"],
    status: "coming-soon",
    featured: true,
  },
  {
    title: "Common AI Misconceptions About Stablecoin Payment Products",
    slug: "stablecoin-payment-ai-misconceptions",
    excerpt:
      "How unclear product language can blur the differences between payment flows, custody models, networks, and settlement.",
    category: "Payments",
    tags: ["Stablecoins", "Payments", "Fact accuracy"],
    status: "coming-soon",
    featured: true,
  },
  {
    title: "How Web3 GEO Differs from Traditional SEO",
    slug: "web3-geo-vs-traditional-seo",
    excerpt:
      "Where search rankings end and AI understanding, citation readiness, and factual consistency begin.",
    category: "GEO Fundamentals",
    tags: ["GEO", "SEO", "Content strategy"],
    status: "coming-soon",
    featured: true,
  },
];

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}
