import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Partner with molthub — Web3 referrals",
  description:
    "A transparent referral pilot for small Web3 community operators and niche builders.",
  alternates: { canonical: "https://molthub.click/partners" },
};

const partnerTypes = [
  ["Builder communities", "Small groups where founders compare tools, launch plans, or documentation."],
  ["Wallet and infra operators", "Regional operators who can reach teams with real product or integration questions."],
  ["Niche educators", "Independent researchers and moderators who prefer useful resources over banner ads."],
];

const steps = [
  ["01", "Apply", "Tell us who your audience serves and the kinds of Web3 projects you can reach."],
  ["02", "Qualify", "We agree on a narrow pilot, issue a partner code, and define what counts as a qualified order."],
  ["03", "Attribute", "A code or referral link is attached to the lead and checked against the order record."],
  ["04", "Settle", "Approved commissions are recorded with the order, then paid manually after the review window."],
];

export default function PartnersPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Partner Pilot" }]}
          eyebrow="Partner pilot"
          title="Help serious Web3 teams find the evidence they are missing."
          description="molthub works best when a trusted niche operator introduces a team with a real AI-visibility, documentation, or fact-clarity problem. This is a small referral pilot, not an ad marketplace."
        />

        <section className="section partner-page">
          <div className="container">
            <div className="partner-callout">
              <div>
                <p className="eyebrow">The fit</p>
                <h2>Reach beats reach-count.</h2>
                <p>
                  We are looking for small, relevant communities rather than
                  accounts that sell generic placements. A good introduction
                  starts with a project that already has a question to answer.
                </p>
              </div>
              <div className="partner-callout__rule">
                <span>One simple rule</span>
                <strong>No invented claims, no forced promotion, no upfront ad spend.</strong>
              </div>
            </div>

            <div className="partner-section-heading">
              <p className="eyebrow">Who fits</p>
              <h2>Three useful audience shapes.</h2>
            </div>
            <div className="partner-grid partner-grid--three">
              {partnerTypes.map(([title, description]) => (
                <article key={title} className="partner-card">
                  <span>Relevant audience</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>

            <div className="partner-section-heading">
              <p className="eyebrow">How it works</p>
              <h2>Every handoff has a visible status.</h2>
            </div>
            <div className="partner-grid partner-grid--four">
              {steps.map(([number, title, description]) => (
                <article key={number} className="partner-card partner-card--step">
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>

            <div className="partner-economics">
              <div>
                <p className="eyebrow">Commission and wallet safety</p>
                <h2>Start with a ledger, not a promise.</h2>
                <p>
                  A partner code, order ID, commission amount, review status,
                  and payout reference should be recorded before money moves.
                  USDT-TRC20 can be used for settlement after both sides agree
                  on the wallet address and review window.
                </p>
              </div>
              <ul>
                <li><strong>Pending</strong><span>Order received; attribution is being checked.</span></li>
                <li><strong>Approved</strong><span>Scope delivered and commission cleared for payout.</span></li>
                <li><strong>Paid</strong><span>Manual transfer recorded with a transaction reference.</span></li>
                <li><strong>Automation status</strong><span>Automatic wallet payouts are not enabled in this pilot.</span></li>
              </ul>
            </div>

            <div className="partner-cta">
              <div>
                <p className="eyebrow">Apply for a narrow pilot</p>
                <h2>Bring one relevant introduction first.</h2>
                <p>Include your audience type, region, and the kind of Web3 team you can reach.</p>
              </div>
              <div className="button-row">
                <a
                  className="button button--gold"
                  href="mailto:chengzhao640@gmail.com?subject=molthub%20partner%20pilot"
                >
                  Email a partner intro
                </a>
                <Link className="button button--secondary" href="/#services">
                  View service fit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
