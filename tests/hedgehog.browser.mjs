import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.PREVIEW_URL || "http://localhost:3000";
const signals = [
  "Clear page title", "Useful meta description", "Structured data",
  "FAQ signal", "Documentation signal", "Canonical URL", "AI search crawler access",
].map((label, index) => ({ label, passed: index !== 3, checked: true, detail: "Actual checked homepage signal" }));
const scan = {
  website: "https://acme.example",
  projectName: "Acme Private Brand",
  category: "Web3 infrastructure",
  score: 86,
  verdict: "Strong technical foundation",
  snapshotId: "00000000-0000-4000-8000-000000000002",
  scannedAt: "2026-10-21T10:00:00.000Z",
  note: "This free scan checks website readiness signals. It does not query AI platforms.",
  hedgehog: {
    kind: "explorer",
    title: "Explorer Hedgehog",
    line: "I found the map. Where's the FAQ?",
    reason: "Documentation is present, while a FAQ signal was not found.",
    accent: "#6CAE89",
  },
  signals, prompts: ["Who is this for?"], actions: ["Publish a clear FAQ"], usage: null,
  shareGrant: { id: "e1d2b08e-8b3d-42fb-8b6e-501a01aa1212", key: "test-owner-key" },
  preview: false,
};

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    acceptDownloads: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.route("**/api/free-scan", async (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(scan) }));
  await page.route("**/api/hedgehog/share", async (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ url: "/hedgehog/" + scan.shareGrant.id }) }));

  await page.goto(base + "/#free-scan", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.getByLabel("Project website").fill("acme.example");
  await page.getByRole("button", { name: /Reveal My Hedgehog/ }).click();
  await page.screenshot({ path: "hedgehog-mobile-preview.png", fullPage: true });
  await page.getByRole("heading", { name: "Explorer Hedgehog" }).waitFor({ timeout: 15000 });

  await page.screenshot({ path: "hedgehog-mobile-preview.png", fullPage: false });
  assert.equal(await page.locator(".hedgehog-privacy input").isChecked(), false);
  assert.equal(await page.getByRole("button", { name: "Fun Result" }).count(), 1);
  const preview = await page.locator(".hedgehog-poster__preview").getAttribute("src");
  assert.ok(preview && !decodeURIComponent(preview).includes("Acme Private Brand"));

  const downloadPng = async (label, width, height) => {
    await page.getByRole("button", { name: label }).click();
    const promise = page.waitForEvent("download", { timeout: 25000 });
    await page.getByRole("button", { name: "Download PNG" }).click();
    const file = await promise;
    const buffer = await readFile(await file.path());
    assert.equal(buffer.subarray(1, 4).toString(), "PNG");
    assert.equal(buffer.readUInt32BE(16), width);
    assert.equal(buffer.readUInt32BE(20), height);
    console.log("Downloaded verified PNG:", width, height);
  };
  await downloadPng("X · 1200×675", 1200, 675);
  await downloadPng("Vertical · 1080×1350", 1080, 1350);

  await page.getByRole("button", { name: "Professional Report" }).click();
  await page.getByText("What to improve first").waitFor();
  await page.getByText("Clear page title").waitFor();
  await page.getByRole("button", { name: "Fun Result" }).click();
  await page.getByRole("button", { name: /Create public link/ }).click();
  await page.getByRole("link", { name: /Open public hedgehog page/ }).waitFor();
  const shared = await page.getByRole("link", { name: /Open public hedgehog page/ }).getAttribute("href");
  assert.ok(shared.includes("/hedgehog/"));
  assert.ok(shared.includes("utm_source=x"));
  console.log("Mobile browser flow passed: scan → reveal → two PNG files → report → opted-in public link.");
} finally {
  await browser.close();
}
