"use client";
import { useState } from "react";
import { HedgehogArt } from "./HedgehogArt";
import { countSignals, type HedgehogIdentity, type ScanSignal } from "../lib/hedgehog";
import { downloadHedgehogPng } from "../lib/hedgehog-poster";
import { trackProductEvent } from "../lib/product-events";

export type FullScanResult = {
  preview: false;
  website: string;
  projectName: string;
  category: string;
  score: number;
  verdict: string;
  signals: ScanSignal[];
  identity: HedgehogIdentity;
  scannedAt: string;
  prompts: string[];
  actions: string[];
  note: string;
  usage: { used: number; limit: number } | null;
  reportId: string | null;
  publishToken: string | null;
  evolution: null | {
    previousDate: string; currentDate: string;
    changes: { label: string; before: boolean | null; after: boolean | null }[];
    netPassChange: number; label: string;
  };
};

type Mode = "fun" | "pro";

export function HedgehogResult({ result }: { result: FullScanResult }) {
  const [mode, setMode] = useState<Mode>("fun");
  const [skip, setSkip] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [publishedSettings, setPublishedSettings] = useState("");
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [pngSize, setPngSize] = useState<"landscape" | "portrait">("landscape");
  const counts = countSignals(result.signals);
  const variant = result.reportId && parseInt(result.reportId.replaceAll("-", "").slice(0, 2), 16) % 2 ? "b" : "a";
  const currentSettings = JSON.stringify({ showBrand, showWebsite });
  const upToDate = Boolean(publicUrl && publishedSettings === currentSettings);
  const shareLink = upToDate
    ? publicUrl + "?ref=" + result.reportId + "&utm_source=x"
    : null;
  const post = "Mine is " + result.identity.title + " 🦔\n" +
    result.identity.quip + "\nWhat's yours? " + (shareLink ?? "https://molthub.click/#free-scan");

  const posterInfo = {
    identity: result.identity, score: result.score, passed: counts.passed,
    total: counts.total - counts.unknown,
    projectName: showBrand ? result.projectName : null,
    website: showWebsite ? result.website : null,
    reportUrl: shareLink, variant: variant as "a"|"b",
  };

  async function publish(unpublish = false) {
    if (!result.reportId || !result.publishToken) {
      setError("Share storage is not configured. You can still download your poster.");
      return;
    }
    setSharing(true);setError("");
    try {
      const response = await fetch("/api/hedgehog/publish",{
        method:"POST",headers:{"content-type":"application/json"},
        body:JSON.stringify({
          id:result.reportId,token:result.publishToken,showBrand,showWebsite,
          unpublish,
        }),
      });
      const data = await response.json() as {url?:string;error?:string};
      if (!response.ok) throw new Error(data.error ?? "Could not update public link.");
      if (unpublish) {
        setPublicUrl(null);
        setPublishedSettings("");
      } else {
        setPublicUrl(data.url ?? null);
        setPublishedSettings(currentSettings);
      }
    } catch (err) {setError(err instanceof Error ? err.message : "Publish failed.");}
    finally {setSharing(false);}
  }

  async function download() {
    try {
      await downloadHedgehogPng(posterInfo,pngSize);
      void trackProductEvent("hedgehog_png_download",{reportId:result.reportId,layout:pngSize,kind:result.identity.kind,variant});
    } catch (err) {
      setError(err instanceof Error ? err.message : "PNG download failed.");
    }
  }

  async function copyPost() {
    if (!shareLink) return setError("Make your report public first to copy a working result link.");
    try {
      await navigator.clipboard.writeText(post);
      void trackProductEvent("hedgehog_copy_post",{reportId:result.reportId,variant});
    } catch {setError("Clipboard access failed. Select and copy the text manually.");}
  }

  function shareX() {
    if (!shareLink) return setError("Make your report public first.");
    void trackProductEvent("hedgehog_share_intent",{reportId:result.reportId,variant});
    window.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(post),"_blank","noopener,noreferrer");
  }

  return (
    <div className="hedgehog-result">
      <div className="hedgehog-tabs" role="tablist" aria-label="Results">
        <button role="tab" aria-selected={mode==="fun"} onClick={()=>setMode("fun")} type="button">🦔 Fun Result</button>
        <button role="tab" aria-selected={mode==="pro"} onClick={()=>setMode("pro")} type="button">📊 Professional Report</button>
      </div>

      {mode==="fun" ? (
        <div className={"hedgehog-stage "+(skip?"hedgehog-stage--skip":"")}>
          <div className="hedgehog-stage__intro">
            <span className="eyebrow">Your scan became a hedgehog</span>
            <h2>{result.identity.title}</h2>
            <p>{result.identity.quip}</p>
            {!skip ? <button className="hedgehog-skip" onClick={()=>setSkip(true)} type="button">Skip animation</button> : null}
          </div>
          <div className="hedgehog-stage__visual">
            <HedgehogArt kind={result.identity.kind} />
            <div className="hedgehog-stage__count"><strong>{counts.passed}/{counts.total-counts.unknown}</strong><span>measured signals passed</span></div>
          </div>
          <p className="hedgehog-explanation"><strong>Why this form?</strong> {result.identity.explanation}</p>
          <p className="hedgehog-disclaimer">Based on homepage technical signals from {new Date(result.scannedAt).toLocaleDateString()}. Not a live ChatGPT/Gemini recommendation test.</p>

          <div className="hedgehog-sharing">
            <h3>Challenge a friend: What hedgehog did their website get?</h3>
            <p>Your report stays private unless you actively choose to publish it.</p>
            <label><input type="checkbox" checked={showBrand} onChange={(e)=>setShowBrand(e.target.checked)}/> Show project name on public result & PNG</label>
            <label><input type="checkbox" checked={showWebsite} onChange={(e)=>setShowWebsite(e.target.checked)}/> Show website on public result</label>
            <div className="hedgehog-actions">
              <button type="button" className="button button--gold" disabled={sharing} onClick={()=>void publish()}>{sharing?"Saving…":publicUrl?"Update public report":"Make my result public"}</button>
              {publicUrl ? <button type="button" className="button button--secondary" disabled={sharing} onClick={()=>void publish(true)}>Unpublish</button>:null}
            </div>
            {publicUrl && !upToDate ? <p className="scan-error">Privacy settings changed. Select Update public report before sharing. The previous public settings remain active until updated.</p>:null}
            {shareLink ? <p className="hedgehog-public-link"><a href={shareLink} target="_blank" rel="noreferrer">Open public result ↗</a></p>:null}
            <div className="hedgehog-actions">
              <select value={pngSize} onChange={e=>setPngSize(e.target.value as "landscape"|"portrait")} aria-label="PNG poster format">
                <option value="landscape">X · 1200 × 675</option>
                <option value="portrait">Portrait · 1080 × 1350</option>
              </select>
              <button className="button button--secondary" type="button" onClick={()=>void download()}>Download PNG</button>
              <button className="button button--secondary" type="button" disabled={!shareLink} onClick={()=>void copyPost()}>Copy Post</button>
              <button className="button button--gold" type="button" disabled={!shareLink} onClick={shareX}>{variant==="b"?"Challenge on X ↗":"Share on X ↗"}</button>
            </div>
            {shareLink?<button className="hedgehog-self-report" type="button" onClick={()=>void trackProductEvent("hedgehog_post_self_reported",{reportId:result.reportId,variant})}>I posted it on X (self-report)</button>:null}
            <p className="hedgehog-disclaimer">X opens a prepared text post. To share your PNG, attach the downloaded image in X yourself. A share-button click is not a confirmed post.</p>
            {error ? <p className="scan-error" role="alert">{error}</p> : null}
          </div>
          {result.evolution ? <div className="hedgehog-evolution">
            <h3>Hedgehog evolution · Before / After</h3>
            <p>{new Date(result.evolution.previousDate).toLocaleDateString()} → {new Date(result.evolution.currentDate).toLocaleDateString()}</p>
            <strong>{result.evolution.netPassChange>=0?"+":""}{result.evolution.netPassChange} passed technical signals</strong>
            {result.evolution.changes.map(c=><p key={c.label}>{c.label}: {String(c.before)} → {String(c.after)}</p>)}
            <small>{result.evolution.label}</small>
          </div>:null}
        </div>
      ) : (
        <section className="hedgehog-professional">
          <div className="scan-result__summary">
            <p className="eyebrow">{result.projectName}</p>
            <h2>{result.verdict} — {result.score}/100 readiness</h2>
            <p>{result.note}</p>
            {result.usage ? <p>Saved scans this month: {result.usage.used}/{result.usage.limit}</p>:<p>No account required for this report.</p>}
          </div>
          <div className="scan-signals">
            {result.signals.map(s=><div key={s.label}>
              <span className={s.passed===true?"scan-pass":"scan-gap"}>{s.passed===null?"Unknown":s.passed?"Pass":"Gap"}</span>
              <div><strong>{s.label}</strong><p>{s.detail}</p></div>
            </div>)}
          </div>
          <div className="scan-result__columns"><div><p className="eyebrow">Research prompts (not tested)</p><ol>{result.prompts.map(p=><li key={p}>{p}</li>)}</ol></div><div><p className="eyebrow">Fix first</p><ol>{result.actions.map(a=><li key={a}>{a}</li>)}</ol></div></div>
          <div className="scan-upgrade"><div><strong>Need a verified AI-platform report?</strong><span>Manual model checks, cited evidence, competitor review and specific fixes are separate from this free technical scan.</span></div><a href="/checkout?plan=trial" className="button button--secondary">See professional report</a></div>
        </section>
      )}
    </div>
  );
}
