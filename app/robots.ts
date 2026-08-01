import type { MetadataRoute } from "next";

const SITE_URL = "https://molthub.click";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
