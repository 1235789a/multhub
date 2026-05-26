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
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: product.priceUSDT?.toString() || "0",
      priceCurrency: "USDT",
      availability:
        product.status === "available"
          ? "https://schema.org/InStock"
          : product.status === "beta"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/ComingSoon",
    },
    description: productDescription,
    version: product.version,
    url: productUrl,
    image: "https://multhub.top/favicon.ico",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
