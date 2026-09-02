import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the molthub homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>molthub — Web3 AI Search Visibility<\/title>/i);
  assert.match(html, /Make Your Web3 Project/);
  assert.match(html, /Visible in AI Search/);
  assert.match(html, /molthub-ai-visibility-hero\.png/);
  assert.match(html, /molthub-hero-loop\.mp4/);
  assert.match(html, /autoPlay=""[^>]*loop=""[^>]*playsInline=""/);
  assert.match(html, /Run Free Scan/);
  assert.match(html, /Five Clear Ways to Work With molthub/);
  assert.match(html, /9\.99 USDT/);
  assert.match(html, /59 USDT/);
  assert.match(html, /299 USDT/);
  assert.match(html, /999 USDT/);
  assert.doesNotMatch(html, /Selected Web3 GEO Work/);
  assert.doesNotMatch(html, /CaseStudyCard/);
  assert.match(html, /Start at 9\.99 USDT/);
  assert.match(html, /Operating legally in a market with tighter advertising rules/);
  assert.match(html, /href="\/regulated-industries"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("server-renders the regulated industries page with clear compliance boundaries", async () => {
  const response = await render("/regulated-industries");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Organic and AI-search visibility, built for stricter markets/);
  assert.match(html, /Legal businesses only|Legal business/);
  assert.match(html, /No ad-policy evasion|evade review systems/);
  assert.match(html, /USDT-TRC20/);
  assert.match(html, /Cigar &amp; Tobacco Accessories/);
  assert.match(html, /Licensed Gaming/);
  assert.match(html, /Request an eligibility review/);
});

test("public pages do not present molthub as a trial or unfinished website", async () => {
  const pages = ["/", "/sample-report", "/case-studies"];
  const bannedCopy = [
    /Start the \$9\.99 Trial/i,
    /Run Free Preview/i,
    /Preview first/i,
    /Account access is being connected/i,
    /Illustrative workflow/i,
    /Illustrative report/i,
    /temporarily keeping this library empty/i,
    /No public cases yet/i,
  ];

  for (const pathname of pages) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const pattern of bannedCopy) assert.doesNotMatch(html, pattern);
  }
});

test("keeps the compact homepage structure and required visual asset", async () => {
  const [page, navigation] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/navigation.ts", import.meta.url), "utf8"),
    access(new URL("../public/molthub-ai-visibility-hero.png", import.meta.url)),
    access(new URL("../public/molthub-hero-loop.mp4", import.meta.url)),
  ]);

  assert.match(page, /id="method"/);
  assert.match(page, /id="services"/);
  assert.match(page, /id="about"/);
  assert.match(page, /id="free-scan"/);
  assert.match(page, /id="trial-order"/);
  assert.match(page, /id="service-order"/);
  assert.match(page, /id="free-review"/);
  assert.match(navigation, /\/methodology/);
  assert.doesNotMatch(navigation, /label: "Account"/);
  assert.doesNotMatch(navigation, /\/#how-it-works/);
});

test("publishes the molthub entity, methodology and transparent experiment pages", async () => {
  const routes = [
    ["/about", /What is molthub/],
    ["/methodology", /A repeatable process for Web3 AI-search visibility/],
    ["/research/self-geo-experiment", /First public observation completed/],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(await response.text(), expected);
  }
});

test("publishes five distinct Web3 evidence pages with metadata and direct answers", async () => {
  const routes = [
    ["/geo/web3-geo-services", /GEO services for Web3 startups/],
    ["/geo/stablecoin-geo", /GEO for stablecoin payment infrastructure/],
    ["/geo/crypto-payment-api-geo-audit", /GEO audit for crypto payment APIs/],
    ["/geo/affordable-web3-geo", /Affordable GEO for early-stage Web3 teams/],
    ["/geo/measure-web3-ai-visibility", /How to measure AI-search visibility for Web3/],
  ];

  for (const [pathname, expected] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, expected);
    assert.match(html, /Direct answer/);
    assert.match(html, /Evidence and sources/);
    assert.match(html, /What this page does not prove/);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://molthub.click${pathname}"`));
    assert.doesNotMatch(html, /noindex/i);
  }
});

test("includes every evidence page in the sitemap", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  for (const slug of ["web3-geo-services", "stablecoin-geo", "crypto-payment-api-geo-audit", "affordable-web3-geo", "measure-web3-ai-visibility"]) {
    assert.match(xml, new RegExp(`https://molthub.click/geo/${slug}`));
  }
});

test("labels static report metrics as sample data", async () => {
  const response = await render("/sample-report");
  const html = await response.text();
  assert.match(html, /SAMPLE DATA/);
});

test("does not claim an automated daily editorial schedule", async () => {
  for (const pathname of ["/", "/insights"]) {
    const response = await render(pathname);
    const html = await response.text();
    assert.doesNotMatch(html, /one new article (?:each|per) day/i);
  }
});

test("keeps transactional and account routes out of search results", async () => {
  for (const pathname of ["/account", "/checkout?plan=trial", "/signin"]) {
    const response = await render(pathname);
    const html = await response.text();
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/i);
  }
});

test("rejects private hosts in the public quick-scan endpoint", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `scan-${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/api/free-scan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ website: "http://127.0.0.1" }),
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  assert.equal(response.status, 400);
  assert.match(await response.text(), /public project website/i);
});
