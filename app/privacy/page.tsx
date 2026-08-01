import type { Metadata } from "next";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { contactConfig } from "../data/contact";

export const metadata: Metadata = {
  title: "Privacy Policy — molthub",
  description:
    "How molthub collects, uses, and protects data from scans, orders, and account access.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Legal"
          title="Privacy Policy"
          description="What we collect, why we collect it, and how we protect it."
        />
        <section className="section">
          <div className="container legal-content">
            <h2>1. Data we collect</h2>
            <ul>
              <li>
                <strong>Account data:</strong> email address and authentication
                identifier when you sign in via Google or email magic link.
              </li>
              <li>
                <strong>Scan data:</strong> the website URL and category you
                submit for a free or paid scan, plus the generated result.
              </li>
              <li>
                <strong>Order data:</strong> plan ID, project name, website,
                category, payment amount, transaction ID (TXID), and order
                status.
              </li>
              <li>
                <strong>Product events:</strong> anonymous interaction events
                (e.g. scan started, signup completed) for service improvement.
              </li>
            </ul>

            <h2>2. How we use data</h2>
            <ul>
              <li>To deliver scan results, paid reports, and audit deliverables.</li>
              <li>To maintain your order history and delivery status in your account.</li>
              <li>To verify USDT-TRC20 payments on the TRON blockchain.</li>
              <li>To respond to inquiries sent via the contact form or email.</li>
            </ul>
            <p>We do not sell your data to third parties.</p>

            <h2>3. Data storage</h2>
            <p>
              Account, scan, and order data is stored in a Supabase database
              protected by row-level security (RLS). You can only read your own
              rows. Payment verification queries the public TRON blockchain via
              TronGrid; no private keys are ever requested or stored.
            </p>

            <h2>4. Payment data</h2>
            <p>
              USDT-TRC20 transactions are public on the TRON blockchain. We
              record the transaction ID you submit and the sending address
              reported by TronGrid to confirm your payment. We never ask for
              private keys or recovery phrases.
            </p>

            <h2>5. Your rights</h2>
            <ul>
              <li>Request access to or deletion of your account data.</li>
              <li>Request a copy of your scan and order history.</li>
              <li>Withdraw consent for product-event tracking at any time.</li>
            </ul>
            <p>
              To exercise these rights, email{" "}
              <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>.
            </p>

            <h2>6. Cookies</h2>
            <p>
              We use essential cookies for authentication session management.
              We do not use third-party advertising or tracking cookies.
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
