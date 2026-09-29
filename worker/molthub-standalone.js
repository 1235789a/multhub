/**
 * molthub.click — Standalone Cloudflare Worker
 *
 * Two tiers:
 *   1. Free  : POST /api/free-scan  -> website readiness signals + DeepSeek aiSummary
 *   2. 2.99  : POST /api/orders (create USDT-TRC20 order)
 *              -> POST /api/orders/verify (on-chain TRC20 confirmation)
 *              -> GET  /api/report (DeepSeek AI visibility report, gated behind paid order)
 *
 * Bindings (plain_text):
 *   DEEPSEEK_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * No ASSETS binding — all HTML/CSS is inlined.
 */

const USDT_TRC20_WALLET = "TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF";
const USDT_TRC20_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const TRON_NETWORK = "TRON Mainnet";
const USDT_STANDARD = "TRC20";
const ORDER_HOURS = 24;
const MAX_HTML_BYTES = 1_000_000;

const PLANS = {
  trial: { id: "trial", name: "Instant Visibility Report", amount: "2.99" },
  baseline: { id: "baseline", name: "Verified GEO Baseline", amount: "59" },
  audit: { id: "audit", name: "Expert Web3 GEO Audit", amount: "299" },
  sprint: { id: "sprint", name: "Done-for-You GEO Sprint", amount: "999" },
};

/* ------------------------------------------------------------------ */
/* HTTP helpers                                                        */
/* ------------------------------------------------------------------ */

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      ...extraHeaders,
    },
  });
}

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function notFound() {
  return html(renderShell("Not found", "<h1>404</h1><p>This page does not exist.</p>"), 404);
}

function storageError(error) {
  if (error && error.code === "42P01") {
    return "Payment storage is not initialized yet.";
  }
  return (error && error.message) || "The order could not be saved.";
}

/* ------------------------------------------------------------------ */
/* Supabase REST helpers (no SDK — pure fetch)                         */
/* ------------------------------------------------------------------ */

function sbUrl(env) {
  return (env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
}
function sbServiceKey(env) {
  return env.SUPABASE_SERVICE_ROLE_KEY || "";
}
function sbAnonKey(env) {
  return env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}
function sbConfigured(env) {
  return Boolean(sbUrl(env) && sbServiceKey(env) && sbAnonKey(env));
}

async function sbRequest(env, method, table, { params, body } = {}) {
  const base = sbUrl(env);
  const key = sbServiceKey(env);
  const url = new URL(`${base}/rest/v1/${table}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  // PostgREST error shape: { code, message, details, hint }
  const err = !res.ok && data && typeof data === "object" ? data : null;
  return { ok: res.ok, status: res.status, data, error: err };
}

async function getRequestUser(request, env) {
  const auth = request.headers.get("authorization") || "";
  const match = auth.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1] : null;
  if (!token || !sbConfigured(env)) return null;
  const base = sbUrl(env);
  const anon = sbAnonKey(env);
  try {
    const res = await fetch(`${base}/auth/v1/user`, {
      headers: { apikey: anon, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    if (!user || !user.id) return null;
    return user;
  } catch {
    return null;
  }
}

async function recordProductEvent(env, { name, userId, anonymousId, metadata }) {
  if (!sbConfigured(env)) return;
  await sbRequest(env, "POST", "product_events", {
    body: {
      name,
      user_id: userId || null,
      anonymous_id: anonymousId || null,
      metadata: metadata || {},
    },
  });
}

/* ------------------------------------------------------------------ */
/* DeepSeek helper                                                     */
/* ------------------------------------------------------------------ */

async function deepSeekChat(env, messages, { json = false, maxTokens = 1400 } = {}) {
  const key = env.DEEPSEEK_API_KEY;
  if (!key) {
    const e = new Error("DeepSeek API key is not configured.");
    e.code = "no_key";
    throw e;
  }
  const payload = {
    model: "deepseek-chat",
    messages,
    temperature: 0.4,
    max_tokens: maxTokens,
    stream: false,
  };
  if (json) payload.response_format = { type: "json_object" };

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const t = await res.text();
    const e = new Error(`DeepSeek ${res.status}: ${t.slice(0, 400)}`);
    e.code = "http_error";
    e.status = res.status;
    throw e;
  }
  const data = await res.json();
  const content = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : "";
  return content;
}

/* ------------------------------------------------------------------ */
/* TRON TRC20 verification (ported from tron-payment-server.ts)        */
/* ------------------------------------------------------------------ */

function isTronTxid(value) {
  return /^[a-fA-F0-9]{64}$/.test((value || "").trim());
}

function usdtToBaseUnits(amount) {
  const [whole = "0", fraction = ""] = String(amount).split(".");
  if (!/^\d+$/.test(whole) || !/^\d*$/.test(fraction) || fraction.length > 6) {
    throw new Error("Invalid USDT amount.");
  }
  return `${whole}${fraction.padEnd(6, "0")}`.replace(/^0+(?=\d)/, "");
}

function validateTransfer(transfer, txid, expectedAmount) {
  if ((transfer.transaction_id || "").toLowerCase() !== txid.toLowerCase()) {
    return { ok: false, code: "not_found", message: "This transaction was not found for the molthub receiving address." };
  }
  if (transfer.type !== "Transfer") {
    return { ok: false, code: "unconfirmed", message: "The transaction is not a confirmed TRC20 transfer yet." };
  }
  if (transfer.token_info && transfer.token_info.address !== USDT_TRC20_CONTRACT) {
    return { ok: false, code: "wrong_contract", message: "The transaction is not official USDT on TRON." };
  }
  if (transfer.to !== USDT_TRC20_WALLET) {
    return { ok: false, code: "wrong_recipient", message: "The transaction was not sent to the molthub receiving address." };
  }
  let amountOk = true;
  try {
    amountOk = transfer.value === usdtToBaseUnits(expectedAmount);
  } catch {
    amountOk = false;
  }
  if (!amountOk) {
    return { ok: false, code: "wrong_amount", message: `The transaction amount does not match ${expectedAmount} USDT.` };
  }
  return {
    ok: true,
    txid,
    from: transfer.from || "",
    receivedAt: transfer.block_timestamp ? new Date(transfer.block_timestamp).toISOString() : null,
  };
}

async function verifyConfirmedUsdtPayment(txid, expectedAmount) {
  const normalizedTxid = (txid || "").trim();
  if (!isTronTxid(normalizedTxid)) {
    return { ok: false, code: "invalid_txid", message: "Enter the 64-character TRON transaction ID." };
  }

  const endpoint = new URL(`https://api.trongrid.io/v1/accounts/${USDT_TRC20_WALLET}/transactions/trc20`);
  endpoint.searchParams.set("only_confirmed", "true");
  endpoint.searchParams.set("limit", "200");
  endpoint.searchParams.set("contract_address", USDT_TRC20_CONTRACT);

  const headers = { accept: "application/json" };
  // Optional: TRONGRID_API_KEY is not bound; trongrid public endpoint works at low volume.

  let response;
  try {
    response = await fetch(endpoint, { headers, cache: "no-store" });
  } catch {
    return { ok: false, code: "provider_error", message: "TRON verification is temporarily unavailable. Try again shortly." };
  }
  if (!response.ok) {
    return { ok: false, code: "provider_error", message: "TRON verification is temporarily unavailable. Try again shortly." };
  }
  const payload = await response.json();
  const transfer = (payload.data || []).find(
    (item) => (item.transaction_id || "").toLowerCase() === normalizedTxid.toLowerCase()
  );
  if (!transfer) {
    return { ok: false, code: "not_found", message: "No confirmed matching payment was found. Wait for confirmation and try again." };
  }
  return validateTransfer(transfer, normalizedTxid, expectedAmount);
}

/* ------------------------------------------------------------------ */
/* Website scan signals (ported from app/api/free-scan/route.ts)       */
/* ------------------------------------------------------------------ */

function normalizeWebsite(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) throw new Error("Enter your project website.");
  const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only public http or https websites can be scanned.");
  }
  const hostname = url.hostname.toLowerCase();
  const blocked =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".test") ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname) ||
    hostname.includes(":");
  if (blocked) throw new Error("Enter a public project website.");
  url.hash = "";
  return url;
}

