"use client";

import { FormEvent, useEffect, useState } from "react";
import type { HedgehogSnapshot } from "../lib/hedgehog";
import { HedgehogExperience } from "./HedgehogExperience";
import { getAnonymousId, trackProductEvent } from "../lib/product-events";

type ScanResponse = HedgehogSnapshot & {
  verdict: string;
  prompts: string[];
  actions: string[];
  usage: { used: number; limit: number } | null;
  shareGrant: { id: string; key: string } | null;
};

const CURRENT_KEY = "molthub_hedgehog_current_v1";
const HISTORY_KEY = "molthub_hedgehog_history_v1";

function host(value: string) {
  try { return new URL(value).hostname.toLowerCase(); }
  catch { return ""; }
}
function getHistory(): Record<string, HedgehogSnapshot> {
  try { return JSON.parse(window.localStorage.getItem(HISTORY_KEY) || "{}") as Record<string, HedgehogSnapshot>; }
  catch { return {}; }
}

export function FreeScan() {
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("Web3 infrastructure");
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [previous, setPrevious] = useState<HedgehogSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = window.sessionStorage.getItem(CURRENT_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as ScanResponse;
        if (stored.snapshotId && stored.signals?.length) {
          setResult(stored);
          setWebsite(stored.website);
          setCategory(stored.category);
        }
      }
    } catch {
      // Restoring a result must never block fresh scans.
    }
    const params = new URLSearchParams(window.location.search);
    const referral = params.get("ref");
    if (referral && /^[a-z0-9-]{36}$/i.test(referral)) {
      window.sessionStorage.setItem("molthub_hedgehog_referral", referral);
    }
  }, []);

  async function runScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    await trackProductEvent("scan_started", { category, referred: Boolean(window.sessionStorage.getItem("molthub_hedgehog_referral")) });
    try {
      const sourceReportId = window.sessionStorage.getItem("molthub_hedgehog_referral");
      const response = await fetch("/api/free-scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ website, category, anonymousId: getAnonymousId(), sourceReportId }),
      });
      const payload = await response.json() as ScanResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || "The scan could not be completed.");
      if (!payload.snapshotId || !payload.signals || !payload.hedgehog) throw new Error("An incomplete scan was returned. Try again.");
      const old = getHistory();
      const key = host(payload.website);
      setPrevious(old[key] || null);
      setResult(payload);
      window.sessionStorage.setItem(CURRENT_KEY, JSON.stringify(payload));
      old[key] = payload;
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(old));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The scan could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scan-shell">
      <form className="scan-form" onSubmit={runScan}>
        <div>
          <label htmlFor="scan-website">Project website</label>
          <input id="scan-website" name="website" type="text" inputMode="url"
            placeholder="yourproject.xyz" value={website}
            onChange={(event) => setWebsite(event.target.value)} required />
        </div>
        <div>
          <label htmlFor="scan-category">Project category</label>
          <select id="scan-category" name="category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>Stablecoin payments</option>
            <option>Crypto payment infrastructure</option>
            <option>Web3 wallet</option>
            <option>Developer tools</option>
            <option>On-chain data</option>
            <option>Web3 SaaS</option>
            <option>Web3 infrastructure</option>
          </select>
        </div>
        <button className="button button--gold" type="submit" disabled={loading || !hydrated}>
          {!hydrated ? "Preparing scanner…" : loading ? "Reading your homepage…" : "Reveal My Hedgehog 🦔"}
        </button>
      </form>
      <div className="scan-account-note">
        <span>No sign-up, no contact details. Your result stays private unless you choose to publish it.</span>
        <a href="/account">Existing customer account →</a>
      </div>
      {error ? <p className="scan-error" role="alert">{error}</p> : null}
      {result ? <HedgehogExperience key={result.snapshotId} result={result} previous={previous} /> : (
        <div className="hedgehog-empty">
          <span className="hedgehog-empty__emoji" aria-hidden="true">🦔</span>
          <div>
            <p className="hedgehog-eyebrow">HEDGEHOG LAB · FREE</p>
            <h3>A website audit with a surprising alter ego.</h3>
            <p>Seven observable checks. One original hedgehog. A poster you'll actually want to share.</p>
            <small>Real technical readiness ≠ real-world AI mentions. Professional audits are separate.</small>
          </div>
        </div>
      )}
    </div>
  );
}
