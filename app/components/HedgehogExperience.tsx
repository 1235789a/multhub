"use client";

import { useEffect, useState } from "react";
import { compareSnapshots, type HedgehogSnapshot } from "../lib/hedgehog";
import { hedgehogGraphic, posterSvg } from "../lib/hedgehog-svg";
import { trackProductEvent } from "../lib/product-events";

type ScanResult = HedgehogSnapshot & {
  verdict: string;
  prompts: string[];
  actions: string[];
  usage: { used: number; limit: number } | null;
  shareGrant: { id: string; key: string } | null;
};

type Props = {
  result: ScanResult;
  previous: HedgehogSnapshot | null;
};

function shareText(result: ScanResult, publicUrl: string) {
  const pass = result.signals.filter((signal) => signal.checked !== false && signal.passed).length;
  const checked = result.signals.filter((signal) => signal.checked !== false).length;
  return "My website got " + result.hedgehog.title + " 🦔\n" +
    result.hedgehog.line + "\n" +
    pass + "/" + checked + " technical homepage checks passed (not AI mentions).\n" +
    "What's your hedgehog? " + (publicUrl || "https://molthub.click/#free-scan");
}

export function HedgehogExperience({ result, previous }: Props) {
  const [tab, setTab] = useState<"fun" | "professional">("fun");
  const [reveal, setReveal] = useState(false);
  const [format, setFormat] = useState<"landscape" | "portrait">("landscape");
  const [showIdentity, setShowIdentity] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setReveal(false);
    setPublicUrl("");
    setError("");
    setTab("fun");
    const skipMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skipMotion) {
      setReveal(true);
      return;
    }
    const timer = window.setTimeout(() => setReveal(true), 2500);
    return () => window.clearTimeout(timer);
  }, [result.snapshotId]);

  const passing = result.signals.filter((s) => s.checked !== false && s.passed).length;
  const measured = result.signals.filter((s) => s.checked !== false).length;
  const comparison = previous ? compareSnapshots(previous, result) : null;
  const imageUrl = "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(hedgehogGraphic(result.hedgehog.kind));
  const image = posterSvg(result, format, showIdentity, publicUrl);
  const previewSrc = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(image);
  const shareMessage = shareText(result, publicUrl);

  function track(name: string, extra: Record<string, unknown> = {}) {
    void trackProductEvent(name, {
      kind: result.hedgehog.kind,
      snapshotId: result.snapshotId,
      reportId: result.shareGrant?.id,
      ...extra,
    });
  }

  async function downloadPng() {
    setDownloading(true);
    setError("");
    try {
      const svgBlob = new Blob([image], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      try {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Could not render the poster."));
          img.src = url;
        });
        const canvas = document.createElement("canvas");
        canvas.width = format === "landscape" ? 1200 : 1080;
        canvas.height = format === "landscape" ? 675 : 1350;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("PNG export is not available in this browser.");
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        const png = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!png) throw new Error("PNG export failed.");
        const fileUrl = URL.createObjectURL(png);
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.download = "hedgehog-" + result.hedgehog.kind + "-" + format + ".png";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        track("hedgehog_poster_download", { format });
        window.setTimeout(() => URL.revokeObjectURL(fileUrl), 2000);
        setInfo("PNG downloaded. Attach the image to your X post manually.");
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download PNG.");
    } finally {
      setDownloading(false);
    }
  }

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(shareMessage);
      track("hedgehog_post_copied");
      setInfo("Caption copied. Add the downloaded PNG in X to share an image.");
      setError("");
    } catch {
      setError("Clipboard access was denied. You can select and copy the caption below.");
    }
  }

  async function publishLink() {
    if (!result.shareGrant) {
      setError("Public sharing needs Supabase storage and the Hedgehog migration. PNG and caption still work.");
      return;
    }
    setPublishing(true);
    setError("");
    try {
      const response = await fetch("/api/hedgehog/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: result.shareGrant.id,
          key: result.shareGrant.key,
          showIdentity,
        }),
      });
      const payload = await response.json() as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error || "Could not publish.");
      const absolute = new URL(payload.url, window.location.origin).href;
      setPublicUrl(absolute + "?utm_source=x&utm_medium=social&utm_campaign=hedgehog_lab");
      setInfo("Public link is live. Website identity " + (showIdentity ? "is visible." : "is hidden."));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish the link.");
    } finally {
      setPublishing(false);
    }
  }

  function shareOnX() {
    track("hedgehog_share_intent_clicked", { linkPublished: Boolean(publicUrl) });
    if (!publicUrl) {
      setError("First choose 'Create public link'. This requires your explicit consent.");
      return;
    }
    const intent = "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(shareText(result, "" ).replace(/https:\/\/molthub\.click\/#free-scan$/, "").trim()) +
      "&url=" + encodeURIComponent(publicUrl);
    window.open(intent, "_blank", "noopener,noreferrer");
    setInfo("X opens with text and link only. Attach your downloaded PNG manually; posting is not automatically confirmed.");
  }

  return (
    <section className="hedgehog-lab" aria-label="Your Hedgehog Lab result">
      <div className="hedgehog-tabs" role="tablist" aria-label="Result type">
        <button type="button" role="tab" aria-selected={tab === "fun"} onClick={() => setTab("fun")}>🦔 Fun Result</button>
        <button type="button" role="tab" aria-selected={tab === "professional"} onClick={() => setTab("professional")}>Professional Report</button>
      </div>
      {tab === "fun" ? (
        <div className="hedgehog-panel">
          {!reveal ? (
            <div className="hedgehog-reveal" role="status" aria-live="polite">
              <div className="hedgehog-reveal__spinner">🦔</div>
              <p>Scanning your hedgehog's spikes…</p>
              <button type="button" onClick={() => setReveal(true)}>Skip reveal →</button>
            </div>
          ) : (
            <>
              <div className="hedgehog-hero">
                <div>
                  <p className="hedgehog-eyebrow">YOUR HEDGEHOG HAS EVOLVED</p>
                  <h2>{result.hedgehog.title}</h2>
                  <p className="hedgehog-subtitle">{result.hedgehog.line}</p>
                  <p>{result.hedgehog.reason}</p>
                  <p className="hedgehog-metrics">{passing} / {measured} measurable homepage checks passed · {result.scannedAt.slice(0, 10)}</p>
                </div>
                <img src={imageUrl} alt={result.hedgehog.title + " original art"} />
              </div>
              <div className="hedgehog-poster">
                <div className="hedgehog-poster__heading">
                  <div><h3>Your share poster</h3><p>Original vector art. No AI image generation or made-up recommendation stats.</p></div>
                  <div className="hedgehog-formats" aria-label="Poster dimensions">
                    <button type="button" aria-pressed={format === "landscape"} onClick={() => setFormat("landscape")}>X · 1200×675</button>
                    <button type="button" aria-pressed={format === "portrait"} onClick={() => setFormat("portrait")}>Vertical · 1080×1350</button>
                  </div>
                </div>
                <img className="hedgehog-poster__preview" src={previewSrc} alt={"Share poster for " + result.hedgehog.title} />
                <label className="hedgehog-privacy">
                  <input type="checkbox" checked={showIdentity} onChange={(event) => { setShowIdentity(event.target.checked); if (publicUrl) setInfo("Update the public link to apply your new visibility preference."); }} />
                  Show my brand name and website in the poster and public report (off by default)
                </label>
                <div className="hedgehog-actions">
                  <button type="button" className="button button--gold" onClick={downloadPng} disabled={downloading}>{downloading ? "Exporting…" : "Download PNG"}</button>
                  <button type="button" className="button button--secondary" onClick={copyPost}>Copy Post</button>
                  <button type="button" className="button button--secondary" onClick={shareOnX}>Share on X ↗</button>
                </div>
                <div className="hedgehog-public-toggle">
                  <p>Public sharing is optional. Only publish if you agree to make this result accessible to anyone with the link.</p>
                  <button type="button" onClick={publishLink} disabled={publishing}>{publishing ? "Publishing…" : publicUrl ? "Update public link" : "Create public link (opt in)"}</button>
                  {publicUrl ? <a href={publicUrl} target="_blank" rel="noreferrer">Open public hedgehog page ↗</a> : null}
                </div>
                <details className="hedgehog-caption"><summary>Preview your X caption</summary><pre>{shareMessage}</pre></details>
                {error ? <p className="hedgehog-error" role="alert">{error}</p> : null}
                {info ? <p className="hedgehog-info" role="status">{info}</p> : null}
              </div>
              <div className="hedgehog-evolution">
                <h3>Your hedgehog's evolution</h3>
                {comparison ? (
                  <>
                    <p>{comparison.before.slice(0, 10)} → {comparison.after.slice(0, 10)} · {comparison.beforeScore} → {comparison.afterScore} technical readiness points</p>
                    {comparison.changes.length ? <ul>{comparison.changes.map((change) => <li key={change.label}>{change.label}: {change.from ? "pass" : "gap"} → {change.to ? "pass" : "gap"}</li>)}</ul> : <p>No measured signal changes since your previous local scan.</p>}
                    <p className="hedgehog-disclaimer">{comparison.note}</p>
                  </>
                ) : <p>Scan this website again on this device to compare real technical checks.</p>}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="hedgehog-professional">
          <p className="hedgehog-eyebrow">{result.projectName} · {result.scannedAt.slice(0, 10)}</p>
          <h2>{result.verdict}</h2>
          <p>Technical readiness score: {result.score}/100. {result.note}</p>
          <div className="scan-signals">
            {result.signals.map((signal) => <div key={signal.label}>
              <span className={signal.checked === false ? "scan-gap" : signal.passed ? "scan-pass" : "scan-gap"}>{signal.checked === false ? "Unknown" : signal.passed ? "Pass" : "Gap"}</span>
              <div><strong>{signal.label}</strong><p>{signal.detail}</p></div>
            </div>)}
          </div>
          <div className="scan-result__columns">
            <div><p className="eyebrow">Buyer-intent prompt ideas (not AI test outputs)</p><ol>{result.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ol></div>
            <div><p className="eyebrow">What to improve first</p><ol>{result.actions.map((action, index) => <li key={index}>{action}</li>)}</ol></div>
          </div>
          <div className="scan-upgrade">
            <div><strong>Want actual AI-platform citation checks?</strong><span>Get an evidence-backed professional GEO audit, fact verification and competitor review.</span></div>
            <a className="button button--gold" href="/checkout?plan=trial" onClick={() => track("trial_checkout_started")}>Professional GEO Report</a>
          </div>
        </div>
      )}
    </section>
  );
}
