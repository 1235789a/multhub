import type { Metadata } from "next";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { contactConfig } from "../data/contact";

export const metadata: Metadata = {
  title: "Delivery Policy — molthub",
  description:
    "Turnaround times and delivery methods for molthub scans, reports, and audits.",
};

export default function DeliveryPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Legal"
          title="Delivery Policy"
          description="When and how you receive your scan results and deliverables."
        />
        <section className="section">
          <div className="container legal-content">
            <h2>1. Turnaround times</h2>
            <ul>
              <li>
                <strong>Free Quick Scan:</strong> delivered instantly in the
                browser. No account required.
              </li>
              <li>
                <strong>Instant Visibility Report (9.9 USDT):</strong> delivered
                immediately after payment confirmation. Available in your
                account dashboard.
              </li>
              <li>
                <strong>Verified GEO Baseline (59 USDT):</strong> delivered
                within 2 business days of payment confirmation.
              </li>
              <li>
                <strong>Expert Web3 GEO Audit (299 USDT):</strong> delivered
                within 4 business days of payment confirmation.
              </li>
              <li>
                <strong>GEO Sprint:</strong> delivery timeline is confirmed
                during the application review, before any payment is requested.
                Typical implementation runs 10 business days from kickoff.
              </li>
            </ul>

            <h2>2. Delivery method</h2>
            <p>
              All paid deliverables are published to your account dashboard at{" "}
              <a href="/account">/account</a>. Each order shows a delivery status
              (pending, in progress, ready, delivered) and a due date. When a
              deliverable is ready, a download link appears in the deliverables
              list.
            </p>

            <h2>3. Payment confirmation</h2>
            <p>
              Delivery starts after your USDT-TRC20 payment is confirmed on the
              TRON blockchain. You submit the transaction ID (TXID) in the
              checkout panel; our system verifies it against the on-chain record
              via TronGrid. Confirmation typically takes 1–3 minutes after the
              transaction receives sufficient block confirmations.
            </p>

            <h2>4. Order expiration</h2>
            <p>
              Pending payment orders expire after 24 hours. If your order
              expires before payment, you can create a new order at no penalty.
              Expired orders do not affect your account.
            </p>

            <h2>5. Delays</h2>
            <p>
              If a delivery will exceed the stated turnaround due to project
              complexity or scope changes, we will notify you by email before
              the due date. You may request a proportional refund for
              significant delays (see <a href="/refund">Refund Policy</a>).
            </p>

            <h2>6. Contact</h2>
            <p>
              Questions about a delivery? Email{" "}
              <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>{" "}
              with your order ID.
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
