import { Metadata } from "next";
import { PRODUCTS } from "../../data/products";
import StoreDetailClient from "./StoreDetailClient";
import ProductJsonLd from "@/components/seo/ProductJsonLd";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name.en,
    description: product.features.en.join(" · "),
    alternates: {
      canonical: `https://multhub.top/store/${product.slug}`,
    },
    openGraph: {
      title: product.name.en,
      description: product.features.en.join(" · "),
      type: "website",
      url: `https://multhub.top/store/${product.slug}`,
      images: [{ url: "https://multhub.top/favicon.ico" }],
    },
  };
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  return (
    <>
      {product && <ProductJsonLd product={product} />}
      <StoreDetailClient slug={slug} />
    </>
  );
}