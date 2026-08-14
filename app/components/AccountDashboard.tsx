"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { AuthGate } from "./AuthGate";
import { getBrowserSupabase, isSupabaseConfigured } from "../lib/supabase-browser";

type AccountData = {
  user: { id: string; email?: string };
  usage: { used: number; limit: number };
  scans: Array<{
    id: string;
    website: string;
    category: string;
    score: number;
    verdict: string;
    created_at: string;
  }>;
  orders: Array<{
    id: string;
    plan_id: string;
    plan_name: string;
    amount_usdt: string | number;
    status: "pending" | "paid" | "expired" | "rejected";
    payment_txid: string | null;
    project_name: string;
    website: string;
    expires_at: string;
    paid_at: string | null;
    created_at: string;
  }>;
};

export function AccountDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  const loadAccount = useCallback(async (nextSession: Session) => {
    setSession(nextSession);
    const response = await fetch("/api/account", {
      headers: { authorization: `Bearer ${nextSession.access_token}` },
    });
    const payload = (await response.json()) as AccountData & { error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Account data could not be loaded.");
      return;
    }
    setError("");
    setData(payload);
    setAuthOpen(false);
  }, []);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data: authData }) => {
      if (authData.session) {
        void loadAccount(authData.session);
      }
    });
  }, [loadAccount]);

  async function signOut() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setData(null);
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="account-empty">
        <p className="eyebrow">Setup in progress</p>
        <h2>Account access is ready for its backend keys.</h2>
        <p>
          Once the authentication project is connected, Google and email
          sign-in will activate here without redesigning this page.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="account-empty">
          <p className="eyebrow">Your molthub account</p>
          <h2>Save scans and track improvements.</h2>
          <p>
            Sign in with Google or a secure email link. No password is required.
          </p>
          <button
            className="button button--gold"
            type="button"
            onClick={() => setAuthOpen(true)}
          >
            Sign in or create account
          </button>
        </div>
        <AuthGate
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onSignedIn={(nextSession) => void loadAccount(nextSession)}
        />
      </>
    );
  }

  return (
    <div className="account-dashboard">
      <div className="account-dashboard__header">
        <div>
          <p className="eyebrow">Signed in as</p>
          <h2>{data?.user.email ?? session.user.email}</h2>
        </div>
        <button className="button button--secondary" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>

      {error ? <p className="scan-error">{error}</p> : null}

      <div className="account-metrics">
        <article>
          <span>Free scans used</span>
          <strong>
            {data?.usage.used ?? 0}/{data?.usage.limit ?? 2}
          </strong>
          <small>Resets monthly</small>
        </article>
        <article>
          <span>Saved scans</span>
          <strong>{data?.scans.length ?? 0}</strong>
          <small>Latest 10 shown</small>
        </article>
        <article>
          <span>Payment orders</span>
          <strong>{data?.orders.length ?? 0}</strong>
          <small>Latest 10 shown</small>
        </article>
      </div>

      <div className="account-history">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Payment history</p>
            <h2>Your USDT orders</h2>
          </div>
          <Link className="button button--secondary" href="/checkout">
            Create order
          </Link>
        </div>
        {data?.orders.length ? (
          <div className="account-history__list">
            {data.orders.map((order) => (
              <article key={order.id}>
                <div>
                  <strong>{order.plan_name}</strong>
                  <span>{order.project_name}</span>
                </div>
                <div>
                  <b>{order.amount_usdt} USDT</b>
                  <span className={`payment-status payment-status--${order.status}`}>{order.status}</span>
                </div>
                <Link href={`/checkout?plan=${order.plan_id}`}>Open order</Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="account-history__empty">No payment orders yet.</p>
        )}
      </div>

      <div className="account-history">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Scan history</p>
            <h2>Your recent projects</h2>
          </div>
          <Link className="button button--gold" href="/#free-scan">
            Run another scan
          </Link>
        </div>
        {data?.scans.length ? (
          <div className="account-history__list">
            {data.scans.map((scan) => (
              <article key={scan.id}>
                <div>
                  <strong>{scan.website}</strong>
                  <span>{scan.category}</span>
                </div>
                <div>
                  <b>{scan.score}/100</b>
                  <span>{scan.verdict}</span>
                </div>
                <time dateTime={scan.created_at}>
                  {new Date(scan.created_at).toLocaleDateString()}
                </time>
              </article>
            ))}
          </div>
        ) : (
          <p className="account-history__empty">
            No completed scans yet. Run the free scan to create your first
            saved result.
          </p>
        )}
      </div>
    </div>
  );
}