function extractMatch(source, pattern) {
  return (source.match(pattern) || [])[1] || "";
}

function buildPrompts(projectName, category) {
  return [
    `What are the best ${category.toLowerCase()} for early-stage teams?`,
    `How does ${projectName} compare with its closest competitors?`,
    `Is ${projectName} a credible option for Web3 users?`,
  ];
}

function isCrawlerBlocked(robotsText, targetAgent) {
  const lines = (robotsText || "").split(/\r?\n/);
  let agents = [];
  let rulesStarted = false;
  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const sep = line.indexOf(":");
    if (sep < 0) continue;
    const key = line.slice(0, sep).trim().toLowerCase();
    const value = line.slice(sep + 1).trim().toLowerCase();
    if (key === "user-agent") {
      if (rulesStarted) {
        agents = [];
        rulesStarted = false;
      }
      agents.push(value);
      continue;
    }
    if (agents.length === 0) continue;
    rulesStarted = true;
    const applies = agents.some((a) => a === "*" || a === targetAgent.toLowerCase());
    if (applies && key === "disallow" && value === "/") return true;
  }
  return false;
}

async function scanWebsite(url) {
  const response = await fetch(url, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "molthub-free-geo-scan/1.0",
    },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  if (response.status >= 300 && response.status < 400) {
    throw new Error("This website redirects before it can be checked. Try its final URL.");
  }
  if (!response.ok) {
    throw new Error(`The website returned HTTP ${response.status}.`);
  }
  const contentLength = Number(response.headers.get("content-length") || "0");
  if (contentLength > MAX_HTML_BYTES) {
    throw new Error("The homepage is too large for this quick scan.");
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
    throw new Error("The supplied URL does not appear to be a website homepage.");
  }
  const htmlBody = (await response.text()).slice(0, MAX_HTML_BYTES);
  const lower = htmlBody.toLowerCase();
  const title =
    extractMatch(htmlBody, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
    url.hostname.replace(/^www\./, "");
  const description =
    extractMatch(htmlBody, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) ||
    extractMatch(htmlBody, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);

  const signals = [
    {
      label: "Clear page title",
      passed: title.length >= 18 && title.length <= 70,
      detail:
        title.length >= 18 && title.length <= 70
          ? "A usable title was found."
          : "The title may be missing, vague, or too long.",
    },
    {
      label: "Useful meta description",
      passed: description.length >= 70 && description.length <= 180,
      detail:
        description.length >= 70 && description.length <= 180
          ? "The homepage has a descriptive summary."
          : "Add a concise product and audience description.",
    },
    {
      label: "Structured data",
      passed: /application\/ld\+json/.test(lower),
      detail: /application\/ld\+json/.test(lower)
        ? "Machine-readable structured data was detected."
        : "No JSON-LD structured data was detected.",
    },
    {
      label: "FAQ signal",
      passed: /faq|frequently asked/.test(lower),
      detail: /faq|frequently asked/.test(lower)
        ? "FAQ content or navigation was detected."
        : "No clear FAQ signal was detected.",
    },
    {
      label: "Documentation signal",
      passed: /docs|documentation|developer portal|api reference/.test(lower),
      detail: /docs|documentation|developer portal|api reference/.test(lower)
        ? "Docs or developer material was detected."
        : "No obvious documentation link was detected.",
    },
    {
      label: "Canonical URL",
      passed: /rel=["']canonical["']/.test(lower),
      detail: /rel=["']canonical["']/.test(lower)
        ? "A canonical URL was detected."
        : "No canonical URL was detected.",
    },
  ];

  let robotsText = "";
  try {
    const robotsResponse = await fetch(new URL("/robots.txt", url), {
      headers: { "user-agent": "molthub-free-geo-scan/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(5_000),
    });
    if (robotsResponse.ok) {
      robotsText = (await robotsResponse.text()).slice(0, 100_000);
    }
  } catch {
    robotsText = "";
  }

  const blocksSearchBot = isCrawlerBlocked(robotsText, "OAI-SearchBot");
  signals.push({
    label: "AI search crawler access",
    passed: !blocksSearchBot,
    detail: !robotsText
      ? "No blocking rule was detected in the quick check."
      : blocksSearchBot
        ? "robots.txt may block AI search discovery."
        : "No obvious OAI-SearchBot block was detected.",
  });

  const passedCount = signals.filter((s) => s.passed).length;
  const score = Math.round((passedCount / signals.length) * 100);
  const projectName =
    (title.split(/[|\-—]/)[0] || "").trim() || url.hostname.replace(/^www\./, "");
  const actions = signals.filter((s) => !s.passed).slice(0, 3).map((s) => s.detail);
  const fallbackActions = [
    "Create a comparison page for a high-intent competitor query.",
    "Publish a concise fact block covering product category, users, networks, and custody model.",
    "Retest the same buyer-intent prompts across multiple AI platforms.",
  ];
  while (actions.length < 3) actions.push(fallbackActions[actions.length]);

  const verdict =
    score >= 80 ? "Strong technical foundation" : score >= 55 ? "Visible gaps worth fixing" : "Weak AI-search readiness";

  return {
    website: url.origin,
    projectName,
    title,
    description,
    category: null,
    score,
    verdict,
    signals,
    prompts: buildPrompts(projectName, "Web3 SaaS"),
    actions,
  };
}

/* ------------------------------------------------------------------ */
/* Route handlers                                                      */
/* ------------------------------------------------------------------ */

/** POST /api/free-scan — free tier, returns DeepSeek aiSummary */
async function handleFreeScan(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const websiteValue = typeof payload.website === "string" ? payload.website : "";
  const category = (typeof payload.category === "string" ? payload.category : "").trim() || "Web3 SaaS";
  const anonymousId = typeof payload.anonymousId === "string" ? payload.anonymousId.slice(0, 100) : null;

  let url;
  try {
    url = normalizeWebsite(websiteValue);
  } catch (e) {
    return json({ error: e.message }, 400);
  }

  let scan;
  try {
    scan = await scanWebsite(url);
  } catch (e) {
    return json({ error: e.message || "The scan could not be completed." }, 400);
  }
  scan.category = category;

  const passedCount = scan.signals.filter((s) => s.passed).length;
  const failedSignals = scan.signals.filter((s) => !s.passed).map((s) => `${s.label}: ${s.detail}`);

  // DeepSeek AI summary (free-tier preview).
  let aiSummary = null;
  let deepseekOk = false;
  let deepseekError = null;
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a Web3 AI-search visibility analyst. You assess how likely AI search systems (ChatGPT, Perplexity, Gemini, Claude) are to discover, understand, and cite a project. Be specific and honest. Avoid hype and disclaimers. Answer in plain prose, no markdown headings.",
      },
      {
        role: "user",
        content:
          `Project name: ${scan.projectName}\n` +
          `Website: ${scan.website}\n` +
          `Category: ${category}\n` +
          `Homepage title: ${scan.title}\n` +
          `Meta description: ${scan.description || "(none found)"}\n` +
          `Readiness score: ${scan.score}/100 (${scan.verdict})\n` +
          `Passed signals: ${passedCount}/${scan.signals.length}\n` +
          `Gaps found:\n${failedSignals.length ? failedSignals.map((g) => "- " + g).join("\n") : "- none"}\n\n` +
          `Write a concise 2-3 sentence AI-visibility summary for this project. State whether AI search would likely surface it today, and name the single highest-impact gap to fix first. Plain text only.`,
      },
    ];
    aiSummary = (await deepSeekChat(env, messages, { maxTokens: 320 })).trim();
    if (aiSummary) deepseekOk = true;
  } catch (e) {
    deepseekError = e.message || String(e);
  }

  // Fallback so the field is never null even if DeepSeek is down, but flag it.
  if (!aiSummary) {
    aiSummary =
      `${scan.projectName} scores ${scan.score}/100 on AI-search readiness (${scan.verdict}). ` +
      `Biggest gap to fix first: ${failedSignals[0] || "strengthen the homepage's machine-readable facts"}. ` +
      `(AI summary unavailable.)`;
  }

  await recordProductEvent(env, {
    name: "preview_completed",
    anonymousId,
    metadata: { website: url.hostname, category, score: scan.score, deepseek: deepseekOk ? "ok" : "fallback" },
  });

  return json({
    preview: true,
    website: scan.website,
    projectName: scan.projectName,
    category,
    score: scan.score,
    verdict: scan.verdict,
    signals: scan.signals,
    prompts: scan.prompts,
    actions: scan.actions,
    aiSummary,
    deepseek: { ok: deepseekOk, error: deepseekError },
    note:
      "This free scan checks website readiness signals and returns a DeepSeek AI summary. It does not query paid AI platforms or guarantee mentions.",
  });
}

/** GET /api/orders — list the signed-in user's orders */
async function handleOrdersGet(request, env) {
  const user = await getRequestUser(request, env);
  if (!user) return json({ error: "Sign in required." }, 401);
  if (!sbConfigured(env)) return json({ error: "Payment storage is not configured." }, 503);

  const now = new Date().toISOString();
  await sbRequest(env, "PATCH", "orders", {
    params: { user_id: `eq.${user.id}`, status: "eq.pending", expires_at: `lte.${now}` },
    body: { status: "expired" },
  });

  const res = await sbRequest(env, "GET", "orders", {
    params: {
      select:
        "id,plan_id,plan_name,amount_usdt,network,token_standard,status,payment_txid,project_name,website,expires_at,paid_at,created_at",
      user_id: `eq.${user.id}`,
      order: "created_at.desc",
      limit: "10",
    },
  });
  if (!res.ok) return json({ error: storageError(res.error) }, 500);
  return json({ orders: res.data || [] });
}

/** POST /api/orders — create a 2.99 USDT-TRC20 order (paid tier) */
async function handleOrdersPost(request, env) {
  const user = await getRequestUser(request, env);
  if (!user) return json({ error: "Sign in required." }, 401);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const planId = typeof payload.planId === "string" ? payload.planId : "";
  const plan = PLANS[planId] || null;
  const projectName = typeof payload.projectName === "string" ? payload.projectName.trim() : "";
  const category = typeof payload.category === "string" ? payload.category.trim() : "";
  const websiteValue = typeof payload.website === "string" ? payload.website.trim() : "";

  if (!plan) return json({ error: "Select a valid molthub plan." }, 400);
  if (!projectName || !websiteValue || !category) {
    return json({ error: "Project name, category, and website are required." }, 400);
  }

  let website;
  try {
    website = new URL(websiteValue.includes("://") ? websiteValue : `https://${websiteValue}`);
    if (!["http:", "https:"].includes(website.protocol)) throw new Error("Invalid protocol");
  } catch {
    return json({ error: "Enter a valid public website URL." }, 400);
  }

  if (!sbConfigured(env)) return json({ error: "Payment storage is not configured." }, 503);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + ORDER_HOURS * 60 * 60 * 1000);

  // Reuse an existing pending order for the same plan + website.
  const existing = await sbRequest(env, "GET", "orders", {
    params: {
      select: "*",
      user_id: `eq.${user.id}`,
      plan_id: `eq.${plan.id}`,
      website: `eq.${website.origin}`,
      status: "eq.pending",
      expires_at: `gt.${now.toISOString()}`,
      order: "created_at.desc",
      limit: "1",
    },
  });
  if (existing.ok && Array.isArray(existing.data) && existing.data.length) {
    return json({ order: existing.data[0], reused: true });
  }

  const insertRes = await sbRequest(env, "POST", "orders", {
    body: {
      user_id: user.id,
      user_email: user.email || null,
      plan_id: plan.id,
      plan_name: plan.name,
      amount_usdt: plan.amount,
      network: TRON_NETWORK,
      token_standard: USDT_STANDARD,
      receiving_address: USDT_TRC20_WALLET,
      token_contract: USDT_TRC20_CONTRACT,
      status: "pending",
      project_name: projectName,
      website: website.origin,
      category,
      expires_at: expiresAt.toISOString(),
    },
  });
  if (!insertRes.ok || !insertRes.data || !insertRes.data.length) {
    return json({ error: storageError(insertRes.error) }, 500);
  }
  const order = insertRes.data[0];

  await recordProductEvent(env, {
    name: "payment_order_created",
    userId: user.id,
    metadata: { orderId: order.id, planId: plan.id, amount: plan.amount },
  });

  return json({ order }, 201);
}

