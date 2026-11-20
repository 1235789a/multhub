"use client";

import { useState, type FormEvent } from "react";
import { getBrowserSupabase } from "../lib/supabase-browser";
import styles from "../lab/lab.module.css";

type CompanyRow = { id: string; name: string; stage: string; hold_reason: string | null };
type Summary = {
  stage: string;
  hold_reason: string | null;
  baseline: { runs: number; recommended: number; officialLink: number; cited: number };
  reports: Array<{ id: string; expires_at: string; revoked_at: string | null; confirmed_visits: number; preview_bots: number }>;
};

export default function Workspace() {
  const [token, setToken] = useState("");
  const [rows, setRows] = useState<CompanyRow[]>([]);
  const [company, setCompany] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [issued, setIssued] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function request<T = unknown>(path = "", body?: unknown): Promise<T> {
    const supabase = getBrowserSupabase();
    const session = supabase ? (await supabase.auth.getSession()).data.session : null;
    const response = await fetch(`/api/lab/companies${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || session?.access_token || ""}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json();
    if (!response.ok) throw new Error((result as { error?: string }).error ?? "Workspace request failed.");
    return result as T;
  }

  async function perform(action: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not open the workspace.");
    } finally {
      setBusy(false);
    }
  }

  function load(event: FormEvent) {
    event.preventDefault();
    void perform(async () => {
      setRows((await request<{ companies: CompanyRow[] }>()).companies);
      setSummary(null);
      setCompany("");
      setIssued("");
    });
  }

  return <>
    <p>Sign in with an admin account, or enter the workspace access token.</p>
    <form onSubmit={load}>
      <label>Access token <input type="password" value={token} onChange={(event) => setToken(event.target.value)} autoComplete="off" /></label>
      <button className="button" disabled={busy}>Load companies</button>
    </form>
    {error ? <p role="alert">{error}</p> : null}
    {rows.length ? <div className={styles.detail}>
      <label>Company
        <select value={company} disabled={busy} onChange={(event) => {
          const id = event.target.value;
          setCompany(id);
          setSummary(null);
          setIssued("");
          if (id) void perform(async () => setSummary(await request<Summary>(`/${id}`)));
        }}>
          <option value="">Choose a company</option>
          {rows.map((row) => <option key={row.id} value={row.id}>{row.name} · {row.hold_reason ? "HOLD" : row.stage}</option>)}
        </select>
      </label>
    </div> : null}
    {summary ? <div className={styles.detail}>
      <p><strong>{summary.stage}</strong>{summary.hold_reason ? ` · ${summary.hold_reason}` : ""}</p>
      <p>{summary.baseline.runs} complete runs, {summary.baseline.recommended} recommendations, {summary.baseline.officialLink} official links and {summary.baseline.cited} citations.</p>
      <button className="button" disabled={busy || Boolean(summary.hold_reason)} onClick={() => void perform(async () => {
        const result = await request<{ path: string }>(`/${company}/reports`, { days: 30 });
        setIssued(result.path);
        setSummary(await request<Summary>(`/${company}`));
      })}>Issue 30-day link</button>
      {issued ? <p><a className={styles.link} href={issued} target="_blank" rel="noreferrer">Open newly issued report</a></p> : null}
      {summary.reports.map((report) => <div className={styles.detail} key={report.id}>
        <p>{report.revoked_at ? "Revoked" : `Expires ${report.expires_at.slice(0, 10)}`} · {report.confirmed_visits} interaction-confirmed visits · {report.preview_bots} link previews</p>
        {!report.revoked_at ? <button className="button button--secondary" disabled={busy} onClick={() => void perform(async () => {
          await request(`/${company}/revoke`, { reportId: report.id });
          setIssued("");
          setSummary(await request<Summary>(`/${company}`));
        })}>Revoke link</button> : null}
      </div>)}
    </div> : null}
  </>;
}
