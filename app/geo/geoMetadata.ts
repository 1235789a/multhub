import type { Metadata } from "next";
import type { EvidencePageData } from "../data/evidencePages";

export function getGeoMetadata(page: EvidencePageData): Metadata {
  const canonical = `https://molthub.click/geo/${page.slug}`;

  return {
    title: page.seoTitle,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: page.seoTitle,
      description: page.description,
      images: [{ url: "/og-geo-foundation.png", width: 1774, height: 887, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle,
      description: page.description,
      images: ["/og-geo-foundation.png"],
    },
  };
}
