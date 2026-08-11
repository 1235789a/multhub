import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "molthub App",
  description: "The compact molthub workspace for scans, orders and Web3 AI-search insights.",
};

const quickActions = [
  { title: "Run a free scan", description: "Check a public Web3 website for technical visibility gaps.", href: "/#free-scan", label: "Start scan" },
  { title: "View your account", description: "Review saved scans and keep your USDT order history in one place.", href: "/account", label: "Open account" },
  { title: "Check an order", description: "Create or revisit a USDT-TRC20 order without connecting a wallet.", href: "/checkout?plan=trial", label: "Open checkout" },
  { title: "Read the latest", description: "Learn practical Web3 GEO ideas through the rotating insight library.", href: "/insights", label: "Open insights" },
];

export default function AppPage() {
  return (
    <>
      <Header />
      <main className="app-shell-page">
        <PageHero
          eyebrow="molthub app"
          title="Your Web3 visibility workspace."
          description="A compact starting point for scans, account history, USDT-TRC20 orders and practical AI-search insights. Install molthub from your browser for one-tap access."
        />
        <section className="section">
          <div className="container">
            <div className="app-workspace-grid">
              {quickActions.map((action) => (
                <article className="app-workspace-card" key={action.href}>
                  <h2>{action.title}</h2>
                  <p>{action.description}</p>
                  <Link className="text-link" href={action.href}>{action.label} →</Link>
                </article>
              ))}
            </div>
            <div className="app-workspace-note">
              <div>
                <h2>One account, one order trail, one place to start.</h2>
              </div>
              <div>
                <p>This first version reuses the secure website flows you already have. The payment page still verifies USDT-TRC20 onchain, and account pages remain protected by sign-in.</p>
                <Link className="button button--gold" href="/install">Install on Windows</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
