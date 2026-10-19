import { describe, it, expect } from "vitest";
import { scanWebsite, buyerQuestions } from "../../lib/visibility/scanner";
import { fixtureFetch, richHtml } from "./fixtures";
describe("evidence-backed readiness", () => {
  it("scores a complete fixture deterministically and never invents model results", async () => {
    const r = await scanWebsite(
      { website: "https://acme.com/" },
      { fetchPage: fixtureFetch() },
    );
    expect(r.score).toBe(100);
    expect(r.coverage).toBe(100);
    expect(r.checks.reduce((n, c) => n + c.weight, 0)).toBe(100);
    expect(r.brand).toBe("Acme");
    expect(r.visibility.status).toBe("not_tested");
    expect(r.visibility.runs).toEqual([]);
    expect(r.sources).toHaveLength(4);
    expect(r.sources.every((s) => !("body" in s))).toBe(true);
  });
  it("reports a sparse HTML site with explicit missing configuration", async () => {
    const r = await scanWebsite(
      { website: "https://acme.com/" },
      {
        fetchPage: fixtureFetch({
          "/": {
            body: "<html><head><title>Acme</title></head><body>Minimal text.</body></html>",
          },
          "/robots.txt": { ok: false, status: 404, body: "" },
          "/sitemap.xml": { ok: false, status: 404, body: "" },
          "/llms.txt": { ok: false, status: 404, body: "" },
        }),
      },
    );
    expect(r.score).toBeLessThan(50);
    expect(r.coverage).toBe(100);
    expect(r.checks.find((c) => c.id === "content")?.status).toBe("fail");
    expect(r.bots.every((b) => b.access === "allowed")).toBe(true);
  });
  it("keeps unavailable robots and sitemap unknown rather than calling them missing", async () => {
    const r = await scanWebsite(
      { website: "acme.com" },
      {
        fetchPage: fixtureFetch({
          "/robots.txt": { status: null, ok: false, error: "timed out" },
          "/sitemap.xml": { status: 503, ok: false },
        }),
      },
    );
    expect(r.coverage).toBe(65);
    expect(r.checks.find((c) => c.id === "crawler")?.status).toBe("unknown");
    expect(r.bots.every((b) => b.access === "unknown")).toBe(true);
    expect(r.score).toBe(100);
  });
  it("does not penalize an intentional model training block", async () => {
    const r = await scanWebsite(
      { website: "acme.com" },
      {
        fetchPage: fixtureFetch({
          "/robots.txt": {
            body: "User-agent: GPTBot\nDisallow: /\nUser-agent: *\nAllow: /",
          },
        }),
      },
    );
    expect(r.score).toBe(100);
    expect(r.bots.find((b) => b.bot === "GPTBot")?.access).toBe("blocked");
  });
  it("evaluates wildcard and Allow precedence for the scanned page", async () => {
    const r = await scanWebsite(
      { website: "https://acme.com/pricing" },
      {
        fetchPage: fixtureFetch({
          "/pricing": { contentType: "text/html", body: richHtml },
          "/robots.txt": {
            body: "User-agent: *\nDisallow: /*\nAllow: /pricing",
          },
        }),
      },
    );
    expect(r.bots.slice(0, 3).every((b) => b.access === "allowed")).toBe(true);
  });
  it("detects invalid JSON-LD without crashing and reflects it in points", async () => {
    const r = await scanWebsite(
      { website: "acme.com" },
      {
        fetchPage: fixtureFetch({
          "/": {
            body: richHtml.replace(
              "</head>",
              '<script type="application/ld+json">{invalid}</script></head>',
            ),
          },
        }),
      },
    );
    expect(r.checks.find((c) => c.id === "schema")?.status).toBe("warn");
    expect(r.score).toBe(95);
  });
  it("detects a brand mismatch and lets the submitted name take precedence", async () => {
    const r = await scanWebsite(
      { website: "acme.com", brand: "Different Brand" },
      { fetchPage: fixtureFetch() },
    );
    expect(r.brand).toBe("Different Brand");
    expect(r.detectedBrand).toBe("Acme");
    expect(r.checks.find((c) => c.id === "brand")?.status).toBe("warn");
  });
  it("will not score an inaccessible site or non-HTML response", async () => {
    await expect(
      scanWebsite(
        { website: "acme.com" },
        { fetchPage: fixtureFetch({ "/": { status: 503, ok: false } }) },
      ),
    ).rejects.toThrow("HTTP 503");
    await expect(
      scanWebsite(
        { website: "acme.com" },
        {
          fetchPage: fixtureFetch({ "/": { contentType: "application/json" } }),
        },
      ),
    ).rejects.toThrow("HTML");
  });
  it("does not classify an HTML soft-404 as a real sitemap or robots file", async () => {
    const r = await scanWebsite(
      { website: "acme.com" },
      {
        fetchPage: fixtureFetch({
          "/robots.txt": { body: richHtml, contentType: "text/html" },
          "/sitemap.xml": { body: richHtml, contentType: "text/html" },
        }),
      },
    );
    expect(r.checks.find((c) => c.id === "crawler")?.status).toBe("unknown");
    expect(r.checks.find((c) => c.id === "sitemap")?.status).toBe("warn");
  });
  it("keeps buyer discovery templates unbranded and reproducible", () => {
    expect(buyerQuestions("AI support tools")).toEqual(
      buyerQuestions("AI support tools"),
    );
    expect(buyerQuestions("AI support tools")[0]).toContain("AI support tools");
  });
});
