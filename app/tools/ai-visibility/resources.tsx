"use client";
import { useEffect, useState } from "react";
import {
  createQuestionPack,
  questionPackOptions,
  questionCsv,
  type QuestionPack,
} from "../../../lib/visibility/questions";
const BASE = "/tools/ai-visibility";
export function downloadText(text: string, name: string, type = "text/plain") {
  const u = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
export function QuestionPlan({ pack }: { pack: QuestionPack }) {
  const [message, setMessage] = useState("");
  return (
    <div className="vh-question-plan">
      <div className="vh-resource-actions">
        <span className="vh-badge">Templates · not executed</span>
        <button
          className="vh-button secondary"
          onClick={() =>
            downloadText(
              questionCsv(pack),
              `multihub-${pack.id}-questions.csv`,
              "text/csv;charset=utf-8",
            )
          }
        >
          Download CSV ↓
        </button>
        <button
          className="vh-text-button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                pack.questions
                  .map((q) => `[${q.kind}] ${q.question}`)
                  .join("\n\n"),
              );
              setMessage("Questions copied");
            } catch {
              setMessage("Clipboard unavailable. Download the CSV instead.");
            }
          }}
        >
          Copy questions
        </button>
      </div>
      <p>{pack.note}</p>
      <ol>
        {pack.questions.map((q) => (
          <li key={q.id}>
            <span className="vh-badge">
              {q.kind === "discovery"
                ? "Unbranded discovery"
                : "Branded fact check"}
            </span>
            <p>{q.question}</p>
          </li>
        ))}
      </ol>
      <small>
        English · {pack.version} · Review the category and audience before
        testing. Branded fact checks measure accuracy, not spontaneous
        discovery.
      </small>
      <p role="status">{message}</p>
    </div>
  );
}
export function QuestionLibrary() {
  const [id, setId] = useState("ai-saas"),
    [industry, setIndustry] = useState(""),
    [brand, setBrand] = useState("");
  const pack = createQuestionPack(industry, brand, id);
  return (
    <main className="vh-container vh-resource">
      <a href={BASE}>← Free website checker</a>
      <p className="vh-eyebrow">PLAN A FAIR TEST</p>
      <h1>Ask what your buyers ask.</h1>
      <p className="vh-intro">
        Five unbranded buying questions. Two brand fact checks.
        <br />A reusable starting point for your next real AI visibility test.
      </p>
      <div className="vh-resource-grid">
        <section className="vh-resource-card">
          <label htmlFor="pack">Industry question pack</label>
          <select
            id="pack"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIndustry("");
            }}
          >
            {questionPackOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <label htmlFor="category">Your product category</label>
          <input
            id="category"
            maxLength={100}
            value={industry}
            placeholder={questionPackOptions.find((p) => p.id === id)?.category}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <label htmlFor="question-brand">Brand for fact checks</label>
          <input
            id="question-brand"
            maxLength={100}
            value={brand}
            placeholder="Your brand"
            onChange={(e) => setBrand(e.target.value)}
          />
          <p>
            No model is called here. These templates do not establish
            visibility, rankings or recommendations.
          </p>
          <a className="vh-button primary" href={BASE + "?pack=" + pack.id}>
            Check my website with this pack ↗
          </a>
        </section>
        <section className="vh-resource-card">
          <h2>{pack.label}</h2>
          <QuestionPlan pack={pack} />
        </section>
      </div>
      <section className="vh-model">
        <h2>Keep the comparison honest.</h2>
        <p>
          Fix the question set before testing. Use the same model, surface,
          language, location and date window for each brand. Save actual answers
          and sources. Repeat observations before drawing conclusions; a single
          answer is not a stable ranking.
        </p>
      </section>
    </main>
  );
}
export function PartnerResources() {
  const [code, setCode] = useState(""),
    [origin, setOrigin] = useState(""),
    [message, setMessage] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && /^[a-zA-Z0-9_-]{1,64}$/.test(ref)) setCode(ref);
  }, []);
  const valid = /^[a-zA-Z0-9_-]{1,64}$/.test(code),
    link =
      valid && origin
        ? `${origin}${BASE}?ref=${encodeURIComponent(code)}&utm_source=partner`
        : "";
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied. Ready to share.");
    } catch {
      setMessage("Clipboard unavailable. Select and copy the link below.");
    }
  }
  return (
    <main className="vh-container vh-resource">
      <a href={BASE}>← Free website checker</a>
      <p className="vh-eyebrow">A USEFUL FIRST CONVERSATION</p>
      <h1>Give your audience a clear starting point.</h1>
      <p className="vh-intro">
        Share a free website readiness check with your clients or community.
        <br />
        They get evidence and next steps, without a signup wall.
      </p>
      <div className="vh-resource-grid">
        <section className="vh-resource-card">
          <h2>Create your partner link.</h2>
          <label htmlFor="partner-code">Referral code</label>
          <input
            id="partner-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={64}
            placeholder="e.g. agency_north"
            aria-describedby="partner-help"
          />
          <small id="partner-help">
            1–64 letters, numbers, underscores or hyphens. Use a business code,
            never an email or personal information.
          </small>
          {code && !valid && (
            <p role="alert">
              Use only letters, numbers, underscores or hyphens.
            </p>
          )}
          <label htmlFor="partner-link">Your share link</label>
          <textarea
            id="partner-link"
            readOnly
            value={link}
            placeholder="Enter a valid code above"
          />
          <div className="vh-resource-actions">
            <button
              disabled={!link}
              className="vh-button primary"
              onClick={() => copy(link)}
            >
              Copy link ↗
            </button>
            <button
              disabled={!link}
              className="vh-button secondary"
              onClick={() =>
                copy(
                  `<a href="${link.replaceAll("&", "&amp;")}" rel="noopener" target="_blank">Check your AI search readiness — free with MultiHub</a>`,
                )
              }
            >
              Copy website embed
            </button>
            <button
              disabled={!link}
              className="vh-text-button"
              onClick={() =>
                downloadText(
                  shareCard(),
                  "multihub-free-checker.svg",
                  "image/svg+xml",
                )
              }
            >
              Download share card ↓
            </button>
          </div>
          <p role="status">{message}</p>
          <p>
            The share card is a generic invitation. Add your referral link when
            posting it.
          </p>
        </section>
        <section className="vh-resource-card vh-partner-preview">
          <span className="vh-badge mint">FREE · NO SIGNUP</span>
          <p className="vh-eyebrow">MULTIHUB / VISIBILITY LAB</p>
          <h2>
            Built to be found.
            <br />
            Ready for AI search?
          </h2>
          <p>
            Check crawl access, structured data and content readiness. See the
            evidence. Know what to fix.
          </p>
          <strong>Check My Website — Free ↗</strong>
        </section>
      </div>
      <section className="vh-model">
        <h2>Clear expectations, from the first click.</h2>
        <p>
          Referral codes label the source of scans and voluntary audit requests.
          They do not prove identity, reserve a partner name or establish a
          commission agreement. No cross-site tracking cookie is used. Do not
          claim guaranteed AI mentions or imply that technical readiness
          measures actual ChatGPT, Gemini or Perplexity recommendations.
        </p>
        <p>
          Partner reporting is private to MultiHub administrators. We do not
          expose client contacts or publish a partner leaderboard.
        </p>
      </section>
    </main>
  );
}
function shareCard() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0c1728"/><text x="80" y="100" fill="#b9f36c" font-family="Arial,sans-serif" font-size="25">MULTIHUB / VISIBILITY LAB</text><text x="80" y="235" fill="white" font-family="Arial,sans-serif" font-size="62" font-weight="bold">Built to be found.</text><text x="80" y="315" fill="#b9f36c" font-family="Arial,sans-serif" font-size="62" font-weight="bold">Ready for AI search?</text><text x="80" y="395" fill="#c4d0df" font-family="Arial,sans-serif" font-size="25">A free website readiness report. Real checks. Clear next steps.</text><rect x="80" y="470" width="570" height="70" rx="12" fill="#b9f36c"/><text x="105" y="516" fill="#0c1728" font-family="Arial,sans-serif" font-size="27" font-weight="bold">Check My Website — Free</text><text x="80" y="595" fill="#c4d0df" font-family="Arial,sans-serif" font-size="20">Technical readiness. Actual AI mentions require a separate test.</text></svg>`;
}