/** POST /api/orders/verify — USDT-TRC20 on-chain verification */
async function handleVerifyPost(request, env) {
  const user = await getRequestUser(request, env);
  if (!user) return json({ error: "Sign in required." }, 401);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const orderId = typeof payload.orderId === "string" ? payload.orderId.trim() : "";
  const txid = typeof payload.txid === "string" ? payload.txid.trim() : "";
  if (!orderId || !txid) {
    return json({ error: "Order ID and transaction ID are required." }, 400);
  }
  if (!sbConfigured(env)) return json({ error: "Payment storage is not configured." }, 503);

  const orderRes = await sbRequest(env, "GET", "orders", {
    params: { select: "*", id: `eq.${orderId}`, user_id: `eq.${user.id}`, limit: "1" },
  });
  if (!orderRes.ok) return json({ error: orderRes.error ? orderRes.error.message : "Lookup failed." }, 500);
  const order = Array.isArray(orderRes.data) ? orderRes.data[0] : null;
  if (!order) return json({ error: "Order not found." }, 404);

  if (order.status === "paid") return json({ order, verified: true });
  if (order.status !== "pending") return json({ error: `This order is ${order.status}.` }, 409);
  if (new Date(order.expires_at).getTime() <= Date.now()) {
    const upd = await sbRequest(env, "PATCH", "orders", {
      params: { id: `eq.${order.id}`, status: "eq.pending" },
      body: { status: "expired" },
    });
    return json({ error: "This order expired. Create a new order.", order: (upd.data || [])[0] || null }, 409);
  }

  const dupRes = await sbRequest(env, "GET", "orders", {
    params: { select: "id", payment_txid: `eq.${txid}`, limit: "1" },
  });
  if (dupRes.ok && Array.isArray(dupRes.data) && dupRes.data.length) {
    return json({ error: "This transaction ID has already been used for another order." }, 409);
  }

  const plan = PLANS[order.plan_id] || null;
  if (!plan || String(order.amount_usdt) !== plan.amount) {
    return json({ error: "Order amount could not be validated." }, 409);
  }

  const verification = await verifyConfirmedUsdtPayment(txid, plan.amount);
  if (!verification.ok) {
    await sbRequest(env, "PATCH", "orders", {
      params: { id: `eq.${order.id}`, status: "eq.pending" },
      body: { last_verification_error: verification.code },
    });
    return json(
      { error: verification.message, code: verification.code },
      verification.code === "provider_error" ? 502 : 422
    );
  }

  const paidAt = verification.receivedAt || new Date().toISOString();
  const updRes = await sbRequest(env, "PATCH", "orders", {
    params: { id: `eq.${order.id}`, status: "eq.pending" },
    body: {
      status: "paid",
      payment_txid: verification.txid,
      payment_from: verification.from || null,
      paid_at: paidAt,
      last_verification_error: null,
    },
  });
  if (!updRes.ok) {
    if (updRes.error && updRes.error.code === "23505") {
      return json({ error: "This transaction ID has already been used for another order." }, 409);
    }
    return json({ error: updRes.error ? updRes.error.message : "Update failed." }, 500);
  }
  const paidOrder = (updRes.data || [])[0] || null;

  await recordProductEvent(env, {
    name: "payment_confirmed",
    userId: user.id,
    metadata: { orderId: order.id, planId: plan.id, amount: plan.amount },
  });

  return json({ order: paidOrder, verified: true });
}

