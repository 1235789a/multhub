export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "蜕羽 / Silent Harvest",
    alternateName: ["蜕羽", "Silent Harvest"],
    url: "https://multhub.top",
    logo: "https://multhub.top/favicon.ico",
    description:
      "Fully automated monetization funnel — Independent architecture, silent harvest. Tool store, zero customer service, pay after trial.",
    foundingDate: "2025-01-01",
    foundingLocation: {
      "@type": "Place",
      name: "Online",
    },
    knowsAbout: [
      "Automation Tools",
      "SaaS",
      "Monetization",
      "独立架构",
      "静默收割",
      "自动化工具",
      "变现漏斗",
    ],
    areaServed: "Worldwide",
    sameAs: ["https://github.com/1235789a/multhub"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese"],
      email: "contact@multhub.top",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "自动化工具",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Tariff Lens",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "MarkItDown",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Nano Secure Bridge",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "MCP Universal Adapter Pack",
          },
        },
      ],
    },
    memberOf: {
      "@type": "ProgramMembership",
      name: "Developer Community",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
