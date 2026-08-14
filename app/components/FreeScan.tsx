"use client";

import { FormEvent, useCallback, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { AuthGate } from "./AuthGate";
import { getAnonymousId, trackProductEvent } from "../lib/product-events";

type ScanSignal = {
  label: string;
  passed: boolean;
  detail: string;
};

type FullScanResult = {
  preview: false;
  website: string;
  projectName: string;
  category: string;
  score: number;
  verdict: string;
  signals: ScanSignal[];
  prompts: string[];
  actions: string[];
  note: string;
  usage: { used: number; limit: number };
};

type PreviewScanResult = {
  preview: true;
  requiresAccount: true;
  website: string;
  projectName: string;
  category: string;
  score: number;
  verdict: string;
  firstGap: ScanSignal | null;
  lockedFindings: number;
  note: string;
};

type ScanResult = FullScanResult | PreviewScanResult;

const PENDING_SCAN_KEY = "molthub_pending_scan";

export function FreeScan() {
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("Web3 infrastructure");
  const [session, setSession] = useState<Session | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const runScanRequest = useCallback(
    async (
      scanWebsite: string,
      scanCategory: string,
      activeSession?: Session | null,
    ) => {
      setLoading(true);
      setError("");
      await trackProductEvent(
        "scan_started",
        { website: scanWebsite, category: scanCategory },
        activeSession,
      );

      try {
        const response = await fetch("/api/free-scan", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(activeSession?.access_token
              ? { authorization: `Bearer ${activeSession.access_token}` }
              : {}),
          },
          body: JSON.stringify({
            website: scanWebsite,
            category: scanCategory,
            anonymousId: getAnonymousId(),
          }),
        });
        const data = (await response.json()) as ScanResult & {
          error?: string;
          code?: string;
        };
        if (!response.ok) {
          throw new Error(data.error || "The scan could not be completed.");
        }

        setResult(data);
        if (!data.preview) {
          window.localStorage.removeItem(PENDING_SCAN_KEY);
          setAuthOpen(false);
        }
      } catch (scanError) {
        setError(
          scanError instanceof Error
            ? scanError.message
            : "The scan could not be completed.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  async function runScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    window.localStorage.setItem(
      PENDING_SCAN_KEY,
      JSON.stringify({ website, category }),
    );
    await runScanRequest(website, category, session);
  }

  const handleSignedIn = useCallback(
    (nextSession: Session) => {
      setSession(nextSession);
      setAuthOpen(false);

      const pendingRaw = window.localStorage.getItem(PENDING_SCAN_KEY);
      let pending: { website?: string; category?: string } | null = null;
      try {
        pending = pendingRaw ? JSON.parse(pendingRaw) : null;
      } catch {
        pending = null;
      }

      const nextWebsite = pending?.website || website;
      const nextCategory = pending?.category || category;
      if (nextWebsite && (!result || result.preview)) {
        setWebsite(nextWebsite);
        setCategory(nextCategory);
        void runScanRequest(nextWebsite, nextCategory, nextSession);
      }
    },
    [category, result, runScanRequest, website],
  );

  return (
    <div className="scan-shell">
      <form className="scan-form" onSubmit={runScan}>
        <div>
          <label htmlFor="scan-website">Project website</label>
          <input
            id="scan-website"
            name="website"
            type="text"
            inputMode="url"
            placeholder="yourproject.xyz"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="scan-category">Project category</label>
          <select
            id="scan-category"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Stablecoin payments</option>
            <option>Crypto payment infrastructure</option>
            <option>Web3 wallet</option>
            <option>Developer tools</option>
            <option>On-chain data</option>
            <option>Web3 SaaS</option>
            <option>Web3 infrastructure</option>
          </select>
        </div>
        <button
          className="button button--gold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Scanning…" : session ? "Run & Save Scan" : "Run Free Scan"}
        </button>
      </form>

      <div className="scan-account-note">
        <span>
          {session
            ? `Signed in as ${session.user.email ?? "molthub user"}`
            : "Run the scan first. Create a free account only if you want to save the result."}
        </span>
        <a href="/account">{session ? "View account" : "Account sign-in"}</a>
      </div>

      {error ? (
        <p className="scan-error" role="alert">
          {error}
        </p>
      ) : null}

      {result?.preview ? (
        <div className="scan-preview" aria-live="polite">
          <div className="scan-score">
            <span>{result.score}</span>
            <small>/100 readiness</small>
          </div>
          <div className="scan-result__summary">
            <p className="eyebrow">{result.projectName}</p>
            <h3>{result.verdict}</h3>
            {result.firstGap ? (
              <div className="scan-preview__finding">
                <span className={result.firstGap.passed ? "scan-pass" : "scan-gap"}>
                  {result.firstGap.passed ? "Detected" : "Priority gap"}
                </span>
                <strong>{result.firstGap.label}</strong>
                <p>{result.firstGap.detail}</p>
              </div>
            ) : null}
          </div>
          <div className="scan-lock">
            <div className="scan-lock__icon" aria-hidden="true">
              M
            </div>
            <div>
              <p className="eyebrow">Free account required</p>
              <h3>Unlock {result.lockedFindings} more checks and save this scan</h3>
              <p>{result.note}</p>
            </div>
            <button
              className="button button--gold"
              type="button"
              onClick={() => setAuthOpen(true)}
            >
              Create free account
            </button>
          </div>
        </div>
      ) : result ? (
        <div className="scan-result" aria-live="polite">
          <div className="scan-score">
            <span>{result.score}</span>
            <small>/100 readiness</small>
          </div>
          <div className="scan-result__summary">
            <p className="eyebrow">{result.projectName}</p>
            <h3>{result.verdict}</h3>
            <p>{result.note}</p>
            <span className="scan-usage">
              Free scans used this month: {result.usage.used}/{result.usage.limit}
            </span>
          </div>
          <div className="scan-signals">
            {result.signals.map((signal) => (
              <div key={signal.label}>
                <span className={signal.passed ? "scan-pass" : "scan-gap"}>
                  {signal.passed ? "Pass" : "Gap"}
                </span>
                <div>
                  <strong>{signal.label}</strong>
                  <p>{signal.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scan-result__columns">
            <div>
              <p className="eyebrow">3 buyer-intent prompts</p>
              <ol>
                {result.prompts.map((prompt) => (
                  <li key={prompt}>{prompt}</li>
                ))}
              </ol>
            </div>
            <div>
              <p className="eyebrow">Fix first</p>
              <ol>
                {result.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="scan-upgrade">
            <div>
              <strong>Need real AI-platform checks?</strong>
              <span>
                The 9.99 USDT starting order adds a defined prompt set, competitor
                review, and report delivery after payment confirmation.
              </span>
            </div>
            <a
              className="button button--secondary"
              href="/checkout?plan=trial"
              onClick={() =>
                void trackProductEvent(
                  "trial_checkout_started",
                  { website: result.website },
                  session,
                )
              }
            >
              Start the 9.99 USDT Report
            </a>
          </div>
        </div>
      ) : (
        <div className="scan-empty" aria-hidden="true">
          <div>
            <span>01</span>
            <strong>Instant score</strong>
          </div>
          <div>
            <span>02</span>
            <strong>One visible gap</strong>
          </div>
          <div>
            <span>03</span>
            <strong>Sign in to unlock</strong>
          </div>
          <div>
            <span>04</span>
            <strong>Saved history</strong>
          </div>
        </div>
      )}

      <AuthGate
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignedIn={handleSignedIn}
      />
    </div>
  );
}
