import type { MetadataRoute } from "next";
import { getPublishedInsights } from "./data/insights";

const baseUrl = "https://molthub.click";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/sample-report`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/insights`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/checkout`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const insightRoutes = getPublishedInsights().map((insight) => ({
    url: `${baseUrl}/insights/${insight.slug}`,
    lastModified: new Date(`${insight.publishedDate}T${insight.publishTime}:00+08:00`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...fixedRoutes, ...insightRoutes];
}
