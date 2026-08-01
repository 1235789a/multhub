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
  assert.match(html, /9\.9 USDT/);
  assert.match(html, /59 USDT/);
  assert.match(html, /299 USDT/);
  assert.match(html, /999 USDT/);
  // Case-study section is conditionally hidden when no published cases exist.
  assert.doesNotMatch(html, /Selected Web3 GEO Work/);
  assert.match(html, /Start at 9\.9 USDT/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
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
  assert.match(navigation, /\/#method/);
  assert.doesNotMatch(navigation, /\/#how-it-works/);
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

test("homepage footer includes all policy and support links", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /href="\/contact"/);
  assert.match(html, /href="\/delivery"/);
  assert.match(html, /href="\/refund"/);
  assert.match(html, /href="\/privacy"/);
  assert.match(html, /href="\/terms"/);
});

test("contact page renders with mailto and contact email", async () => {
  const response = await render("/contact");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Contact molthub/);
  assert.match(html, /mailto:chengzhao640@gmail\.com/);
  assert.match(html, /Ask a question/i);
});

test("privacy page renders with key sections", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Privacy Policy/);
  assert.match(html, /Data we collect/);
  assert.match(html, /Data storage/);
  assert.match(html, /Supabase/);
  assert.match(html, /Your rights/);
});

test("terms page renders with key sections", async () => {
  const response = await render("/terms");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Terms of Service/);
  assert.match(html, /No guaranteed outcomes/);
  assert.match(html, /USDT/);
  assert.match(html, /application-based/);
  assert.match(html, /Limitation of liability/);
});

test("refund page renders with key sections", async () => {
  const response = await render("/refund");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Refund Policy/);
  assert.match(html, /irreversible/);
  assert.match(html, /Before delivery starts/);
  assert.match(html, /GEO Sprint/);
  assert.match(html, /Upgrade credit/);
});

test("delivery page renders with turnaround times", async () => {
  const response = await render("/delivery");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Delivery Policy/);
  assert.match(html, /Turnaround times/);
  assert.match(html, /9\.9 USDT/);
  assert.match(html, /2 business days/);
  assert.match(html, /4 business days/);
  assert.match(html, /account dashboard/);
});

test("paymentPlans data separates sprint from direct-purchase plans", async () => {
  const source = await readFile(
    new URL("../app/data/paymentPlans.ts", import.meta.url),
    "utf8",
  );
  // Sprint must not be in paidPlans (direct fixed-amount purchase)
  assert.match(source, /sprint.*excluded/i);
  // Sprint must have its own application-based config
  assert.match(source, /sprintApplication/);
  assert.match(source, /startingPrice/);
  // Legacy sprint orders must still be supported
  assert.match(source, /legacyOrderPlans/);
  assert.match(source, /getOrderPlan/);
});

test("sitemap and robots are configured", async () => {
  const [sitemap, robots] = await Promise.all([
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
  ]);
  assert.match(sitemap, /molthub\.click/);
  assert.match(sitemap, /\/contact/);
  assert.match(sitemap, /\/privacy/);
  assert.match(sitemap, /\/terms/);
  assert.match(sitemap, /\/refund/);
  assert.match(sitemap, /\/delivery/);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /disallow.*\/api\//);
});
