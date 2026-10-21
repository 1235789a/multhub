import { classifyHedgehog, compareSignals, type ScanSignal } from "../../lib/hedgehog";
import { digestShareToken, getAuthorizedReport } from "../../lib/hedgehog-store";
import { getRequestUser, getSupabaseAdmin, recordProductEvent } from "../../lib/supabase-server";

const MAX_HTML_BYTES = 1_000_000;
const FREE_MONTHLY_LIMIT = 2;

type ScanPayload = {
  website?: string;
  category?: string;
  anonymousId?: string;
  referrerReportId?: string;
  utmSource?: string;
  previousReportId?: string;
  previousReportToken?: string;
};

function normalizeWebsite(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter your project website.");
  let url: URL;
  try { url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed); }
  catch { throw new Error("Enter a valid public website."); }
  const hostname = url.hostname.toLowerCase();
  // Security: this is a basic guard. Production deployment also requires an
  // outbound network/egress policy against DNS rebinding and private IP ranges.
  const blocked = url.protocol !== "https:" && url.protocol !== "http:"
    || Boolean(url.username || url.password)
    || !["", "80", "443"].includes(url.port)
    || hostname === "localhost"
    || /\.(?:localhost|local|internal|test|lan|home|arpa|invalid|example|onion)$/i.test(hostname)
    || /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
    || /^\[.*\]$/.test(hostname)
    || /^\d+$/.test(hostname);
  if (blocked) throw new Error("Only public HTTP(S) websites can be scanned.");
  url.hash = "";
  url.pathname = "/";
  url.search = "";
  return url;
}

