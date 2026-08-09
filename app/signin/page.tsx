import type { Metadata } from "next";
import { SignInPage } from "../components/SignInPage";
import { Footer, Header } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Sign in | molthub",
  description: "Sign in to save molthub scans and track USDT-TRC20 orders.",
};

export default function SignInRoute() {
  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="container">
          <SignInPage />
        </div>
      </main>
      <Footer />
    </>
  );
}
