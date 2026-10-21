import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/free-scan/route.ts";

const description = "This project helps developers audit site documentation, identify missing metadata, and compare home page signals across websites in a repeatable way.";
const goodHTML = '<html><head><title>Acme Web3 Infrastructure for Builders</title><meta name="description" content="' +
  description + '"><script type="application/ld+json">{"@type":"Organization"}</script><link rel="canonical" href="https://acme.example/"></head><body>FAQ documentation and API reference</body></html>';

function scan(body = { website: "https://acme.example", category: "Web3 infrastructure" }) {
  return POST(new Request("https://molthub.click/api/free-scan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }));
}

async function withRemote(html, robotsStatus, robotsBody, callback) {
  const original = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const path = String(input);
    if (path.endsWith("/robots.txt")) return new Response(robotsBody, { status: robotsStatus });
    return new Response(html, { status: 200, headers: { "content-type": "text/html" } });
  };
  try { return await callback(); }
  finally { globalThis.fetch = original; }
}

test("anonymous scan returns complete genuine website measurements, not a signup gate", async () => {
  await withRemote(goodHTML, 404, "", async () => {
    const response = await scan();
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.preview, false);
    assert.equal(data.signals.length, 7);
    assert.equal(data.score, 100);
    assert.equal(data.hedgehog.kind, "king");
    assert.ok(data.snapshotId);
    assert.equal(data.shareGrant, null);
    assert.match(data.note, /does not query paid AI platforms/i);
  });
});
test("an observed robots.txt block produces the invisible identity", async () => {
  await withRemote(goodHTML, 200, "User-agent: OAI-SearchBot\nDisallow: /\n", async () => {
    const data = await (await scan()).json();
    assert.equal(data.hedgehog.kind, "invisible");
    assert.equal(data.signals.at(-1).passed, false);
  });
});
test("missing HTML title is not marked present from hostname fallback", async () => {
  await withRemote(goodHTML.replace(/<title>.*?<\/title>/, ""), 404, "", async () => {
    const data = await (await scan()).json();
    assert.equal(data.signals[0].passed, false);
  });
});
test("private and local target URLs are refused without fetching", async () => {
  const response = await scan({ website: "http://127.0.0.1:8080" });
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /public project website/i);
});
test("response streaming enforces the one-megabyte limit", async () => {
  await withRemote("A".repeat(1_100_000), 404, "", async () => {
    const response = await scan();
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /size limit/i);
  });
});