function extractMatch(html: string, re: RegExp) {
  return html.match(re)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function blockedByRobots(text: string) {
  // Conservative heuristic for a full-site block by '*' or OAI-SearchBot.
  // Fine-grained bot policy needs a dedicated robots parser.
  let agents: string[] = [];
  let rules: { agents: string[]; disallow: string[]; allow: string[] }[] = [];
  let last: (typeof rules)[number] | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const s=raw.replace(/#.*$/,"").trim();
    const match=s.match(/^([a-z-]+)\s*:\s*(.*?)\s*$/i);
    if(!match)continue;
    const key=match[1].toLowerCase(), val=match[2].toLowerCase();
    if(key==="user-agent"){
      if(last && (last.disallow.length || last.allow.length))last=null;
      if(!last){ last={agents:[],allow:[],disallow:[]};rules.push(last);}
      last.agents.push(val);
    } else if(last && (key==="allow" || key==="disallow")) {
      last[key].push(val);
    }
  }
  const specific=rules.filter(g=>g.agents.includes("oai-searchbot"));
  const relevant=specific.length?specific:rules.filter(g=>g.agents.includes("*"));
  return relevant.some(g=>g.disallow.includes("/") && !g.allow.includes("/"));
}

function buildPrompts(name:string, category:string) {
  return [
    "What are the best "+category.toLowerCase()+" for early-stage teams?",
    "How does "+name+" compare with its closest competitors?",
    "Is "+name+" a credible option for Web3 users?",
  ];
}

export async function POST(request:Request) {
  try {
    const payload=(await request.json()) as ScanPayload;
    const url=normalizeWebsite(payload.website??"");
    const category=(payload.category?.trim()||"Web3 infrastructure").slice(0,80);
    const user=await getRequestUser(request);
    const response=await fetch(url,{
      headers:{accept:"text/html,application/xhtml+xml","user-agent":"molthub-free-geo-scan/2.0"},
      redirect:"manual",signal:AbortSignal.timeout(10_000),
    });
    if(response.status>=300 && response.status<400)throw new Error("Website redirects. Try the final public URL.");
    if(!response.ok)throw new Error("Homepage returned HTTP "+response.status);
    if(Number(response.headers.get("content-length")??0)>MAX_HTML_BYTES)throw new Error("Homepage too large for this quick scan.");
    const contentType=response.headers.get("content-type")??"";
    if(!/text\/html|application\/xhtml\+xml/i.test(contentType))throw new Error("The URL does not return an HTML homepage.");
    const html=(await response.text()).slice(0,MAX_HTML_BYTES);
    const lower=html.toLowerCase();
    const rawTitle=extractMatch(html,/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title=rawTitle||url.hostname.replace(/^www\./,"");
    const description=
      extractMatch(html,/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) ||
      extractMatch(html,/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
    const schema=/application\/ld\+json/i.test(lower);
    const faq=/faq|frequently asked/i.test(lower);
    const docs=/docs|documentation|developer portal|api reference/i.test(lower);
    const canonical=/rel=["']canonical["']/i.test(lower);
    const signals:ScanSignal[]=[
      {label:"Clear page title",passed:rawTitle.length>=18&&rawTitle.length<=70,detail:rawTitle.length>=18&&rawTitle.length<=70?"A usable title was detected.":"Page title missing, very short or longer than 70 characters."},
      {label:"Useful meta description",passed:description.length>=70&&description.length<=180,detail:description.length>=70&&description.length<=180?"A descriptive summary was found.":"Add a concise product and audience description (70–180 characters)."},
      {label:"Structured data",passed:schema,detail:schema?"JSON-LD structured data detected.":"No JSON-LD structured data found."},
      {label:"FAQ signal",passed:faq,detail:faq?"FAQ content/navigation signal detected.":"No clear FAQ signal detected."},
      {label:"Documentation signal",passed:docs,detail:docs?"Documentation/developer signal detected.":"No obvious documentation signal detected."},
      {label:"Canonical URL",passed:canonical,detail:canonical?"Canonical link marker detected.":"No canonical link marker detected."},
    ];
    let robots="",robotsKnown=false;
    try {
      const robotsResponse=await fetch(new URL("/robots.txt",url),{
        headers:{"user-agent":"molthub-free-geo-scan/2.0"},
        redirect:"manual",signal:AbortSignal.timeout(5_000),
      });
      robotsKnown=robotsResponse.ok || robotsResponse.status===404;
      if(robotsResponse.ok)robots=(await robotsResponse.text()).slice(0,100_000);
    }catch{robotsKnown=false;}
    const blocked=blockedByRobots(robots);
    signals.push({
      label:"AI search crawler access",passed:robotsKnown?!blocked:null,
      detail:!robotsKnown?"Could not confirm robots.txt rules; status unknown.":blocked
        ?"Found a likely whole-site blocking rule for OAI-SearchBot or default crawlers."
        :"No obvious whole-site crawler block detected (heuristic).",
    });
    const measured=signals.filter(s=>s.passed!==null).length;
    const passed=signals.filter(s=>s.passed===true).length;
    const score=Math.round(100*passed/measured);
    const identity=classifyHedgehog(signals,rawTitle.length);
    const projectName=title.split(/[|\-—]/)[0]?.trim()||url.hostname;
    const scannedAt=new Date().toISOString();
    const actions=signals.filter(s=>s.passed===false).slice(0,3).map(s=>s.detail);
    const fallbacks=[
      "Create a documented competitor comparison page for a buyer-intent query.",
      "Publish a concise product fact block with verifiable supported features.",
      "Test the same prompts manually across AI platforms and retain source evidence.",
    ];
    while(actions.length<3)actions.push(fallbacks[actions.length]);
    const fullResult={
      website:url.origin,projectName,category,score,identity,scannedAt,
      verdict:score>=80?"Strong technical foundation":score>=55?"Visible gaps worth fixing":"Weak website readiness signals",
      signals,prompts:buildPrompts(projectName,category),actions,
      note:"This free scan measures homepage technical signals. It does NOT query AI platforms or prove AI mentions.",
    };

    const admin=await getSupabaseAdmin();
    let usage:{used:number;limit:number}|null=null;
    if(user && admin) {
      const monthStart=new Date();
      monthStart.setUTCDate(1);monthStart.setUTCHours(0,0,0,0);
      const {count,error:countError}=await admin.from("scans").select("id",{count:"exact",head:true})
        .eq("user_id",user.id).gte("created_at",monthStart.toISOString());
      if(countError)throw new Error(countError.message);
      // Saved-scan cap never blocks the public free technical result.
      if((count??0)<FREE_MONTHLY_LIMIT){
        const {error:saveError}=await admin.from("scans").insert({
          user_id:user.id,website:url.origin,category,score,
          verdict:fullResult.verdict,result:fullResult,
        });
        if(saveError)throw new Error(saveError.message);
      }
      usage={used:Math.min((count??0)+1,FREE_MONTHLY_LIMIT),limit:FREE_MONTHLY_LIMIT};
    }

    let reportId:string|null=null;
    let publishToken:string|null=null;
    let evolution:ReturnType<typeof compareSignals>|null=null;
    if(admin){
      const id=crypto.randomUUID();
      const token=Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,"0")).join("");
      const {error:reportError}=await admin.from("hedgehog_reports").insert({
        id,share_token_hash:await digestShareToken(token),website:url.origin,
        project_name:projectName,category,score,scanned_at:scannedAt,
        signals,identity,published_at:null,show_website:false,show_brand:false,
      });
      if(!reportError){
        reportId=id;publishToken=token;
        if(payload.previousReportId && payload.previousReportToken){
          const prior=await getAuthorizedReport(payload.previousReportId,payload.previousReportToken);
          if(prior?.website===url.origin) evolution=compareSignals(prior.signals,signals,prior.scanned_at,scannedAt);
        }
      }
    }
    const ref=/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(payload.referrerReportId??"")
      ? payload.referrerReportId:null;
    const source=/^(x|direct|copy|challenge)$/i.test(payload.utmSource??"")
      ? payload.utmSource:null;
    await recordProductEvent({
      name:"scan_completed",anonymousId:payload.anonymousId?.slice(0,100),userId:user?.id,
      metadata:{website:url.hostname,category,score,referrerReportId:ref,utmSource:source},
    });
    if(ref)await recordProductEvent({name:"referred_scan_completed",metadata:{reportId:ref,source}});
    return Response.json({...fullResult,preview:false,usage,reportId,publishToken,evolution});
  }catch(err){
    const message=err instanceof Error?err.message:"Scan failed.";
    return Response.json({error:message},{status:400});
  }
}
