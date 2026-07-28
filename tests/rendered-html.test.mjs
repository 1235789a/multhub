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
  assert.match(html, /Selected Web3 GEO Work/);
  assert.match(html, /Find Out How AI Understands Your Web3 Project/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("keeps the compact homepage structure and required visual asset", async () => {
  const [page, navigation] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/navigation.ts", import.meta.url), "utf8"),
    access(new URL("../public/molthub-ai-visibility-hero.png", import.meta.url)),
  ]);

  assert.match(page, /id="method"/);
  assert.match(page, /id="services"/);
  assert.match(page, /id="about"/);
  assert.match(page, /id="free-review"/);
  assert.match(navigation, /\/#method/);
  assert.doesNotMatch(navigation, /\/#how-it-works/);
});
