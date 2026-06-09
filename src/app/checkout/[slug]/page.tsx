import { PRODUCTS } from "../../data/products";
import CryptoCheckoutClient from "./CryptoCheckoutClient";

// Static paths for all known products at build time
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  return <CryptoCheckoutClient slug={params.slug} />;
}