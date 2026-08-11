import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "molthub is offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <div className="offline-card">
        <div className="offline-card__mark">M</div>
        <h1>You are offline.</h1>
        <p>
          Reconnect to run a live scan, sign in, create an order, or verify a USDT-TRC20 payment.
          No payment status is guessed while the network is unavailable.
        </p>
        <a className="button button--gold" href="/app">Try again</a>
      </div>
    </main>
  );
}
