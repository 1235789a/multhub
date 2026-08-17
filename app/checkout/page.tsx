import type { Metadata } from "next";
import { UsdtCheckout } from "../components/UsdtCheckout";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { isPaidPlanId } from "../data/paymentPlans";

export const metadata: Metadata = {
  title: "USDT-TRC20 Checkout | molthub",
  description: "Create and verify a molthub payment order using USDT on TRON Mainnet.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const planValue = Array.isArray(params.plan) ? params.plan[0] : params.plan;
  const projectName = Array.isArray(params.projectName) ? params.projectName[0] : params.projectName;
  const website = Array.isArray(params.website) ? params.website[0] : params.website;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;

  return (
    <>
      <Header />
      <main className="checkout-page">
        <PageHero
          eyebrow="USDT checkout"
          title="Pay with USDT on TRON"
          description="Create a saved order, send USDT-TRC20, and verify the confirmed transaction onchain. No wallet connection or custody is required."
        />
        <section className="section">
          <div className="container">
            <UsdtCheckout
              initialPlanId={isPaidPlanId(planValue) ? planValue : "trial"}
              initialProjectName={projectName ?? ""}
              initialWebsite={website ?? ""}
              initialCategory={category ?? "Stablecoin payments"}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
