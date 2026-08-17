import { AccountDashboard } from "../components/AccountDashboard";
import { Footer, Header, PageHero } from "../components/SiteChrome";

export const metadata = {
  title: "Account | molthub",
  description: "View saved molthub scans, usage, and account details.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="account-page">
        <PageHero
          eyebrow="Account"
          title="Your AI-search readiness workspace"
          description="Save scans, monitor your free allowance, and keep a record of the projects you have checked."
        />
        <section className="section">
          <div className="container">
            <AccountDashboard />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
