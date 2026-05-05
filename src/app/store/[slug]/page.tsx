import { PRODUCTS } from "../../data/products";
import StoreDetailClient from "./StoreDetailClient";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export default function StoreDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <StoreDetailClient slug={params.slug} />;
}