/** GET /api/report — DeepSeek AI visibility report, gated behind a paid order */
async function handleReportGet(request, env) {
  const user = await getRequestUser(request, env);
  if (!user) return json({ error: "Sign in required." }, 401);
  if (!sbConfigured(env)) return json({ error: "Payment storage is not configured." }, 503);

  const url = new URL(request.url);
  const orderId = (url.searchParams.get("orderId") || "").trim();

  let order = null;
  if (orderId) {
    const r = await sbRequest(env, "GET", "orders", {
      params: { select: "*", id: `eq.${orderId}`, user_id: `eq.${user.id}`, limit: "1" },
    });
    if (r.ok) order = (r.data || [])[0] || null;
  } else {
    // most recent paid order
    const r = await sbRequest(env, "GET", "orders", {
      params: {
        select: "*",
        user_id: `eq.${user.id}`,
        status: "eq.paid",
        order: "paid_at.desc",
        limit: "1",
      },
    });
    if (r.ok) order = (r.data || [])[0] || null;
  }

  if (!order) return json({ error: "No paid order found for this account." }, 404);
  if (order.status !== "paid") {
    return json({ error: `This order is ${order.status}. Pay first to unlock the report.` }, 402);
  }

  const plan = PLANS[order.plan_id] || { name: order.plan_name, amount: String(order.amount_usdt) };

  // Gather fresh signals from the project website (best-effort).
  let siteContext = "";
  try {
    const scan = await scanWebsite(new URL(order.website));
    const failed = scan.signals.filter((s) => !s.passed).map((s) => `- ${s.label}: ${s.detail}`);
    siteContext =
      `Homepage title: ${scan.title}\n` +
      `Meta description: ${scan.description || "(none)"}\n` +
      `Readiness score: ${scan.score}/100 (${scan.verdict})\n` +
      `Gaps:\n${failed.length ? failed.join("\n") : "- none"}`;
  } catch (e) {
    siteContext = `Website scan unavailable: ${e.message || e}`;
  }

  let report = null;
  let deepseekOk = false;
  let deepseekError = null;
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are a senior Web3 GEO (AI-search visibility) analyst. You produce structured, evidence-led reports in JSON only. Be specific, name competitor archetypes, and prioritize concrete actions. Do not invent fake metrics; where unsure, say so.",
      },
      {
        role: "user",
        content:
          `Produce an AI visibility report for this Web3 project.\n\n` +
          `Project name: ${order.project_name}\n` +
          `Website: ${order.website}\n` +
          `Category: ${order.category || "Web3 SaaS"}\n` +
          `Plan: ${plan.name} (${plan.amount} USDT)\n\n` +
          `Live website signals:\n${siteContext}\n\n` +
          `Return STRICT JSON with this exact shape:\n` +
          `{\n` +
          `  "verdict": "string — one-line overall assessment",\n` +
          `  "visibilityScore": number 0-100 estimating how visible this project is in AI search today,\n` +
          `  "promptResults": "string — which buyer-intent prompts surface the project and which do not, with archetypes of prompts that miss it",\n` +
          `  "competitorGap": "string — who gets recommended first and why (positioning, content, authority signals)",\n` +
          `  "factSourceCheck": "string — what AI likely misunderstands or cannot verify (product, token, networks, custody, claims)",\n` +
          `  "actionPlan": "string — prioritized, concrete actions ordered by impact, 4-6 items",\n` +
          `  "retestPrompts": ["array of 3-5 specific prompts to retest after fixes"]\n` +
          `}`,
      },
    ];
    const raw = await deepSeekChat(env, messages, { json: true, maxTokens: 1600 });
    report = JSON.parse(raw);
    deepseekOk = true;
  } catch (e) {
    deepseekError = e.message || String(e);
  }

  return json({
    order: {
      id: order.id,
      plan_id: order.plan_id,
      plan_name: order.plan_name,
      amount_usdt: order.amount_usdt,
      status: order.status,
      project_name: order.project_name,
      website: order.website,
      category: order.category,
      paid_at: order.paid_at,
    },
    report,
    deepseek: { ok: deepseekOk, error: deepseekError },
    note: deepseekOk
      ? "Report generated by DeepSeek."
      : "Report generation failed. Please retry shortly.",
  });
}

