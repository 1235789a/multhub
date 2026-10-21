"use client";
import { FormEvent, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getAnonymousId, trackProductEvent } from "../lib/product-events";
import { HedgehogResult, type FullScanResult } from "./HedgehogResult";
import { AuthGate } from "./AuthGate";

export function FreeScan() {
  const [website,setWebsite]=useState("");
  const [category,setCategory]=useState("Web3 infrastructure");
  const [session,setSession]=useState<Session|null>(null);
  const [result,setResult]=useState<FullScanResult|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [authOpen,setAuthOpen]=useState(false);

  async function run(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");setBusy(true);setResult(null);
    try {
      const origin=new URL(/^https?:\/\//i.test(website)?website:"https://"+website).origin;
      const key="hedgehog_previous_"+new URL(origin).hostname;
      let previous:{id:string;token:string}|null=null;
      try {previous=JSON.parse(localStorage.getItem(key)??"null");} catch{}
      const q=new URLSearchParams(window.location.search);
      const ref=q.get("ref")??"";
      const source=q.get("utm_source")??"";
      await trackProductEvent("scan_started",{category,referrerReportId:ref},session);
      const response=await fetch("/api/free-scan",{
        method:"POST",
        headers:{"content-type":"application/json",...(session?.access_token?{authorization:"Bearer "+session.access_token}:{})},
        body:JSON.stringify({
          website,category,anonymousId:getAnonymousId(),
          referrerReportId:ref,utmSource:source,
          previousReportId:previous?.id,previousReportToken:previous?.token,
        }),
      });
      const data=await response.json() as FullScanResult & {error?:string};
      if(!response.ok)throw new Error(data.error??"Scan failed.");
      setResult(data);
      if(data.reportId&&data.publishToken) localStorage.setItem(key,JSON.stringify({id:data.reportId,token:data.publishToken}));
    } catch(e){setError(e instanceof Error?e.message:"Unable to scan website.");}
    finally{setBusy(false);}
  }

  return <div className="scan-shell">
    <form className="scan-form" onSubmit={run}>
      <div><label htmlFor="scan-website">Project website</label><input id="scan-website" type="text" inputMode="url" placeholder="yourproject.xyz" value={website} onChange={e=>setWebsite(e.target.value)} required/></div>
      <div><label htmlFor="scan-category">Project category</label><select id="scan-category" value={category} onChange={e=>setCategory(e.target.value)}>
        {["Web3 infrastructure","Stablecoin payments","Crypto payment infrastructure","Web3 wallet","Developer tools","On-chain data","Web3 SaaS"].map(x=><option key={x}>{x}</option>)}
      </select></div>
      <button className="button button--gold" disabled={busy} type="submit">{busy?"Scanning…":"Reveal my hedgehog 🦔"}</button>
    </form>
    <div className="scan-account-note"><span>No login required for the full technical scan. Public sharing is opt-in.</span><button type="button" className="text-link" onClick={()=>setAuthOpen(true)}>{session?"Account connected":"Sign in to save history"}</button></div>
    {error?<p className="scan-error" role="alert">{error}</p>:null}
    {result?<HedgehogResult key={result.scannedAt} result={result}/>:<div className="hedgehog-teaser"><strong>Which hedgehog is hiding in your website?</strong><p>Seven measured homepage signals. Eight possible transformations. One unexpectedly personal result.</p><a href="/methodology">How our technical check works ↗</a></div>}
    <AuthGate open={authOpen} onClose={()=>setAuthOpen(false)} onSignedIn={(next)=>{setSession(next);setAuthOpen(false);}}/>
  </div>;
}
