import type { MetadataRoute } from "next";
import { getPublishedInsights } from "./data/insights";
import { evidencePages } from "./data/evidencePages";

const baseUrl = "https://molthub.click";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixedRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/methodology`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/research/self-geo-experiment`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/app`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/install`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/sample-report`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/regulated-industries`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/insights`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const insightRoutes = getPublishedInsights().map((insight) => ({
    url: `${baseUrl}/insights/${insight.slug}`,
    lastModified: new Date(`${insight.publishedDate}T${insight.publishTime}:00+08:00`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const evidenceRoutes = Object.values(evidencePages).map((page) => ({
    url: `${baseUrl}/geo/${page.slug}`,
    lastModified: new Date(`${page.lastUpdated}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...fixedRoutes, ...evidenceRoutes, ...insightRoutes];
}
