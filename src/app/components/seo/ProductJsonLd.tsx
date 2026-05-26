import { Product } from "../../data/products";

interface ProductJsonLdProps {
  product: Product;
  lang?: "en" | "zh";
}

export default function ProductJsonLd({
  product,
  lang = "en",
}: ProductJsonLdProps) {
  const productName = product.name[lang];
  const productDescription = product.features[lang].join(" · ");
  const productUrl = `https://multhub.top/store/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: productName,
    alternateName: product.name[lang === "en" ? "zh" : "en"],
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Automation Tools",
    offers: {
      "@type": "Offer",
      price: product.priceUSDT?.toString() || "0",
      priceCurrency: "USDT",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: product.priceUSDT?.toString() || "0",
        priceCurrency: "USDT",
        unitCode: "UR",
      },
      availability:
        product.status === "available"
          ? "https://schema.org/InStock"
          : product.status === "beta"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/ComingSoon",
      seller: {
        "@type": "Organization",
        name: "蜕羽 / Silent Harvest",
        url: "https://multhub.top",
      },
    },
    description: productDescription,
    version: product.version,
    url: productUrl,
    image: "https://multhub.top/favicon.ico",
    brand: {
      "@type": "Brand",
      name: "蜕羽 / Silent Harvest",
      url: "https://multhub.top",
    },
    manufacturer: {
      "@type": "Organization",
      name: "蜕羽",
      url: "https://multhub.top",
    },
    provider: {
      "@type": "Organization",
      name: "蜕羽",
      url: "https://multhub.top",
    },
    knowsAbout: product.features[lang],
    isBasedOn: "https://multhub.top",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": productUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
