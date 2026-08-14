import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components/SiteChrome";
import { WindowsInstall } from "../components/WindowsInstall";

export const metadata: Metadata = {
  title: "Install molthub on Windows",
  description:
    "Install the molthub Web3 visibility workspace on Windows from Microsoft Edge or Google Chrome.",
};

export default function InstallPage() {
  return (
    <>
      <Header />
      <main className="install-page">
        <section className="install-hero">
          <div className="container install-hero__grid">
            <div>
              <h1>Install molthub on Windows.</h1>
              <p>
                Use molthub in its own window, launch it from the Start menu, and keep your
                scans, account and order trail one click away.
              </p>
              <WindowsInstall />
            </div>
            <div className="windows-app-preview" aria-label="molthub Windows app window">
              <div className="windows-app-preview__bar">
                <span />
                <strong>molthub</strong>
                <i>— □ ×</i>
              </div>
              <div className="windows-app-preview__body">
                <div className="windows-app-preview__brand">M</div>
                <h2>Your Web3 visibility workspace.</h2>
                <div>
                  <span>Free scan</span>
                  <span>Account</span>
                  <span>USDT order</span>
                  <span>Insights</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section install-benefits">
          <div className="container">
            <div className="install-benefits__grid">
              <article>
                <h2>Separate app window</h2>
                <p>No browser tabs around the workspace. It opens like a normal Windows app.</p>
              </article>
              <article>
                <h2>Safe browser sign-in</h2>
                <p>Google and email sign-in keep using the browser-compatible authentication flow.</p>
              </article>
              <article>
                <h2>Protected payment flow</h2>
                <p>USDT-TRC20 orders remain server-verified. No wallet connection or custody is added.</p>
              </article>
              <article>
                <h2>Useful offline fallback</h2>
                <p>The app explains when a live scan, sign-in or payment check needs a connection.</p>
              </article>
            </div>
            <div className="install-next">
              <div>
                <h2>Already installed?</h2>
                <p>Open the compact workspace or return to the full website at any time.</p>
              </div>
              <div>
                <Link className="button button--gold" href="/app">Open workspace</Link>
                <Link className="button button--secondary" href="/">View website</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
