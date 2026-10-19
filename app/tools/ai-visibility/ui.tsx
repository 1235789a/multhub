"use client";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import type { Report, Check } from "../../../lib/visibility/types";
import "./visibility.css";
import {
  QuestionLibrary,
  PartnerResources,
  QuestionPlan,
  downloadText,
} from "./resources";
import {
  questionPackOptions,
  validPackId,
  type QuestionPack,
} from "../../../lib/visibility/questions";
import {
  auditOffers,
  DEFAULT_AUDIT_OFFER,
  findOffer,
} from "../../../lib/visibility/offers";
const BASE = "/tools/ai-visibility",
  API = "/api/visibility";
const date = (value: string) =>
  new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";
const icons = { arrow: "↗", check: "✓", close: "×", dash: "—" };
function Icon({ kind = "arrow" }: { kind?: keyof typeof icons }) {
  return <span aria-hidden="true">{icons[kind]}</span>;
}
function Header() {
  return (
    <header className="vh-header">
      <a href={BASE} className="vh-logo" aria-label="MultiHub home">
        <span className="vh-mark">
          m<span>↗</span>
        </span>
        <b>
          MultiHub<span> / Visibility Lab</span>
        </b>
      </a>
      <nav aria-label="Tool navigation">
        <a href={BASE + "/questions"}>Question library</a>
        <a href="https://molthub.click" target="_blank" rel="noreferrer">
          GEO services <Icon />
        </a>
      </nav>
    </header>
  );
}
function Footer() {
  return (
    <footer className="vh-footer">
      <a className="vh-logo" href={BASE}>
        <b>
          MultiHub<span> / Visibility Lab</span>
        </b>
      </a>
      <p>Evidence first. Better decisions next.</p>
      <div>
        <a href={BASE + "/privacy"}>Privacy & method</a>
        <a href={BASE + "/partners"}>For partners</a>
        <a href={BASE + "/admin"}>Admin</a>
        <a href="https://github.com/1235789a/multhub">Source ↗</a>
      </div>
    </footer>
  );
}
function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={"vh-badge " + tone}>{children}</span>;
}
function ErrorBox({ error }: { error: string }) {
  return error ? (
    <div className="vh-error" role="alert">
      <strong>We couldn’t complete that.</strong>
      <p>{error}</p>
    </div>
  ) : null;
}
async function api(path: string, options: RequestInit = {}) {
  const r = await fetch(API + path, {
    ...options,
    headers: { "content-type": "application/json", ...options.headers },
  });
  const d: any = await r.json();
  if (!r.ok)
    throw new Error(d.error || "The service is unavailable. Please retry.");
  return d;
}
function trackEvent(reportId: string, scanId: string, event: string) {
  if (scanId)
    void api("/events", {
      method: "POST",
      body: JSON.stringify({ reportId, scanId, event }),
    }).catch(() => {});
}
export function VisibilityApp({
  reportId,
  initialReport,
  mode,
}: {
  reportId?: string;
  initialReport?: Report;
  mode?: string;
}) {
  const [report, setReport] = useState<Report | null>(initialReport ?? null),
    [scanId, setScanId] = useState(""),
    [loading, setLoading] = useState(Boolean(reportId && !initialReport)),
    [error, setError] = useState(""),
    [cacheHit, setCacheHit] = useState(false);
  useEffect(() => {
    if (!reportId || initialReport) return;
    let active = true;
    api("/reports/" + reportId)
      .then((d) => {
        if (active) setReport(d.report);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reportId, initialReport]);
  useEffect(() => {
    if (!report) return;
    try {
      setScanId(sessionStorage.getItem("vh-scan:" + report.id) || "");
    } catch {
      /* Storage is optional. */
    }
  }, [report?.id]);
  function completed(d: { report: Report; scanId: string; cacheHit: boolean }) {
    setReport(d.report);
    setScanId(d.scanId);
    try {
      sessionStorage.setItem("vh-scan:" + d.report.id, d.scanId);
    } catch {
      /* Storage is optional. */
    }
    setCacheHit(d.cacheHit);
    setError("");
    window.history.pushState(null, "", BASE + "/report/" + d.report.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div id="visibility-app">
      <Header />
      {mode === "questions" ? (
        <QuestionLibrary />
      ) : mode === "partners" ? (
        <PartnerResources />
      ) : mode === "admin" ? (
        <Admin />
      ) : mode === "privacy" ? (
        <Privacy />
      ) : mode === "delete" ? (
        <DeleteRequest />
      ) : report ? (
        <ReportView
          report={report}
          scanId={scanId}
          cacheHit={cacheHit}
          onUpdate={completed}
        />
      ) : reportId ? (
        <main className="vh-container vh-empty">
          {loading ? (
            <>
              <span className="vh-spinner" />
              <h1>Opening your report</h1>
              <p>Loading the original scan and evidence.</p>
            </>
          ) : (
            <>
              <Badge tone="warn">Report unavailable</Badge>
              <h1>This report could not be opened.</h1>
              <ErrorBox error={error} />
              <a className="vh-button primary" href={BASE}>
                Run a new free scan <Icon />
              </a>
            </>
          )}
        </main>
      ) : (
        <Landing onComplete={completed} />
      )}
      <Footer />
    </div>
  );
}
function Landing({ onComplete }: { onComplete: (d: any) => void }) {
  return (
    <>
      <section className="vh-hero">
        <div className="vh-container vh-hero-grid">
          <div className="vh-hero-copy">
            <div className="vh-eyebrow">
              <i /> THE FREE AI SEARCH READINESS CHECK
            </div>
            <h1>
              Built to be found.
              <br />
              Ready for <em>AI search?</em>
            </h1>
            <p className="vh-intro">
              See how ready your brand is for AI search.
              <br />
              Find the technical gaps. Get the evidence.
              <br />
              Know exactly what to fix next.
            </p>
            <div className="vh-hero-notes">
              <span>
                <Icon kind="check" /> No signup
              </span>
              <span>
                <Icon kind="check" /> No model fees
              </span>
              <span>
                <Icon kind="check" /> Real website checks
              </span>
            </div>
            <div className="vh-boundary">
              <span className="vh-orbit">◎</span>
              <p>
                <strong>Readiness is the starting point.</strong>
                <br />
                This scan checks your website. Actual AI mentions require a
                separate model test.
              </p>
            </div>
          </div>
          <ScanForm onComplete={onComplete} />
        </div>
        <div className="vh-hero-bottom vh-container">
          <span>MADE FOR SMALL TEAMS WITH BIG AMBITIONS</span>
          <p>
            AI SaaS <i /> Web3 builders <i /> Independent makers <i /> SEO
            agencies
          </p>
        </div>
      </section>
      <main>
        <section className="vh-container vh-section">
          <div className="vh-section-title">
            <div>
              <p className="vh-eyebrow">LESS GUESSWORK. MORE SIGNAL.</p>
              <h2>From a URL to a clear next move.</h2>
            </div>
            <p>
              A useful first diagnosis, before you spend
              <br />
              time or money on a deeper audit.
            </p>
          </div>
          <div className="vh-feature-grid">
            {[
              [
                "01",
                "Can search crawlers reach you?",
                "Check robots.txt, indexing directives and your XML sitemap. Know what is allowed, missing or unverified.",
                "Discovery",
              ],
              [
                "02",
                "Can systems understand you?",
                "Inspect structured data, metadata and brand consistency in the HTML your website actually serves.",
                "Understanding",
              ],
              [
                "03",
                "What should you fix first?",
                "Get prioritized actions, captured evidence and a shareable report your team can put to work.",
                "Action",
              ],
            ].map(([n, title, desc, label]) => (
              <article key={n} className="vh-feature">
                <div>
                  <span>{n}</span>
                  <Badge>{label}</Badge>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="vh-feature-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>
        <section className="vh-method-strip">
          <div className="vh-container">
            <div>
              <Badge tone="mint">OPEN METHOD</Badge>
              <h2>
                A score you can inspect.
                <br />A report you can trust.
              </h2>
            </div>
            <p>
              Every result comes from a published rule and a live fetch. No
              invented rankings, hidden AI predictions or made-up
              recommendations. Unavailable evidence stays unverified.
            </p>
            <a href={BASE + "/privacy"}>
              Explore the method <Icon />
            </a>
          </div>
        </section>
        <section className="vh-container vh-section vh-faq">
          <div>
            <p className="vh-eyebrow">A FEW USEFUL ANSWERS</p>
            <h2>Before you scan.</h2>
          </div>
          <div>
            {[
              [
                "Is this a ChatGPT ranking checker?",
                "The free scan measures technical readiness. It does not query ChatGPT, Gemini or Perplexity. Optional administrator-run API tests are separate and are labeled with their model, question, conditions and answer.",
              ],
              [
                "What does the score mean?",
                "It summarizes nine published checks on the submitted page and three site files. It is a diagnostic heuristic, not a prediction of ranking, citations or revenue. Unknown checks are excluded and lower evidence coverage.",
              ],
              [
                "Is my report private?",
                "Reports are accessible to anyone with their unlisted link for 30 days. Scan only public URLs. Contact details are stored separately, protected by admin access and never included in public reports.",
              ],
              [
                "Does this cost anything?",
                "The readiness scan is free and uses no paid model APIs. You can optionally request a detailed audit. There is no automatic subscription or payment.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
function ScanForm({ onComplete }: { onComplete: (d: any) => void }) {
  const [website, setWebsite] = useState(""),
    [brand, setBrand] = useState(""),
    [industry, setIndustry] = useState(""),
    [packId, setPackId] = useState(""),
    [competitor, setCompetitor] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("pack");
    if (validPackId(p)) setPackId(p);
  }, []);
  useEffect(() => {
    if (!busy) return;
    setElapsed(0);
    const timer = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(timer);
  }, [busy]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const d = await api("/scans", {
        method: "POST",
        body: JSON.stringify({
          website,
          brand,
          industry,
          questionPackId: packId,
          competitor,
          ref: params.get("ref") || "",
          source: params.get("utm_source") || "direct",
        }),
      });
      onComplete(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="vh-scan-card" id="scan">
      <div className="vh-card-title">
        <div className="vh-scan-icon">⌁</div>
        <div>
          <h2>Your website, under the lens.</h2>
          <p>A free report. A practical starting point.</p>
        </div>
        <Badge tone="mint">FREE</Badge>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="vh-website">
          Website URL <span>Required</span>
        </label>
        <div className="vh-url-input">
          <span aria-hidden="true">◎</span>
          <input
            id="vh-website"
            name="website"
            inputMode="url"
            autoComplete="url"
            placeholder="yourcompany.com"
            required
            maxLength={2048}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={busy}
          />
        </div>
        <details className="vh-options">
          <summary>
            Fine-tune your scan <span>Optional +</span>
          </summary>
          <div>
            <label htmlFor="vh-brand">
              Brand name <span>Auto-detected if empty</span>
            </label>
            <input
              id="vh-brand"
              placeholder="Your brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              maxLength={100}
              disabled={busy}
            />
            <label htmlFor="vh-pack">Buyer-question pack</label>
            <select
              id="vh-pack"
              value={packId}
              onChange={(e) => setPackId(e.target.value)}
              disabled={busy}
            >
              <option value="">Auto-select from category</option>
              {questionPackOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <small>
              Templates for optional real model tests.{" "}
              <a href={BASE + "/questions"}>Explore question packs ↗</a>
            </small>
            <label htmlFor="vh-industry">Industry / product category</label>
            <input
              id="vh-industry"
              placeholder="e.g. AI customer support tools"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              maxLength={100}
              disabled={busy}
            />
            <label htmlFor="vh-competitor">Competitor URL</label>
            <input
              id="vh-competitor"
              placeholder="competitor.com"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              maxLength={2048}
              disabled={busy}
            />
            <small>
              Saved for optional model tests; not included in the free readiness
              score.
            </small>
          </div>
        </details>
        <button className="vh-button primary" type="submit" disabled={busy}>
          {busy ? (
            <>
              <span className="vh-spinner" /> Inspecting your website…
            </>
          ) : (
            <>
              Check My Website — Free <Icon />
            </>
          )}
        </button>
        <div role="status" aria-live="polite">
          {busy && (
            <div className="vh-progress">
              <div className="vh-progress-track" />
              <p>
                Fetching the page and site files, then inspecting the HTML.{" "}
                {elapsed}s
              </p>
            </div>
          )}
        </div>
        <ErrorBox error={error} />
        <p className="vh-form-note">
          No account needed. Reports are shareable by link.
          <br />
          Only submit public websites.{" "}
          <a href={BASE + "/privacy"}>Privacy & method</a>
        </p>
      </form>
      <div className="vh-card-bottom">
        <span>↳</span> Crawl access · Structured data · Content · Brand identity
      </div>
    </div>
  );
}
function ReportView({
  report: r,
  scanId,
  cacheHit,
  onUpdate,
}: {
  report: Report;
  scanId: string;
  cacheHit: boolean;
  onUpdate: (d: { report: Report; scanId: string; cacheHit: boolean }) => void;
}) {
  const [filter, setFilter] = useState("all"),
    [copied, setCopied] = useState(""),
    [editBrand, setEditBrand] = useState(false),
    [brand, setBrand] = useState(r.brand),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    trackEvent(r.id, scanId, "report_view");
  }, [r.id, scanId]);
  const issues = r.checks.filter(
      (c) => c.status === "fail" || c.status === "warn",
    ),
    unknown = r.checks.filter((c) => c.status === "unknown");
  const fixes = issues.filter((c) => c.priority !== "Low").slice(0, 3);
  const shown = r.checks.filter(
    (c) =>
      filter === "all" ||
      (filter === "attention" && c.status !== "pass") ||
      (filter === "pass" && c.status === "pass"),
  );
  async function share() {
    try {
      await navigator.clipboard.writeText(
        window.location.origin + BASE + "/report/" + r.id,
      );
      setCopied("Link copied");
      trackEvent(r.id, scanId, "share_copy");
    } catch {
      setCopied("Copy this URL from your address bar.");
    }
  }
  async function updateBrand(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await api("/scans", {
        method: "POST",
        body: JSON.stringify({
          website: r.website,
          brand,
          industry: r.industry,
          questionPackId: r.questionPack?.id,
          competitor: r.competitor,
        }),
      });
      onUpdate(d);
      window.history.replaceState(null, "", BASE + "/report/" + d.report.id);
      setEditBrand(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="vh-report vh-container">
      <div className="vh-report-toolbar">
        <a href={BASE}>← Check another website</a>
        <div>
          <button className="vh-button secondary" onClick={share}>
            {copied || "Copy report link"} <Icon />
          </button>
          <button
            className="vh-button secondary"
            onClick={() => window.print()}
          >
            Print / Save PDF ↓
          </button>
        </div>
      </div>
      <div className="vh-report-heading">
        <div>
          <p className="vh-eyebrow">YOUR AI SEARCH READINESS REPORT</p>
          <h1>{r.brand}</h1>
          <a
            className="vh-site-url"
            href={r.finalUrl}
            rel="noreferrer"
            target="_blank"
          >
            {r.finalUrl} <Icon />
          </a>
          <p className="vh-date">
            Checked {date(r.checkedAt)}{" "}
            {cacheHit && " · Cached scan (up to 6 hours)"}
          </p>
        </div>
        <Badge tone="mint">{r.version}</Badge>
      </div>
      <section className="vh-score-card">
        <div className="vh-score-ring" style={{ "--score": r.score } as any}>
          <div>
            <strong>{r.score}</strong>
            <span>/ 100</span>
          </div>
        </div>
        <div className="vh-score-copy">
          <Badge>GEO READINESS · RULES BASED</Badge>
          <h2>
            {r.score >= 80
              ? "A solid foundation to build on."
              : r.score >= 55
                ? "A few gaps deserve your attention."
                : "Start with the foundations."}
          </h2>
          <p>
            {issues.length} check{issues.length === 1 ? " needs" : "s need"}{" "}
            attention.{" "}
            {unknown.length ? `${unknown.length} could not be verified. ` : ""}
            This score measures website readiness, not actual AI brand
            visibility.
          </p>
          <div className="vh-coverage">
            <span>
              <i /> {r.coverage}% evidence coverage
            </span>
            <span>
              {r.checks.filter((c) => c.status === "pass").length} of{" "}
              {r.checks.length} checks passed
            </span>
          </div>
        </div>
      </section>
      <div className="vh-category-grid">
        {r.categories.map((c) => (
          <div className="vh-category" key={c.name}>
            <div>
              <h3>{c.name}</h3>
              <span>
                {Number(c.earned.toFixed(1))} / {c.verified}
                <small> pts</small>
              </span>
            </div>
            <div className="vh-bar">
              <span
                style={{
                  width: `${c.weight ? (c.earned / c.weight) * 100 : 0}%`,
                }}
              />
            </div>
            <p>
              {c.verified < c.weight
                ? `${c.weight - c.verified} points unverified`
                : `${c.weight} points available`}
            </p>
          </div>
        ))}
      </div>
      <section className="vh-report-section">
        <div className="vh-section-title">
          <div>
            <p className="vh-eyebrow">THE NEXT BEST MOVES</p>
            <h2>
              {fixes.length
                ? "Start here. Make it count."
                : "Keep the foundations healthy."}
            </h2>
          </div>
          <p>Practical actions, ordered by priority.</p>
        </div>
        <div className="vh-action-grid">
          {(fixes.length ? fixes : unknown.slice(0, 3)).map((c, i) => (
            <article className="vh-action" key={c.id}>
              <div>
                <span className="vh-action-number">0{i + 1}</span>
                <Badge tone={c.priority === "High" ? "warn" : "neutral"}>
                  {c.priority} priority
                </Badge>
              </div>
              <h3>{c.title}</h3>
              <p>{c.action}</p>
              <a href={"#check-" + c.id}>View evidence ↓</a>
            </article>
          ))}
          {!fixes.length && !unknown.length && (
            <article className="vh-action">
              <h3>Test real buyer questions.</h3>
              <p>
                Your technical foundation looks healthy in this sample. A
                repeatable model test can now measure what selected APIs
                actually say.
              </p>
              <a href="#model-tests">See the test plan ↓</a>
            </article>
          )}
        </div>
      </section>
      <section className="vh-report-section" id="checks">
        <div className="vh-section-title">
          <div>
            <p className="vh-eyebrow">THE EVIDENCE</p>
            <h2>Every check. Nothing hidden.</h2>
          </div>
          <div className="vh-filter" role="group" aria-label="Filter checks">
            {[
              ["all", "All checks"],
              ["attention", "Needs review"],
              ["pass", "Passed"],
            ].map(([v, label]) => (
              <button
                key={v}
                className={filter === v ? "active" : ""}
                onClick={() => setFilter(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="vh-checks">
          {shown.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
          {!shown.length && (
            <p className="vh-empty-state">No checks in this filter.</p>
          )}
        </div>
      </section>
      <section className="vh-report-section vh-identity">
        <div>
          <p className="vh-eyebrow">ENTITY CHECK</p>
          <h2>The brand we found.</h2>
          <p>
            Names are detected from page metadata and schema. Confirm the right
            identity before interpreting model mentions.
          </p>
          <strong>{r.brand}</strong>{" "}
          <button
            className="vh-text-button"
            onClick={() => setEditBrand(!editBrand)}
          >
            Edit brand ↗
          </button>
          {editBrand && (
            <form className="vh-inline-form" onSubmit={updateBrand}>
              <label htmlFor="edit-brand">Brand name</label>
              <input
                id="edit-brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                maxLength={100}
                required
              />
              <button className="vh-button primary" disabled={busy}>
                {busy ? "Rechecking…" : "Recheck with this brand"}
              </button>
              <ErrorBox error={error} />
            </form>
          )}
        </div>
        <div className="vh-identity-signals">
          {r.page.brandSignals.map((s) => (
            <div key={s.source}>
              <span>{s.source}</span>
              <strong>{s.name}</strong>
            </div>
          ))}
          {!r.page.brandSignals.length && (
            <p>No reliable brand signal found. Edit the brand name manually.</p>
          )}
          <div>
            <span>Industry</span>
            <strong>{r.industry || "Not specified"}</strong>
          </div>
          {r.competitor && (
            <div>
              <span>Saved competitor (not scored)</span>
              <strong>{r.competitor}</strong>
            </div>
          )}
        </div>
      </section>
      <section className="vh-report-section" id="model-tests">
        <ModelSection report={r} />
      </section>
      <LeadForm report={r} scanId={scanId} />
      <section className="vh-report-section vh-methodology">
        <p className="vh-eyebrow">SCAN NOTES</p>
        <h2>What this report can tell you.</h2>
        <p>
          One submitted page and three site files were fetched with the
          MultiHubReadiness user agent. No JavaScript rendering, full-site
          crawl, search ranking test or consumer AI session was performed.
          Crawler permission does not prove indexing or a recommendation.
          Firewall behavior may differ for real crawlers.
        </p>
        <p>
          Score = earned points ÷ verified available points × 100. Weights:
          search crawler rules 25; JSON-LD 20; metadata 15; sitemap 10; content
          extraction 10; headings 5; indexing directive 5; brand consistency 5;
          optional llms.txt 5. Unverified checks earn no points and are removed
          from the denominator. Content length and name matching are heuristics.
        </p>
        <p>
          Report {r.id} · Expires {date(r.expiresAt)}. Public by unlisted link.{" "}
          <a href={BASE + "/privacy"}>
            Privacy, method & open-source credits ↗
          </a>
        </p>
        <details>
          <summary>Fetch log and crawler rules</summary>
          <div className="vh-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>HTTP</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {r.sources.map((s) => (
                  <tr key={s.url}>
                    <td>{s.url}</td>
                    <td>{s.status ?? "—"}</td>
                    <td>
                      {s.error ||
                        `${s.bytes.toLocaleString()} bytes · ${s.contentType || "unknown type"}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Crawler / control</th>
                  <th>Purpose</th>
                  <th>Rule for scanned URL</th>
                </tr>
              </thead>
              <tbody>
                {r.bots.map((b) => (
                  <tr key={b.bot}>
                    <td>{b.bot}</td>
                    <td>{b.purpose}</td>
                    <td>{b.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
    </main>
  );
}
function CheckRow({ check: c }: { check: Check }) {
  const status = {
    pass: "Passed",
    warn: "Review",
    fail: "Fix first",
    unknown: "Unverified",
  }[c.status];
  return (
    <details
      id={"check-" + c.id}
      className={"vh-check " + c.status}
      open={c.status === "fail"}
    >
      <summary>
        <span className="vh-status-icon">
          {c.status === "pass" ? "✓" : c.status === "unknown" ? "?" : "!"}
        </span>
        <span className="vh-check-name">
          <strong>{c.title}</strong>
          <small>
            {c.category} · {c.priority} priority
          </small>
        </span>
        <Badge
          tone={
            c.status === "pass"
              ? "mint"
              : c.status === "unknown"
                ? "neutral"
                : "warn"
          }
        >
          {status}
        </Badge>
        <span className="vh-check-points">
          {c.status === "unknown" ? "—" : Number(c.earned.toFixed(1))}
          <small> / {c.weight}</small>
        </span>
        <span className="vh-expand">+</span>
      </summary>
      <div className="vh-check-detail">
        <div>
          <span>WHAT WE FOUND</span>
          <p className="vh-evidence">{c.evidence}</p>
          <a href={c.source} target="_blank" rel="noreferrer">
            Evidence URL ↗
          </a>
        </div>
        <div>
          <span>WHY IT MATTERS</span>
          <p>{c.why}</p>
          <span>YOUR NEXT STEP</span>
          <p>{c.action}</p>
        </div>
      </div>
    </details>
  );
}
function ModelSection({ report: r }: { report: Report }) {
  return (
    <div className="vh-model">
      <div className="vh-model-top">
        <div>
          <p className="vh-eyebrow">A SEPARATE MEASUREMENT</p>
          <h2>Does AI actually mention you?</h2>
        </div>
        <Badge tone={r.visibility.runs.length ? "mint" : "neutral"}>
          {r.visibility.runs.length ? "API sample recorded" : "Not tested"}
        </Badge>
      </div>
      <p>{r.visibility.note}</p>
      {!r.visibility.runs.length && (
        <div className="vh-model-notice">
          <span>○</span>
          <div>
            <strong>Live AI visibility is not enabled for free scans.</strong>
            <p>
              Model tests require server API keys, an administrator and a daily
              call budget. No sample answers are presented as real results.
            </p>
          </div>
        </div>
      )}
      <details>
        <summary>View your reusable buyer-question test plan ↓</summary>
        {r.questionPack ? (
          <QuestionPlan pack={r.questionPack} />
        ) : (
          <>
            <ol>
              {r.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
            <p>
              Legacy templates, not executed tests.{" "}
              <a href={BASE + "/questions"}>
                Build a current industry question pack ↗
              </a>
            </p>
          </>
        )}
      </details>
      {r.visibility.runs.map((run) => (
        <details className="vh-model-run" key={run.id}>
          <summary>
            {run.provider} · {run.model}{" "}
            <Badge>
              {run.mentioned
                ? run.ambiguous
                  ? "Mention needs review"
                  : "Text mention detected"
                : "No text mention detected"}
            </Badge>
          </summary>
          <p>
            <strong>Question:</strong> {run.question}
          </p>
          <p>
            {run.questionKind ?? "Unclassified"} · {date(run.checkedAt)} ·{" "}
            {run.mode} · {run.conditions.surface} · Region:{" "}
            {run.conditions.region}
          </p>
          <pre>{run.answer}</pre>
          <p>
            <strong>Competitor text matches:</strong>{" "}
            {run.competitors.join(", ") || "None detected"}. A mention is not a
            recommendation.
          </p>
          <ul>
            {run.citations.map((u, i) => (
              <li key={i}>
                <a href={u} rel="noreferrer" target="_blank">
                  {u}
                </a>
              </li>
            ))}
          </ul>
          <details>
            <summary>Provider response JSON</summary>
            <pre>{JSON.stringify(run.rawResponse, null, 2)}</pre>
          </details>
        </details>
      ))}
    </div>
  );
}
function LeadForm({ report: r, scanId }: { report: Report; scanId: string }) {
  const [offerId, setOfferId] = useState<string>(DEFAULT_AUDIT_OFFER),
    [email, setEmail] = useState(""),
    [needs, setNeeds] = useState(""),
    [consent, setConsent] = useState(false),
    [marketing, setMarketing] = useState(false),
    [trap, setTrap] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [saved, setSaved] = useState<{ id: string; deleteToken: string } | null>(
      null,
    ),
    [copy, setCopy] = useState("");
  const deletionUrl = saved
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${BASE}/delete#id=${saved.id}&token=${saved.deleteToken}`
    : "";
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const p = new URLSearchParams(window.location.search);
      setSaved(
        await api("/leads", {
          method: "POST",
          body: JSON.stringify({
            reportId: r.id,
            scanId,
            email,
            needs,
            contactConsent: consent,
            marketingConsent: marketing,
            offerId,
            website_extra: trap,
            ref: p.get("ref") || "",
          }),
        }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="vh-lead" id="audit">
      <div>
        <p className="vh-eyebrow">TURN THE FINDINGS INTO A PLAN</p>
        <h2>
          Get a Detailed
          <br />
          AI Visibility Audit.
        </h2>
        <p>
          Tell us what you’re building and who you want to reach. MultiHub can
          review buyer questions, verify real model answers and scope the fixes
          that matter to your business.
        </p>
        <a
          className="vh-button secondary"
          href="#audit-form"
          onClick={() => trackEvent(r.id, scanId, "audit_cta")}
        >
          Review audit scope ↗
        </a>
        <ul>
          <li>
            <Icon kind="check" /> A focused review of your goals
          </li>
          <li>
            <Icon kind="check" /> Clear scope before any paid work
          </li>
          <li>
            <Icon kind="check" /> No automatic subscription
          </li>
        </ul>
      </div>
      {saved ? (
        <div className="vh-lead-success" role="status">
          <span>✓</span>
          <h3>Your request is saved.</h3>
          <p>
            MultiHub will review your needs and may reply about this audit. This
            form does not send an automated email.
          </p>
          <p>
            Keep your private deletion link to remove your contact details at
            any time. This link contains a secret token; do not share it.
          </p>
          <button
            className="vh-button primary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(deletionUrl);
                setCopy("Private link copied");
              } catch {
                setCopy(deletionUrl);
              }
            }}
          >
            {copy || "Copy private deletion link"}
          </button>
          <a href={deletionUrl}>Manage / delete this request ↗</a>
        </div>
      ) : (
        <form onSubmit={submit} id="audit-form">
          <fieldset className="vh-offers">
            <legend>Choose an initial scope</legend>
            {auditOffers.map((o) => (
              <label
                key={o.id}
                className={"vh-offer " + (offerId === o.id ? "selected" : "")}
              >
                <input
                  type="radio"
                  name="audit-offer"
                  value={o.id}
                  checked={offerId === o.id}
                  onChange={() => {
                    setOfferId(o.id);
                    trackEvent(r.id, scanId, "audit_cta");
                  }}
                />
                <span>
                  <strong>{o.name}</strong>
                  <b>
                    {o.price} {o.currency}
                  </b>
                  <small>{o.summary}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <div className="vh-offer-scope">
            <ul>
              {findOffer(offerId)?.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p>{findOffer(offerId)?.exclusions}</p>
            <strong>
              This form requests a scope review. No payment is collected.
            </strong>
          </div>

          <label htmlFor="lead-email">Work email</label>
          <input
            id="lead-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
          />
          <label htmlFor="lead-needs">What would you like to improve?</label>
          <textarea
            id="lead-needs"
            rows={3}
            required
            placeholder="Your product, target buyers and biggest question…"
            value={needs}
            onChange={(e) => setNeeds(e.target.value)}
            maxLength={2000}
          />
          <div className="vh-honeypot" aria-hidden="true">
            <label>
              Leave empty
              <input
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />
            </label>
          </div>
          <label className="vh-checkbox">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              I agree that MultiHub may use my email and request to reply about
              this audit. Contact data is retained for up to 90 days.{" "}
              <a href={BASE + "/privacy"}>Privacy details</a>
            </span>
          </label>
          <label className="vh-checkbox">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
            />
            <span>
              Optional: send me occasional AI search insights. Unchecked by
              default.
            </span>
          </label>
          <button type="submit" className="vh-button primary" disabled={busy}>
            {busy ? "Saving request…" : "Request My Detailed Audit"} <Icon />
          </button>
          <ErrorBox error={error} />
          <small>
            Your free report remains available without submitting this form.
          </small>
        </form>
      )}
    </section>
  );
}
function Admin() {
  const [token, setToken] = useState(""),
    [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [reportId, setReportId] = useState(""),
    [question, setQuestion] = useState(""),
    [provider, setProvider] = useState("openai"),
    [message, setMessage] = useState(""),
    [includeContacts, setIncludeContacts] = useState(false),
    [testPack, setTestPack] = useState<QuestionPack | null>(null);
  async function load(e?: FormEvent) {
    e?.preventDefault();
    setError("");
    setBusy(true);
    try {
      setData(
        await api("/admin", { headers: { authorization: "Bearer " + token } }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function status(kind: string, id: string, value: string) {
    try {
      await api(`/admin/${kind}/${id}`, {
        method: "PATCH",
        headers: { authorization: "Bearer " + token },
        body: JSON.stringify({ status: value }),
      });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function exportLead(id: string) {
    setError("");
    try {
      const d = await api(
        `/admin/leads/${id}/handoff${includeContacts ? "?contacts=1" : ""}`,
        { headers: { authorization: "Bearer " + token } },
      );
      downloadText(
        JSON.stringify(d, null, 2),
        `multihub-private-${id}.json`,
        "application/json",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function loadPlan() {
    try {
      const d = await api("/reports/" + reportId);
      setTestPack(d.report.questionPack ?? null);
      if (!d.report.questionPack)
        setMessage(
          "This legacy report has no versioned pack. Use the question library or enter a custom question.",
        );
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function modelTest(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      await api(`/admin/reports/${reportId}/model-test`, {
        method: "POST",
        headers: { authorization: "Bearer " + token },
        body: JSON.stringify({ provider, question }),
      });
      setMessage("Real API answer saved. Open the report to inspect it.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="vh-container vh-admin">
      <p className="vh-eyebrow">PRIVATE OPERATIONS</p>
      <h1>Visibility workspace.</h1>
      <p>
        Administrator access is required. The token stays in this tab’s memory
        and is never stored in browser storage.
      </p>
      <form className="vh-admin-login" onSubmit={load}>
        <label htmlFor="admin-token">Administrator token</label>
        <div>
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            autoComplete="off"
          />
          <button className="vh-button primary" disabled={busy}>
            Open workspace
          </button>
        </div>
      </form>
      <ErrorBox error={error} />
      {data && (
        <>
          <section className="vh-model">
            <h2>Source activity · last 30 days</h2>
            <p>{data.funnel.note}</p>
            <div className="vh-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Source / referral</th>
                    <th>Scans</th>
                    <th>Report opens</th>
                    <th>Audit interest</th>
                    <th>Link copies</th>
                    <th>Requests</th>
                    <th>Qualified</th>
                  </tr>
                </thead>
                <tbody>
                  {data.funnel.rows.map((f: any) => (
                    <tr key={f.source + ":" + f.ref}>
                      <td>
                        {f.source}
                        <br />
                        {f.ref || "No referral"}
                      </td>
                      <td>{f.scans}</td>
                      <td>{f.report_views}</td>
                      <td>{f.audit_ctas}</td>
                      <td>{f.shares}</td>
                      <td>{f.requests}</td>
                      <td>{f.qualified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!data.funnel.rows.length && <p>No retained activity yet.</p>}
            </div>
            <p>
              Paid conversions: <strong>Not connected</strong>. A request or
              qualified status is not a verified payment.
            </p>
          </section>
          <section className="vh-model">
            <h2>Private review handoff</h2>
            <p>
              Download one request for Prospect OS / Case Engine review. No
              external import or outreach runs automatically. Files are private
              observations, not publishable results cases. Delete downloaded
              copies by their stated expiry, or earlier after a deletion
              request.
            </p>
            <label className="vh-checkbox">
              <input
                type="checkbox"
                checked={includeContacts}
                onChange={(e) => setIncludeContacts(e.target.checked)}
              />
              <span>
                Include the submitted email and consent fields in private
                exports
              </span>
            </label>
          </section>
          <div className="vh-admin-heading">
            <h2>
              Audit requests <Badge>{data.leads.length}</Badge>
            </h2>
            <button
              className="vh-button secondary"
              onClick={() => {
                setData(null);
                setToken("");
              }}
            >
              Lock workspace
            </button>
          </div>
          <div className="vh-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Brand / website</th>
                  <th>Contact / need</th>
                  <th>Source</th>
                  <th>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((l: any) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.brand}</strong>
                      <br />
                      {l.website}
                      <br />
                      {l.report_id && (
                        <a href={BASE + "/report/" + l.report_id}>
                          Open report ↗
                        </a>
                      )}
                    </td>
                    <td>
                      {l.email}
                      <p>{l.needs}</p>
                      <small>
                        Scope:{" "}
                        {findOffer(l.offer_id)?.name ?? "Custom / legacy"}
                      </small>
                      <br />
                      <button
                        className="vh-text-button"
                        onClick={() => exportLead(l.id)}
                      >
                        Download private handoff ↓
                      </button>
                      <small>
                        Marketing consent: {l.marketing_consent ? "Yes" : "No"}
                        <br />
                        Expires {date(new Date(l.expires_at).toISOString())}
                      </small>
                    </td>
                    <td>
                      {l.source}
                      <br />
                      {l.ref || "No referral"}
                    </td>
                    <td>
                      <select
                        value={l.status}
                        onChange={(e) => status("leads", l.id, e.target.value)}
                      >
                        {[
                          "new",
                          "reviewing",
                          "contacted",
                          "qualified",
                          "closed",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.leads.length && (
              <p className="vh-empty-state">No audit requests yet.</p>
            )}
          </div>
          <h2>Recent scans</h2>
          <div className="vh-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Brand / industry</th>
                  <th>Website / date</th>
                  <th>Attribution</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.scans.map((s: any) => (
                  <tr key={s.id}>
                    <td>
                      {s.brand}
                      <br />
                      <small>{s.industry}</small>
                    </td>
                    <td>
                      {s.website}
                      <br />
                      <small>
                        {date(new Date(s.created_at).toISOString())}
                      </small>
                      <br />
                      {s.report_id && (
                        <a href={BASE + "/report/" + s.report_id}>Report ↗</a>
                      )}
                    </td>
                    <td>
                      {s.source}
                      <br />
                      {s.ref || "direct"}
                    </td>
                    <td>
                      <select
                        value={s.status}
                        onChange={(e) => status("scans", s.id, e.target.value)}
                      >
                        {[
                          "new",
                          "reviewing",
                          "contacted",
                          "qualified",
                          "closed",
                        ].map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.scans.length && (
              <p className="vh-empty-state">No scans yet.</p>
            )}
          </div>
          <section className="vh-model">
            <h2>Run one real model test</h2>
            <p>
              Enabled: {data.ai.enabled ? "Yes" : "No"} · Configured providers:{" "}
              {data.ai.providers.join(", ") || "None"}. Each action uses one
              reserved call. Failed attempts count. There are no automatic
              retries.
            </p>
            <form onSubmit={modelTest}>
              <label htmlFor="model-report">Report ID</label>
              <input
                id="model-report"
                value={reportId}
                onChange={(e) => {
                  setReportId(e.target.value);
                  setTestPack(null);
                }}
                required
              />
              <button
                type="button"
                className="vh-button secondary"
                onClick={loadPlan}
                disabled={!reportId}
              >
                Load report question pack
              </button>
              {testPack && (
                <>
                  <label htmlFor="model-template">Planned question</label>
                  <select
                    id="model-template"
                    value={
                      testPack.questions.find((q) => q.question === question)
                        ?.id ?? ""
                    }
                    onChange={(e) =>
                      setQuestion(
                        testPack.questions.find((q) => q.id === e.target.value)
                          ?.question ?? "",
                      )
                    }
                  >
                    <option value="">
                      Custom question / choose a template
                    </option>
                    {testPack.questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.kind}: {q.intent}
                      </option>
                    ))}
                  </select>
                  <small>
                    {testPack.version}. Loading this plan makes no model call.
                  </small>
                </>
              )}
              <label htmlFor="model-provider">Provider</label>
              <select
                id="model-provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="openai">OpenAI API (parametric)</option>
                <option value="gemini">Gemini API (parametric)</option>
                <option value="perplexity">
                  Perplexity Sonar API (grounded)
                </option>
              </select>
              <label htmlFor="model-question">Buyer question</label>
              <textarea
                id="model-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                minLength={15}
                maxLength={500}
              />
              <button
                className="vh-button primary"
                disabled={busy || !data.ai.enabled || !data.ai.providers.length}
              >
                Run API test & save answer
              </button>
              <p role="status">{message}</p>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
function DeleteRequest() {
  const [id, setId] = useState(""),
    [token, setToken] = useState(""),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.hash.slice(1));
    setId(p.get("id") || "");
    setToken(p.get("token") || "");
    window.history.replaceState(null, "", BASE + "/delete");
  }, []);
  return (
    <main className="vh-container vh-prose">
      <p className="vh-eyebrow">YOUR DATA, YOUR CHOICE</p>
      <h1>Delete an audit request.</h1>
      <p>
        This removes the contact details, requirements and consent record for
        this request. The public website report expires independently after 30
        days.
      </p>
      <button
        className="vh-button primary"
        disabled={!id || !token || Boolean(message)}
        onClick={async () => {
          try {
            await api("/leads/" + id, {
              method: "DELETE",
              headers: { "x-deletion-token": token },
            });
            setMessage(
              "Your audit request and contact information have been deleted.",
            );
            setToken("");
          } catch (e) {
            setError((e as Error).message);
          }
        }}
      >
        Delete my contact information
      </button>
      <p role="status">{message}</p>
      <ErrorBox error={error} />
      {!id && (
        <p>
          Open your private deletion link from the confirmation screen after
          submitting an audit request.
        </p>
      )}
    </main>
  );
}
function Privacy() {
  return (
    <main className="vh-container vh-prose">
      <p className="vh-eyebrow">TRANSPARENT BY DESIGN</p>
      <h1>
        Privacy, method
        <br />& limitations.
      </h1>
      <p>
        MultiHub Visibility Lab helps small teams inspect website readiness for
        AI search. Last updated 18 October 2026.
      </p>
      <h2>What is measured</h2>
      <p>
        The submitted page is fetched as HTML, followed by robots.txt,
        sitemap.xml and llms.txt on its final origin. Nine deterministic checks
        make up the readiness score. This is one page, not a comprehensive
        crawl, security review or ranking predictor.
      </p>
      <p>
        Weights: search crawler rules 25; JSON-LD 20; metadata 15; sitemap 10;
        extractable content 10; headings 5; HTML indexing directive 5; brand
        consistency 5; optional llms.txt 5. Each check exposes its points and
        evidence. Unknown checks are excluded from the denominator; coverage
        shows how much of the 100 available points was verified.
      </p>
      <p>
        Training crawlers are shown separately and do not affect search access
        points. llms.txt is an optional emerging convention. Word count and
        brand matching are heuristics. Valid JSON is not proof of Schema.org
        semantic correctness. Crawl permission does not prove indexing or actual
        crawler access.
      </p>
      <h2>Real model tests</h2>
      <p>
        The free scan uses no model APIs. Optional tests require server-side API
        keys, administrator authorization, explicit enablement and a daily call
        cap. Each recorded answer includes the question, actual model
        identifier, timestamp, raw provider response and any returned citations.
        OpenAI and Gemini tests use parametric API answers; Perplexity Sonar
        uses its grounded API. These APIs do not reproduce a personalized
        consumer app session. A text mention is not necessarily a
        recommendation. Failed or disabled tests never produce synthetic
        results.
      </p>
      <h2>Reports and data retention</h2>
      <p>
        Reports are unlisted, accessible to anyone with their random link and
        retained for 30 days. They contain public website metadata and evidence;
        do not scan confidential URLs or place personal information in the brand
        or industry fields. Results may be reused from a six-hour cache.
      </p>
      <p>
        Scan records include website, brand, industry, report ID, time, optional
        referral, source and follow-up status. They expire after 90 days.
        Referral values accept letters, numbers, underscores and hyphens; no
        cross-site tracking cookie is used. This tab may keep a report-to-scan
        ID in session storage for attribution; it contains no contact data.
        Report opens, audit-interest clicks and successful share-link copies are
        counted once per originating scan and expire with its report (at most 30
        days). Shared report views without an originating scan ID are excluded.
        These activity counts do not prove identity or payment. Abuse limits use
        salted IP hashes in short-lived buckets, not raw IP addresses in report
        records.
      </p>
      <p>
        If you request an audit, we store the email, requirements, consent,
        selected audit scope, source and follow-up status for up to 90 days so
        MultiHub can review and respond. Contact consent and optional marketing
        consent are separate; neither is selected by default. Contact data is
        kept in a separate table, protected by server-side admin authorization
        and excluded from public reports. This MVP does not send automated email
        or marketing campaigns.
      </p>
      <p>
        After submitting a request, save the private deletion link to delete
        that request at any time. Deletion tokens are hashed server-side; the
        token travels in the URL fragment and is removed from the address bar
        when the deletion page opens. Never share the private link. For other
        deletion requests, contact MultiHub through{" "}
        <a href="https://molthub.click/#contact">the main site</a> and provide
        the request or report ID.
      </p>
      <p>
        Expired records are inaccessible immediately and physically removed in
        bounded batches as the API is used and when an administrator opens the
        workspace. This deployment has no scheduled purge; low traffic may delay
        physical removal. Infrastructure providers may maintain operational logs
        and backups under their own policies.
      </p>
      <h2>Safety and fair use</h2>
      <p>
        Only standard public HTTP and HTTPS websites are allowed. IP literals,
        local names, private and reserved DNS results, unsafe redirects, large
        responses and long-running requests are blocked. Public DNS is checked
        before each destination is fetched; Cloudflare’s outbound network
        restrictions provide a second boundary. We do not claim this is a full
        security scanner.
      </p>
      <p>
        Free scans have per-IP, per-domain and global daily limits. Paid model
        tests are administrator-only, capped at 1,600 output tokens per call and
        at most 30 reserved calls per day. Failed requests count and are not
        automatically retried. Provider-side spending limits should also be
        configured.
      </p>
      <h2>Open-source credits</h2>
      <p>
        The primary engine is adapted from{" "}
        <a href="https://github.com/optifeed/optifeed-radar/tree/2e0af8990de6914eefe4665bfe98f5d5c5e9e81b">
          Optifeed Radar v0.3.0
        </a>
        , MIT © 2026 Optifeed. Reused modules include deterministic audit
        scoring, HTML extraction, Unicode mention matching and provider response
        adapters. MultiHub adds its published readiness weights, evidence
        states, secure fetching, persistence and product interface. The upstream
        LICENSE is preserved in the source.
      </p>
      <p>
        HTML parsing uses Cheerio (MIT), robots rules use robots-parser (MIT),
        and address validation uses ipaddr.js (MIT). The app uses the existing
        MultiHub React / Vinext / Cloudflare stack. No code from geoscore was
        copied because its reviewed revision had no LICENSE file.
      </p>
      <a className="vh-button primary" href={BASE}>
        Check my website <Icon />
      </a>
    </main>
  );
}
