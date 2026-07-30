"use client";

import { FormEvent, useState } from "react";

type ScanSignal = {
  label: string;
  passed: boolean;
  detail: string;
};

type ScanResult = {
  website: string;
  projectName: string;
  category: string;
  score: number;
  verdict: string;
  signals: ScanSignal[];
  prompts: string[];
  actions: string[];
  note: string;
};

export function FreeScan() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runScan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/free-scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          website: form.get("website"),
          category: form.get("category"),
        }),
      });
      const data = (await response.json()) as ScanResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "The scan could not be completed.");
      }
      setResult(data);
    } catch (scanError) {
      setError(
        scanError instanceof Error
          ? scanError.message
          : "The scan could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  }

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
            required
          />
        </div>
        <div>
          <label htmlFor="scan-category">Project category</label>
          <select
            id="scan-category"
            name="category"
            defaultValue="Web3 infrastructure"
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
          {loading ? "Scanning…" : "Run Free Scan"}
        </button>
      </form>

      {error ? (
        <p className="scan-error" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="scan-result" aria-live="polite">
          <div className="scan-score">
            <span>{result.score}</span>
            <small>/100 readiness</small>
          </div>
          <div className="scan-result__summary">
            <p className="eyebrow">{result.projectName}</p>
            <h3>{result.verdict}</h3>
            <p>{result.note}</p>
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
                The 2.99 USDT trial adds prompt testing, one competitor and a
                downloadable report.
              </span>
            </div>
            <a className="button button--secondary" href="#trial-order">
              Unlock the $2.99 Report
            </a>
          </div>
        </div>
      ) : (
        <div className="scan-empty" aria-hidden="true">
          <div>
            <span>01</span>
            <strong>Crawler access</strong>
          </div>
          <div>
            <span>02</span>
            <strong>Content signals</strong>
          </div>
          <div>
            <span>03</span>
            <strong>Prompt ideas</strong>
          </div>
          <div>
            <span>04</span>
            <strong>Priority actions</strong>
          </div>
        </div>
      )}
    </div>
  );
}
