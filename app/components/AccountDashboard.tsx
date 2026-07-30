"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
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
          <span>Current plan</span>
          <strong>Free</strong>
          <small>Upgrade when useful</small>
        </article>
      </div>

      <div className="account-history">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Scan history</p>
            <h2>Your recent projects</h2>
          </div>
          <a className="button button--gold" href="/#free-scan">
            Run another scan
          </a>
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
            No completed scans yet. Run the free preview to create your first
            saved result.
          </p>
        )}
      </div>
    </div>
  );
}
