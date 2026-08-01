import type { Metadata } from "next";
import { Footer, Header, PageHero } from "../components/SiteChrome";
import { contactConfig } from "../data/contact";

export const metadata: Metadata = {
  title: "Terms of Service — molthub",
  description:
    "The terms under which molthub provides scans, reports, audits, and implementation services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Legal"
          title="Terms of Service"
          description="The terms under which molthub provides its services."
        />
        <section className="section">
          <div className="container legal-content">
            <h2>1. Services</h2>
            <p>
              molthub provides Web3 GEO (Generative Engine Optimization) services
              including free quick scans, paid visibility reports, verified
              baselines, expert audits, and done-for-you GEO Sprints. Sprint is
              an application-based service; scope and price are confirmed during
              application review before any payment is requested.
            </p>

            <h2>2. No guaranteed outcomes</h2>
            <p>
              AI search engines (ChatGPT, Perplexity, Google AI Overviews, etc.)
              operate on proprietary and constantly changing models. molthub
              does not guarantee specific AI rankings, citations, mentions, or
              recommendations. We provide evidence-based analysis and
              recommendations to improve your project's visibility and source
              quality.
            </p>

            <h2>3. Payments</h2>
            <ul>
              <li>
                Paid plans (Instant Visibility Report, Verified GEO Baseline,
                Expert Web3 GEO Audit) are purchased with USDT on the TRON
                network (TRC20).
              </li>
              <li>
                The GEO Sprint is application-based. No fixed-amount payment
                order is created until scope and price are confirmed.
              </li>
              <li>
                You are responsible for sending the correct amount to the
                correct address on the correct network. Sending to the wrong
                network or address may result in permanent loss of funds.
              </li>
              <li>
                See our <a href="/refund">Refund Policy</a> and{" "}
                <a href="/delivery">Delivery Policy</a> for details.
              </li>
            </ul>

            <h2>4. Your responsibilities</h2>
            <ul>
              <li>Provide accurate project information when creating an order.</li>
              <li>Do not submit websites you do not own or have permission to analyze.</li>
              <li>Do not attempt to abuse, reverse-engineer, or disrupt the service.</li>
            </ul>

            <h2>5. Intellectual property</h2>
            <p>
              Scan results, reports, and deliverables are provided for your
              internal use. You may not redistribute, resell, or publicly
              publish paid deliverables without written permission. Case studies
              and insights published on molthub.click are owned by molthub.
            </p>

            <h2>6. Limitation of liability</h2>
            <p>
              molthub is not liable for indirect, incidental, or consequential
              damages arising from the use of our services. Total liability is
              limited to the amount paid for the specific service in question.
            </p>

            <h2>7. Changes to terms</h2>
            <p>
              We may update these terms. Continued use of the service after
              changes constitutes acceptance of the updated terms.
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
