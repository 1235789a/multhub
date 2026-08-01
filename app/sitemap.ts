import type { MetadataRoute } from "next";

const SITE_URL = "https://molthub.click";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticPages = [
    "",
    "/sample-report",
    "/case-studies",
    "/insights",
    "/checkout",
    "/account",
    "/contact",
    "/privacy",
    "/terms",
    "/refund",
    "/delivery",
  ];

  return staticPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/contact" ? 0.8 : 0.6,
  }));
}