/* ------------------------------------------------------------------ */
/* HTML pages (inline CSS, no assets)                                  */
/* ------------------------------------------------------------------ */

function renderShell(title, bodyContent, extraHead = "") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="molthub — Web3 AI search visibility. Free scan + USDT-TRC20 AI visibility reports.">
<style>
:root{
  --bg:#0a0d12; --panel:#11161f; --panel2:#161d29; --line:#22303f;
  --text:#e7ecf3; --muted:#93a1b4; --gold:#f5b942; --blue:#4f9bff; --green:#3ddc97; --red:#ff6b6b;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--text);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
a{color:var(--blue);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:1080px;margin:0 auto;padding:0 20px}
header.nav{position:sticky;top:0;z-index:10;background:rgba(10,13,18,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav__inner{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-weight:700;letter-spacing:.5px;color:var(--text)}
.brand b{color:var(--gold)}
.nav__links a{margin-left:18px;color:var(--muted);font-size:14px}
.nav__links a:hover{color:var(--text)}
.hero{padding:72px 0 48px;border-bottom:1px solid var(--line);background:radial-gradient(900px 400px at 80% -10%,rgba(79,155,255,.12),transparent),radial-gradient(700px 360px at 0% 0%,rgba(245,185,66,.10),transparent)}
.eyebrow{color:var(--gold);font-size:13px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin:0 0 10px}
h1{font-size:44px;line-height:1.1;margin:0 0 16px}
h1 .blue{color:var(--blue)}
h2{font-size:26px;margin:0 0 12px}
.lead{color:var(--muted);font-size:18px;max-width:640px;margin:0 0 24px}
.btn{display:inline-block;padding:12px 20px;border-radius:10px;font-weight:600;border:1px solid transparent;cursor:pointer;font-size:15px}
.btn--gold{background:var(--gold);color:#1a1305}
.btn--ghost{background:transparent;border-color:var(--line);color:var(--text)}
.section{padding:56px 0;border-bottom:1px solid var(--line)}
.grid{display:grid;gap:20px}
.grid--3{grid-template-columns:repeat(3,1fr)}
.grid--2{grid-template-columns:repeat(2,1fr)}
@media(max-width:820px){.grid--3,.grid--2{grid-template-columns:1fr} h1{font-size:32px}}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px}
.card h3{margin:0 0 8px;font-size:18px}
.card p{margin:0;color:var(--muted)}
.plan__price{color:var(--gold);font-weight:700;font-size:22px}
.tag{display:inline-block;font-size:12px;color:var(--green);border:1px solid rgba(61,220,151,.3);padding:2px 8px;border-radius:999px;margin-bottom:10px}
form.field label{display:block;font-size:13px;color:var(--muted);margin:12px 0 6px}
input,select,textarea{width:100%;background:var(--panel2);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:11px 12px;font:inherit}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--blue)}
.row{display:flex;gap:10px;flex-wrap:wrap}
.row>*{flex:1;min-width:160px}
.result{margin-top:18px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:20px}
.result h3{margin-top:0}
.ai-summary{background:rgba(79,155,255,.08);border:1px solid rgba(79,155,255,.25);border-radius:12px;padding:16px;margin:14px 0}
.ai-summary .label{color:var(--blue);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.score{font-size:40px;font-weight:800;color:var(--gold)}
.muted{color:var(--muted)}
.signal{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px dashed var(--line)}
.signal:last-child{border-bottom:0}
.sig-ok{color:var(--green)} .sig-bad{color:var(--red)}
.payment{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px}
.warn{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.3);border-radius:10px;padding:10px 14px;color:#ffd2d2;font-size:14px}
code{background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:2px 6px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;word-break:break-all}
.msg{margin-top:12px;padding:10px 14px;border-radius:10px;font-size:14px}
.msg--err{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.3);color:#ffd2d2}
.msg--ok{background:rgba(61,220,151,.1);border:1px solid rgba(61,220,151,.3);color:#bff3df}
footer{padding:36px 0;color:var(--muted);font-size:14px;border-top:1px solid var(--line)}
.hidden{display:none}
</style>
${extraHead}
</head>
<body>
<header class="nav"><div class="container nav__inner">
  <a class="brand" href="/">mol<b>thub</b></a>
  <nav class="nav__links">
    <a href="/#free-scan">Free scan</a>
    <a href="/checkout">Checkout</a>
    <a href="/#plans">Plans</a>
  </nav>
</div></header>
${bodyContent}
<footer><div class="container">© molthub — Web3 AI search visibility. USDT-TRC20 accepted. No rankings guaranteed.</div></footer>
</body>
</html>`;
}

function homePage() {
  const body = `
<main>
  <section class="hero">
    <div class="container">
      <p class="eyebrow">Web3 GEO · AI Search Visibility</p>
      <h1>Make your Web3 project <span class="blue">visible in AI search</span></h1>
      <p class="lead">Hands-on GEO audits and implementation for early-stage Web3 teams. Run a free scan with a DeepSeek AI summary, then unlock a full AI visibility report for 2.99 USDT.</p>
      <div class="row" style="margin-top:8px">
        <a class="btn btn--gold" href="#free-scan">Run free scan</a>
        <a class="btn btn--ghost" href="/checkout">View checkout</a>
      </div>
    </div>
  </section>

  <section class="section" id="free-scan">
    <div class="container">
      <p class="eyebrow">Free automated preview</p>
      <h2>Check your website’s AI-search readiness</h2>
      <p class="muted">Instant · no card · returns a DeepSeek AI summary.</p>
      <form class="field" id="scan-form" style="margin-top:18px;max-width:640px">
        <label for="website">Project website</label>
        <input id="website" name="website" placeholder="https://yourproject.xyz" required>
        <label for="category">Category</label>
        <select id="category" name="category">
          <option>Web3 SaaS</option>
          <option>Stablecoin payments</option>
          <option>Crypto payment infrastructure</option>
          <option>Web3 wallet</option>
          <option>Developer tools</option>
          <option>On-chain data</option>
          <option>Infrastructure</option>
          <option>Other</option>
        </select>
        <div style="margin-top:16px"><button class="btn btn--gold" type="submit" id="scan-btn">Run free scan</button></div>
      </form>
      <div id="scan-result" class="hidden"></div>
    </div>
  </section>

  <section class="section" id="plans">
    <div class="container">
      <p class="eyebrow">Start small, upgrade when useful</p>
      <h2>Plans</h2>
      <div class="grid grid--3" style="margin-top:18px">
        <div class="card"><span class="tag">Free</span><h3>Free scan</h3><p class="plan__price">$0</p><p>Readiness signals + DeepSeek AI summary.</p></div>
        <div class="card"><span class="tag">2.99 USDT</span><h3>Instant Visibility Report</h3><p class="plan__price">2.99 USDT</p><p>USDT-TRC20 on-chain verify → DeepSeek AI visibility report.</p><p style="margin-top:12px"><a class="btn btn--gold" href="/checkout?plan=trial">Start 2.99 plan</a></p></div>
        <div class="card"><span class="tag">Expert</span><h3>Done-for-You GEO Sprint</h3><p class="plan__price">999 USDT</p><p>Expert research + implementation.</p></div>
      </div>
    </div>
  </section>
</main>
<script>
const f=document.getElementById('scan-form');
const out=document.getElementById('scan-result');
const btn=document.getElementById('scan-btn');
f.addEventListener('submit',async(e)=>{
  e.preventDefault();
  btn.disabled=true; btn.textContent='Scanning…'; out.className='hidden';
  try{
    const r=await fetch('/api/free-scan',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({website:document.getElementById('website').value,category:document.getElementById('category').value})});
    const d=await r.json();
    if(!r.ok){out.className='msg msg--err';out.textContent=d.error||'Scan failed';return;}
    const sigs=(d.signals||[]).map(s=>'<div class="signal"><span>'+s.label+'</span><span class="'+(s.passed?'sig-ok':'sig-bad')+'">'+(s.passed?'✓':'✗')+' '+s.detail+'</span></div>').join('');
    out.className='result';
    out.innerHTML='<h3>'+d.projectName+' — <span class="muted">'+d.website+'</span></h3>'+
      '<div class="score">'+d.score+'/100</div><p class="muted">'+d.verdict+'</p>'+
      '<div class="ai-summary"><div class="label">AI summary (DeepSeek)</div><p>'+(d.aiSummary||'').replace(/</g,'&lt;')+'</p></div>'+
      (sigs?'<h3 style="margin-top:18px">Signals</h3>'+sigs:'')+
      (d.actions&&d.actions.length?'<h3 style="margin-top:18px">Top actions</h3><ul>'+(d.actions.map(a=>'<li>'+a+'</li>').join(''))+'</ul>':'')+
      '<p class="muted" style="margin-top:14px">DeepSeek: '+(d.deepseek&&d.deepseek.ok?'✓ active':(d.deepseek&&d.deepseek.error?('fallback — '+d.deepseek.error):'fallback'))+'</p>'+
      '<p style="margin-top:14px"><a class="btn btn--gold" href="/checkout?plan=trial">Unlock full report — 2.99 USDT</a></p>';
  }catch(err){out.className='msg msg--err';out.textContent='Network error: '+err;}
  finally{btn.disabled=false;btn.textContent='Run free scan';}
});
</script>`;
  return html(renderShell("molthub — Web3 AI Search Visibility", body));
}

function checkoutPage(currentUrl, env) {
  const params = currentUrl.searchParams;
  const plan = params.get("plan") || "trial";
  const projectName = params.get("projectName") || "";
  const website = params.get("website") || "";
  const category = params.get("category") || "Web3 SaaS";
  const body = `
<main>
  <section class="hero">
    <div class="container">
      <p class="eyebrow">USDT-TRC20 checkout</p>
      <h2>Pay with USDT on TRON</h2>
      <p class="lead">Sign in, create an order, send USDT-TRC20, verify the confirmed transaction on-chain, then generate your DeepSeek AI visibility report. No wallet connection or custody required.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid--2">
        <div class="card">
          <p class="eyebrow">Step 1 · Sign in</p>
          <h3>Account</h3>
          <form class="field" id="auth-form">
            <label for="email">Email</label>
            <input id="email" type="email" required>
            <label for="password">Password</label>
            <input id="password" type="password" required minlength="6">
            <div class="row" style="margin-top:16px">
              <button class="btn btn--gold" type="submit" id="signin-btn">Sign in</button>
              <button class="btn btn--ghost" type="button" id="signup-btn">Create account</button>
            </div>
          </form>
          <div id="auth-msg"></div>
        </div>

        <div class="card">
          <p class="eyebrow">Step 2 · Create order</p>
          <h3 id="order-title">Sign in to create an order</h3>
          <form class="field" id="order-form">
            <label for="planId">Plan</label>
            <select id="planId">
              <option value="trial">2.99 USDT — Instant Visibility Report</option>
              <option value="baseline">59 USDT — Verified GEO Baseline</option>
              <option value="audit">299 USDT — Expert Web3 GEO Audit</option>
              <option value="sprint">999 USDT — Done-for-You GEO Sprint</option>
            </select>
            <label for="projectName">Project name</label>
            <input id="projectName" required>
            <label for="website">Website</label>
            <input id="website" placeholder="https://yourproject.xyz" required>
            <label for="category">Category</label>
            <select id="category">
              <option>Web3 SaaS</option><option>Stablecoin payments</option>
              <option>Crypto payment infrastructure</option><option>Web3 wallet</option>
              <option>Developer tools</option><option>On-chain data</option>
              <option>Infrastructure</option><option>Other</option>
            </select>
            <div style="margin-top:16px"><button class="btn btn--gold" type="submit" id="order-btn" disabled>Create order</button></div>
          </form>
          <div id="order-msg"></div>
        </div>
      </div>

      <div class="payment hidden" id="pay-panel" style="margin-top:20px">
        <p class="eyebrow">Step 3 · Pay & verify</p>
        <div class="row" style="align-items:center;justify-content:space-between">
          <h3 id="pay-title">Send USDT</h3>
          <span id="pay-status" class="tag">Pending</span>
        </div>
        <div class="warn" style="margin:12px 0"><strong>USDT · TRC20 only.</strong> Do not use Ethereum, BNB Chain, Solana, or any other network. Funds sent on the wrong network may be lost.</div>
        <div id="pay-details"></div>
        <form class="field" id="verify-form" style="margin-top:14px">
          <label for="txid">TRON transaction ID (TXID, 64 characters)</label>
          <input id="txid" placeholder="64-character transaction ID" minlength="64" maxlength="64" required>
          <div style="margin-top:12px"><button class="btn btn--gold" type="submit" id="verify-btn">Verify payment</button></div>
        </form>
        <div id="verify-msg"></div>
      </div>

      <div class="payment hidden" id="paid-panel" style="margin-top:20px">
        <p class="eyebrow">Payment confirmed</p>
        <h3 id="paid-title">USDT received</h3>
        <div id="paid-details"></div>
        <p style="margin-top:14px"><a class="btn btn--gold" id="report-link" href="#">Generate DeepSeek AI report</a></p>
        <div id="report-msg"></div>
        <pre id="report-out" class="hidden" style="margin-top:14px;background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:14px;overflow:auto;font-size:13px"></pre>
      </div>
    </div>
  </section>
</main>
<script>
const AUTH_BASE=window.__SUPABASE_URL__||'';
const ANON=window.__SUPABASE_ANON__||'';
let token=null, user=null, currentOrder=null;

function setMsg(id,txt,ok){const e=document.getElementById(id);if(!e)return;e.className='msg '+(ok?'msg--ok':'msg--err');e.textContent=txt||'';}
function qp(){const p=new URLSearchParams(location.search);return{plan:p.get('plan')||'trial',projectName:p.get('projectName')||'',website:p.get('website')||'',category:p.get('category')||'Web3 SaaS'};}

function init(){const q=qp();document.getElementById('planId').value=q.plan;document.getElementById('projectName').value=q.projectName;document.getElementById('website').value=q.website;document.getElementById('category').value=q.category;}
init();

async function auth(mode){
  const email=document.getElementById('email').value, password=document.getElementById('password').value;
  const path=mode==='signup'?'signup':'token?grant_type=password';
  const r=await fetch(AUTH_BASE+'/auth/v1/'+path,{method:'POST',headers:{'apikey':ANON,'Authorization':'Bearer '+ANON,'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const d=await r.json();
  if(!r.ok){setMsg('auth-msg',d.error_description||d.msg||d.message||'Auth failed',false);return;}
  token=d.access_token; user=d.user||null;
  document.getElementById('order-btn').disabled=false;
  document.getElementById('order-title').textContent='Create '+(document.getElementById('planId').selectedOptions[0].textContent.split(' — ')[0])+' order';
  setMsg('auth-msg','Signed in as '+(user&&user.email||email),true);
  loadOrders();
}
document.getElementById('signin-btn').onclick=(e)=>{e.preventDefault();auth('signin');};
document.getElementById('signup-btn').onclick=(e)=>{e.preventDefault();auth('signup');};

async function loadOrders(){
  try{
    const r=await fetch('/api/orders',{headers:{authorization:'Bearer '+token}});
    const d=await r.json();
    if(r.ok&&d.orders){const active=d.orders.find(o=>['pending','paid'].includes(o.status));if(active)showOrder(active);}
  }catch(_){}
}

document.getElementById('order-form').addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(!token){setMsg('order-msg','Sign in first.',false);return;}
  const btn=document.getElementById('order-btn');btn.disabled=true;btn.textContent='Creating…';
  try{
    const r=await fetch('/api/orders',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({planId:document.getElementById('planId').value,projectName:document.getElementById('projectName').value,website:document.getElementById('website').value,category:document.getElementById('category').value})});
    const d=await r.json();
    if(!r.ok||!d.order){setMsg('order-msg',d.error||'Order failed',false);return;}
    setMsg('order-msg','Order '+(d.reused?'reused':'created')+'.',true);
    showOrder(d.order);
  }catch(err){setMsg('order-msg','Network error: '+err,false);}
  finally{btn.disabled=false;btn.textContent='Create order';}
});

function showOrder(o){
  currentOrder=o;
  const panel=document.getElementById('pay-panel');
  if(o.status==='paid'){panel.className='payment hidden';showPaid(o);return;}
  panel.className='payment';
  document.getElementById('pay-status').textContent=o.status;
  document.getElementById('pay-title').textContent='Send exactly '+o.amount_usdt+' USDT';
  document.getElementById('pay-details').innerHTML=
    '<div class="grid grid--2">'+
    '<div><label>Receiving address</label><code>'+o.receiving_address+'</code></div>'+
    '<div><label>Network / token</label><code>'+o.network+' · USDT-'+o.token_standard+'</code></div>'+
    '<div><label>Amount</label><code>'+o.amount_usdt+' USDT</code></div>'+
    '<div><label>Expires</label><code>'+new Date(o.expires_at).toLocaleString()+'</code></div>'+
    '</div><p class="muted" style="margin-top:10px">Official USDT contract: <code>'+o.token_contract+'</code></p>';
}

document.getElementById('verify-form').addEventListener('submit',async(e)=>{
  e.preventDefault();
  if(!currentOrder)return;
  const btn=document.getElementById('verify-btn');btn.disabled=true;btn.textContent='Checking…';
  try{
    const r=await fetch('/api/orders/verify',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({orderId:currentOrder.id,txid:document.getElementById('txid').value})});
    const d=await r.json();
    if(!r.ok||!d.order){setMsg('verify-msg',d.error||'Verification failed',false);return;}
    setMsg('verify-msg','Payment confirmed on-chain.',true);
    showOrder(d.order);
  }catch(err){setMsg('verify-msg','Network error: '+err,false);}
  finally{btn.disabled=false;btn.textContent='Verify payment';}
});

function showPaid(o){
  document.getElementById('paid-panel').className='payment';
  document.getElementById('paid-title').textContent=o.amount_usdt+' USDT received';
  document.getElementById('paid-details').innerHTML='<p>Order: <code>'+o.id+'</code></p><p>Plan: '+o.plan_name+'</p><p>TXID: <code>'+(o.payment_txid||'')+'</code></p>';
  const link=document.getElementById('report-link');link.href='/api/report?orderId='+o.id+'&download=1';
}

document.getElementById('report-link').addEventListener('click',async(e)=>{
  e.preventDefault();
  if(!currentOrder)return;
  const pre=document.getElementById('report-out');const msg=document.getElementById('report-msg');
  pre.className='hidden';msg.className='muted';msg.textContent='Generating DeepSeek AI report…';
  try{
    const r=await fetch('/api/report?orderId='+currentOrder.id,{headers:{authorization:'Bearer '+token}});
    const d=await r.json();
    if(!r.ok){msg.className='msg msg--err';msg.textContent=d.error||'Report failed';return;}
    msg.className='muted';msg.textContent=d.note||'';
    pre.className='';pre.textContent=JSON.stringify(d.report,null,2);
  }catch(err){msg.className='msg msg--err';msg.textContent='Network error: '+err;}
});
</script>`;
  // Expose public Supabase config (URL + anon key are safe to expose; service key never is).
  const cfg = `window.__SUPABASE_URL__=${JSON.stringify(sbUrl(env))};window.__SUPABASE_ANON__=${JSON.stringify(sbAnonKey(env))};`;
  const extraHead = `\n<script>${cfg}<\/script>`;
  return html(renderShell("USDT-TRC20 Checkout | molthub", body, extraHead));
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "authorization, content-type",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
      });
    }

    try {
      if (method === "GET" && (path === "/" || path === "")) return homePage();
      if (method === "GET" && path === "/checkout") return checkoutPage(url, env);
      if (method === "GET" && path === "/health") return json({ ok: true, ts: Date.now() });
      if (method === "POST" && path === "/api/free-scan") return handleFreeScan(request, env);
      if (method === "GET" && path === "/api/orders") return handleOrdersGet(request, env);
      if (method === "POST" && path === "/api/orders") return handleOrdersPost(request, env);
      if (method === "POST" && path === "/api/orders/verify") return handleVerifyPost(request, env);
      if (method === "GET" && path === "/api/report") return handleReportGet(request, env);
      return notFound();
    } catch (e) {
      return json({ error: "Internal error", detail: String((e && e.message) || e) }, 500);
    }
  },
};
