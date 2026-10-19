import { createQuestionPack } from "./questions";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";
import { buildAuditReport } from "./vendor/optifeed/audit/audit";
import { extractPage } from "./vendor/optifeed/fetcher/extract";
import { fold, indexOfTerm } from "./vendor/optifeed/text";
import { createSafeFetcher, normalizeUrl } from "./network";
import { AppError, type Check, type FetchRecord, type Report } from "./types";
export const METHOD_VERSION = "multihub-readiness-1.0.0";
export function buyerQuestions(industry: string) {
  return createQuestionPack(industry, "").questions.map((q) => q.question);
}
const has = (text: string, brand: string) =>
  indexOfTerm(fold(text), brand) !== -1;
const snippet = (text: string, max = 280) =>
  text.replace(/\s+/g, " ").trim().slice(0, max);
export async function scanWebsite(
  input: {
    website: unknown;
    brand?: string;
    industry?: string;
    competitor?: string;
    questionPackId?: string;
  },
  deps: { fetchPage?: ReturnType<typeof createSafeFetcher>; now?: Date } = {},
): Promise<Report> {
  const url = normalizeUrl(input.website);
  const fetchPage = deps.fetchPage ?? createSafeFetcher();
  const home = await fetchPage(url.href, 1200000);
  if (!home.ok)
    throw new AppError(
      home.kind ?? "WEBSITE_UNREACHABLE",
      home.error ??
        `The website returned HTTP ${home.status}. No score was generated.`,
      422,
    );
  if (!/text\/html|application\/xhtml\+xml/i.test(home.contentType))
    throw new AppError(
      "NOT_HTML",
      "This URL did not return an HTML page. No score was generated.",
      422,
    );
  const final = new URL(home.finalUrl);
  const origin = final.origin;
  const [robots, sitemap, llms] = await Promise.all(
    ["/robots.txt", "/sitemap.xml", "/llms.txt"].map((p) =>
      fetchPage(origin + p, 128000),
    ),
  );
  const parsed = extractPage(home.body);
  const $ = cheerio.load(home.body);
  const jsonScripts = $('script[type="application/ld+json"]');
  let invalidJson = 0;
  jsonScripts.each((_, el) => {
    try {
      JSON.parse($(el).text());
    } catch {
      invalidJson++;
    }
  });
  const entities: Record<string, unknown>[] = [];
  const visit = (value: unknown, depth = 0) => {
    if (depth > 12) return;
    if (Array.isArray(value)) {
      value.forEach((v) => visit(v, depth + 1));
      return;
    }
    if (value && typeof value === "object") {
      const o = value as Record<string, unknown>;
      if (o["@type"]) entities.push(o);
      if (o["@graph"]) visit(o["@graph"], depth + 1);
    }
  };
  parsed.jsonLd.forEach((v) => visit(v));
  const schemaTypes = [
    ...new Set(
      entities
        .flatMap((e) => [e["@type"]].flat())
        .filter((v): v is string => typeof v === "string"),
    ),
  ];
  const org = entities.find((e) =>
    [e["@type"]]
      .flat()
      .some((t) =>
        /^(Organization|Corporation|LocalBusiness|ProfessionalService|SoftwareApplication|Brand)$/i.test(
          String(t),
        ),
      ),
  );
  const brandSignals = [
    {
      source: "Organization / product schema",
      name: typeof org?.name === "string" ? org.name : "",
    },
    { source: "Open Graph site name", name: parsed.og.site_name ?? "" },
    {
      source: "Page title",
      name: parsed.title?.split(/\s+[|–—-]\s+/)[0] ?? "",
    },
  ]
    .filter((v) => v.name)
    .map((v) => ({ ...v, name: snippet(v.name, 100) }));
  const detectedBrand =
    brandSignals[0]?.name || final.hostname.replace(/^www\./, "");
  const brand = input.brand?.trim().slice(0, 100) || detectedBrand;
  const industry = input.industry?.trim().slice(0, 100) || "";
  const competitor = input.competitor
    ? normalizeUrl(input.competitor).origin
    : "";
  const headings = $("h1,h2,h3")
    .toArray()
    .slice(0, 30)
    .map((el) => `${el.tagName.toUpperCase()}: ${snippet($(el).text(), 150)}`);
  $(
    'script,style,noscript,template,nav,footer,header,[hidden],[aria-hidden="true"]',
  ).remove();
  const body = snippet(
    $("main").length ? $("main").text() : $("body").text(),
    200000,
  );
  const words = body.split(/\s+/).filter(Boolean).length;
  const isText = (r: FetchRecord) =>
    !/<\s*(?:!doctype\s+html|html|head|body)\b/i.test(r.body) &&
    !r.contentType.includes("text/html");
  const robotsKnown =
    (robots.ok && isText(robots)) ||
    robots.status === 404 ||
    robots.status === 410;
  const robotsText = robots.ok && isText(robots) ? robots.body : null;
  const robotsModel = robotsParser(origin + "/robots.txt", robotsText ?? "");
  const bots = [
    { bot: "OAI-SearchBot", vendor: "OpenAI", purpose: "Search retrieval" },
    { bot: "PerplexityBot", vendor: "Perplexity", purpose: "Search retrieval" },
    { bot: "Googlebot", vendor: "Google", purpose: "Search indexing" },
    { bot: "GPTBot", vendor: "OpenAI", purpose: "Model training (not scored)" },
    {
      bot: "ClaudeBot",
      vendor: "Anthropic",
      purpose: "Model training (not scored)",
    },
    {
      bot: "Google-Extended",
      vendor: "Google",
      purpose: "AI use control (not scored)",
    },
  ].map((b) => ({
    ...b,
    access: robotsKnown
      ? robotsModel.isAllowed(final.href, b.bot) === false
        ? "blocked"
        : "allowed"
      : "unknown",
  }));
  const sitemapValid =
    sitemap.ok &&
    /<(?:\w+:)?(?:urlset|sitemapindex)\b/i.test(sitemap.body) &&
    !/<html\b/i.test(sitemap.body);
  const xml = cheerio.load(sitemap.body, { xmlMode: true });
  const sitemapCount = xml("loc").length;
  // The upstream pure engine supplies structured/meta/llms/sitemap fractions.
  // MultiHub publishes its own weights and separately handles unavailable evidence.
  const base = buildAuditReport({
    domain: final.hostname,
    robotsTxt: robotsText,
    llmsTxt: llms.ok && isText(llms) ? llms.body : null,
    llmsFullTxt: null,
    homepage: parsed,
    sampledPages: [parsed],
    sitemap: {
      present: sitemap.ok,
      parseable: sitemapValid,
      urlCount: sitemapCount,
    },
  });
  const fraction = (id: string) => {
    const c = base.categories.find((c) => c.id === id)!;
    return c.earned / c.weight;
  };
  const checks: Check[] = [];
  const add = (
    id: string,
    category: string,
    title: string,
    status: Check["status"],
    priority: Check["priority"],
    evidence: string,
    why: string,
    action: string,
    source: string,
    weight: number,
    earned: number,
  ) =>
    checks.push({
      id,
      category,
      title,
      status,
      priority,
      evidence,
      why,
      action,
      source,
      weight,
      earned: Math.min(weight, Math.max(0, earned)),
    });
  const allowed = bots.slice(0, 3).filter((b) => b.access === "allowed").length;
  add(
    "crawler",
    "Discovery",
    "AI search crawler rules",
    robotsKnown ? (allowed === 3 ? "pass" : "fail") : "unknown",
    "High",
    robotsKnown
      ? robotsText
        ? bots
            .slice(0, 3)
            .map((b) => `${b.bot}: ${b.access}`)
            .join("; ")
        : `HTTP ${robots.status}: no robots.txt, so access is allowed by default.`
      : robots.error || `HTTP ${robots.status}; no valid robots.txt verified.`,
    "Search systems need permission to retrieve this page. Training permissions are a separate choice.",
    "Review the matching robots.txt groups for this URL. Allow search crawlers only where this fits your policy. Rules do not prove actual crawler visits or bypass a firewall.",
    robots.url,
    25,
    (allowed / 3) * 25,
  );
  add(
    "sitemap",
    "Discovery",
    "XML sitemap",
    sitemapValid
      ? "pass"
      : sitemap.status === 404 || sitemap.ok
        ? "warn"
        : "unknown",
    "Medium",
    sitemapValid
      ? `HTTP ${sitemap.status}; ${sitemapCount} <loc> entries in sitemap or index. Child sitemaps were not crawled.`
      : sitemap.error ||
          `HTTP ${sitemap.status}; ${sitemap.ok ? "not a valid sitemap root" : "sitemap not retrieved"}.`,
    "A sitemap helps search crawlers discover canonical pages.",
    "Publish a valid sitemap.xml containing your canonical pages, or link your custom sitemap from robots.txt.",
    sitemap.url,
    10,
    sitemapValid ? 10 : 0,
  );
  add(
    "schema",
    "Understanding",
    "Schema.org / JSON-LD",
    fraction("structured") === 1 && !invalidJson ? "pass" : "warn",
    "Medium",
    `${parsed.jsonLd.length} valid JSON-LD block(s); ${invalidJson} invalid. Types: ${schemaTypes.join(", ") || "none"}.`,
    "Structured facts help systems distinguish your organization, product and website.",
    "Add valid Organization and WebSite JSON-LD with a consistent name, canonical URL and verified sameAs links. Validate semantic accuracy separately.",
    home.finalUrl,
    20,
    fraction("structured") * 20 * (invalidJson ? 0.75 : 1),
  );
  add(
    "meta",
    "Understanding",
    "Title, description & canonical",
    fraction("meta") === 1 ? "pass" : "warn",
    "Medium",
    `Title: ${snippet(parsed.title ?? "(missing)", 100)} | Description: ${snippet(parsed.metaDescription ?? "(missing)", 160)} | Canonical: ${snippet(parsed.canonical ?? "(missing)", 150)} | Lang: ${parsed.lang ?? "(missing)"}`,
    "Clear page identity and summaries make a page easier to index and interpret.",
    "Use a specific title and description, one canonical URL, an html language attribute and Open Graph metadata. Check that the canonical resolves to the intended page.",
    home.finalUrl,
    15,
    fraction("meta") * 15,
  );
  const h1s = headings.filter((h) => h.startsWith("H1:")).length;
  add(
    "headings",
    "Content",
    "Readable heading hierarchy",
    h1s === 1 && headings.length > 1 ? "pass" : "warn",
    "Medium",
    `${h1s} H1 heading(s). ${headings.slice(0, 5).join(" | ") || "No H1–H3 headings found."}`,
    "Headings expose your offer and organize passages for people and retrieval systems.",
    "Use one descriptive H1 and helpful H2 sections covering your offer, audience, pricing and buyer questions.",
    home.finalUrl,
    5,
    h1s === 1 ? (headings.length > 1 ? 5 : 3) : h1s > 1 ? 2 : 0,
  );
  add(
    "content",
    "Content",
    "Server-rendered content",
    words >= 200 ? "pass" : words >= 60 ? "warn" : "fail",
    "High",
    `${words} whitespace-delimited words extracted from ${$("main").length ? "main" : "body"}, excluding scripts, navigation and hidden elements. ${snippet(body, 200)}`,
    "A page that needs JavaScript to reveal its core offer may be harder for some crawlers to read.",
    "Render the product description, use cases, proof and key buyer answers in the initial HTML. Word count is a heuristic, not a ranking target.",
    home.finalUrl,
    10,
    words >= 200 ? 10 : words >= 60 ? 5 : 0,
  );
  const noindex = /(?:^|[,\s])(?:noindex|none)(?:$|[,\s])/i.test(
    cheerio
      .load(home.body)('meta[name="robots" i],meta[name="googlebot" i]')
      .map((_, e) => cheerio.load(home.body)(e).attr("content") ?? "")
      .get()
      .join(","),
  );
  add(
    "indexing",
    "Discovery",
    "Page indexing directive",
    noindex ? "fail" : "pass",
    "High",
    noindex
      ? "An HTML robots meta directive contains noindex or none."
      : "No noindex/none directive found in the HTML robots meta tags. X-Robots-Tag is not included in this rule.",
    "A noindex directive can keep an otherwise readable page out of search indexes.",
    "Remove noindex only from pages intended for public discovery. Review HTTP X-Robots-Tag separately.",
    home.finalUrl,
    5,
    noindex ? 0 : 5,
  );
  const signalMatches = brandSignals.map((s) => ({
    ...s,
    match: has(s.name, brand),
  }));
  const consistent =
    signalMatches.length > 0 && signalMatches.every((s) => s.match);
  add(
    "brand",
    "Understanding",
    "Brand identity consistency",
    consistent ? "pass" : "warn",
    "Medium",
    `Selected brand: ${brand}. ${signalMatches.map((s) => `${s.source}: ${s.name} (${s.match ? "matches" : "review"})`).join(" | ") || "No brand name signals found."}`,
    "Consistent identity reduces ambiguity between your product and similarly named companies.",
    "Confirm the editable brand name, then align the title, Open Graph site name and Organization name. This checks one page, not every external listing.",
    home.finalUrl,
    5,
    consistent ? 5 : signalMatches.some((s) => s.match) ? 2.5 : 0,
  );
  add(
    "llms",
    "AI guidance",
    "Optional llms.txt",
    llms.ok && isText(llms)
      ? fraction("llms") === 1
        ? "pass"
        : "warn"
      : llms.status === 404 || llms.ok
        ? "warn"
        : "unknown",
    "Low",
    llms.ok && isText(llms)
      ? `HTTP ${llms.status}; ${snippet(llms.body, 240)}`
      : llms.error || `HTTP ${llms.status}; no text guidance verified.`,
    "llms.txt is an emerging optional convention. It is not required for indexing and does not guarantee use by any AI platform.",
    "Optionally publish a short llms.txt linking to accurate product, documentation and pricing pages. Prioritize crawlability and useful content first.",
    llms.url,
    5,
    fraction("llms") * 5,
  );
  checks.sort(
    (a, b) =>
      ({ High: 0, Medium: 1, Low: 2 })[a.priority] -
      { High: 0, Medium: 1, Low: 2 }[b.priority],
  );
  const coverage = checks
    .filter((c) => c.status !== "unknown")
    .reduce((n, c) => n + c.weight, 0);
  const earned = checks
    .filter((c) => c.status !== "unknown")
    .reduce((n, c) => n + c.earned, 0);
  const now = deps.now ?? new Date();
  return {
    id: crypto.randomUUID(),
    version: METHOD_VERSION,
    website: url.href,
    finalUrl: home.finalUrl,
    brand,
    detectedBrand,
    industry,
    competitor,
    checkedAt: now.toISOString(),
    expiresAt: new Date(+now + 30 * 86400000).toISOString(),
    score: coverage ? Math.round((earned / coverage) * 100) : 0,
    coverage,
    checks,
    categories: [...new Set(checks.map((c) => c.category))].map((name) => {
      const cs = checks.filter((c) => c.category === name);
      return {
        name,
        weight: cs.reduce((n, c) => n + c.weight, 0),
        verified: cs
          .filter((c) => c.status !== "unknown")
          .reduce((n, c) => n + c.weight, 0),
        earned: cs
          .filter((c) => c.status !== "unknown")
          .reduce((n, c) => n + c.earned, 0),
      };
    }),
    bots,
    sources: [home, robots, sitemap, llms].map(({ body: _, ...s }) => s),
    page: {
      title: snippet(parsed.title ?? "", 200),
      description: snippet(parsed.metaDescription ?? "", 300),
      headings,
      words,
      schemaTypes,
      brandSignals,
    },
    questions: createQuestionPack(
      industry,
      brand,
      input.questionPackId,
    ).questions.map((q) => q.question),
    questionPack: createQuestionPack(industry, brand, input.questionPackId),
    visibility: {
      status: "not_tested",
      note: "No model API has been queried. Readiness is a rules-based website check, not evidence that ChatGPT, Gemini or Perplexity recommends this brand.",
      runs: [],
    },
  };
}
