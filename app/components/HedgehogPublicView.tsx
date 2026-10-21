"use client";
import { useEffect, useState } from "react";
import { HedgehogArt } from "./HedgehogArt";
import { downloadHedgehogPng } from "../lib/hedgehog-poster";
import type { HedgehogIdentity, ScanSignal } from "../lib/hedgehog";
import { trackProductEvent } from "../lib/product-events";

type PublicReport = {
  id:string; projectName:string|null; website:string|null; score:number; date:string;
  identity:HedgehogIdentity; signals:ScanSignal[];
  counts:{passed:number;total:number};
};

export function HedgehogPublicView({ report }: { report: PublicReport }) {
  const [message,setMessage]=useState("");
  const [size,setSize]=useState<"landscape"|"portrait">("landscape");
  useEffect(()=>{
    const source=new URLSearchParams(window.location.search).get("utm_source")?.slice(0,30) ?? "direct";
    void trackProductEvent("hedgehog_share_view",{reportId:report.id,source});
  },[report.id]);
  const link="https://molthub.click/hedgehog/"+report.id+"?ref="+report.id+"&utm_source=challenge";
  const text="This website got "+report.identity.title+" 🦔\nWhat's your hedgehog? "+link;
  return <div className="container hedgehog-public">
    <p className="eyebrow">Hedgehog Lab · Friend Challenge</p>
    <h1>{report.identity.title}</h1>
    <p className="hedgehog-public__quip">{report.identity.quip}</p>
    <div className="hedgehog-public__card">
      <HedgehogArt kind={report.identity.kind}/>
      <div>
        <span className="eyebrow">Real technical snapshot</span>
        {report.projectName?<h2>{report.projectName}</h2>:<h2>Anonymous website</h2>}
        {report.website?<p>{report.website}</p>:null}
        <strong>{report.counts.passed} / {report.counts.total} checks passed</strong>
        <p>{report.identity.explanation}</p>
        <p>Scanned {new Date(report.date).toLocaleDateString()}</p>
        <small>Website homepage checks, not verified AI model recommendations.</small>
      </div>
    </div>
    <div className="hedgehog-public__cta">
      <h2>Your website deserves a hedgehog too.</h2>
      <p>Free, no login and no email gate. Can you get a different species?</p>
      <a className="button button--gold" href={"/?ref="+report.id+"&utm_source=challenge#free-scan"}>Scan my website →</a>
      <div className="hedgehog-actions">
        <select aria-label="Poster size" value={size} onChange={e=>setSize(e.target.value as "landscape"|"portrait")}><option value="landscape">1200 × 675 PNG</option><option value="portrait">1080 × 1350 PNG</option></select>
        <button className="button button--secondary" type="button" onClick={()=>void downloadHedgehogPng({identity:report.identity,score:report.score,passed:report.counts.passed,total:report.counts.total,projectName:report.projectName},size).catch(e=>setMessage(String(e)))}>Download PNG</button>
        <button className="button button--secondary" type="button" onClick={()=>void navigator.clipboard.writeText(text).then(()=>{setMessage("Post copied");void trackProductEvent("hedgehog_copy_post",{reportId:report.id});}).catch(()=>setMessage("Copy failed"))}>Copy challenge</button>
        <a className="button button--secondary" href={"https://twitter.com/intent/tweet?text="+encodeURIComponent(text)} target="_blank" rel="noreferrer" onClick={()=>void trackProductEvent("hedgehog_share_intent",{reportId:report.id})}>Share on X ↗</a>
      </div>
      <p className="hedgehog-disclaimer">Downloaded images must be attached manually in X.</p>
      {message?<p role="status">{message}</p>:null}
    </div>
  </div>;
}
