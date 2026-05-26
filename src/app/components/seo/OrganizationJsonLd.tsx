export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "蜕羽 / Silent Harvest",
    url: "https://multhub.top",
    logo: "https://multhub.top/favicon.ico",
    description:
      "Fully automated monetization funnel — Independent architecture, silent harvest. Tool store, zero customer service, pay after trial.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
