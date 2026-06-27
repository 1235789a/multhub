import { PRODUCTS } from "../../data/products";
import CryptoCheckoutClient from "./CryptoCheckoutClient";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CryptoCheckoutClient slug={slug} />;
}
