import type { Metadata } from "next";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { contactConfig } from "../data/contact";

export const metadata: Metadata = {
  title: "Refund Policy — molthub",
  description:
    "Refund conditions for USDT-TRC20 payments on molthub scans, reports, and audits.",
};

export default function RefundPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Legal"
          title="Refund Policy"
          description="How refunds work for USDT-TRC20 payments."
        />
        <section className="section">
          <div className="container legal-content">
            <h2>1. On-chain payments are irreversible</h2>
            <p>
              USDT-TRC20 transactions on the TRON blockchain cannot be reversed
              by molthub. Once a transaction is confirmed on-chain, the funds
              are in our wallet. Refunds, when approved, are sent as a new
              on-chain transaction to an address you provide.
            </p>

            <h2>2. Before delivery starts</h2>
            <ul>
              <li>
                <strong>Instant Visibility Report (9.9 USDT):</strong> delivery
                begins immediately after payment confirmation. Because the
                report is generated automatically, refunds are not available
                after confirmation.
              </li>
              <li>
                <strong>Verified GEO Baseline (59 USDT):</strong> if you request
                a refund before we start the verification work (typically within
                24 hours of payment), a full refund is available.
              </li>
              <li>
                <strong>Expert Web3 GEO Audit (299 USDT):</strong> if you
                request a refund before the audit research begins (typically
                within 48 hours of payment), a full refund is available.
              </li>
            </ul>

            <h2>3. After delivery starts</h2>
            <p>
              If work has already begun, refunds are proportional to the work
              completed. We will provide a summary of work done and a
              proportional refund amount. If the delivered work does not match
              the plan description, a partial or full refund may be offered at
              our discretion.
            </p>

            <h2>4. GEO Sprint</h2>
            <p>
              The GEO Sprint is application-based. No payment is requested until
              scope and price are confirmed and you agree to proceed. Once a
              sprint payment is made and implementation has started, refunds are
              proportional to work completed.
            </p>

            <h2>5. How to request a refund</h2>
            <p>
              Email{" "}
              <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>{" "}
              with your order ID and TRON receiving address. Refund transactions
              are processed within 5 business days of approval.
            </p>

            <h2>6. Upgrade credit</h2>
            <p>
              If you upgrade to a higher plan within 14 days of your original
              payment, the amount already paid is deducted from the new plan's
              price. No refund is needed — the credit is applied automatically.
            </p>

            <p className="legal-content__updated">
              Last updated: {new Date().getFullYear()}.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
