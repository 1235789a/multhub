/** Run explicitly against an isolated preview. Uses an installed Chromium and playwright-core.
 * No model calls, email sending or private admin tokens. QA contact is deleted in finally.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_MODULE || "playwright-core",
);
const origin = process.env.VISIBILITY_TEST_ORIGIN;
if (!origin)
  throw new Error(
    "Set VISIBILITY_TEST_ORIGIN to an isolated preview; never use production.",
  );
const base = origin + "/tools/ai-visibility",
  out = process.env.VISIBILITY_QA_OUTPUT || "outputs/visibility/browser-phase2";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
  ...(process.env.VISIBILITY_BROWSER_PROXY
    ? { proxy: { server: process.env.VISIBILITY_BROWSER_PROXY } }
    : {}),
});
const results = [],
  errors = [];
let saved = null,
  report = null,
  desktop;
const record = (test, details = {}) =>
  results.push({ test, passed: true, ...details });
async function capture(page, name) {
  await page.screenshot({
    path: path.join(out, name + ".png"),
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
    name + " has horizontal overflow",
  );
  record(name + " layout", { viewport: page.viewportSize() });
}
try {
  desktop = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await desktop.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/questions", { waitUntil: "networkidle" });
  await page.locator("#pack").selectOption("web3");
  await page.locator("#question-brand").fill("MultiHub");
  assert.equal(await page.locator(".vh-question-plan li").count(), 7);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download CSV" }).click();
  const download = await downloadPromise;
  await download.saveAs(path.join(out, "web3-questions.csv"));
  record("question-pack selection and CSV download");
  await page.goto(base + "/partners", { waitUntil: "networkidle" });
  await page
    .getByLabel("Referral code", { exact: true })
    .fill("phase2_browser_qa");
  const link = await page.getByLabel("Your share link").inputValue();
  assert.match(link, /ref=phase2_browser_qa&/);
  await page.getByRole("button", { name: "Copy link", exact: false }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), link);
  record("partner-link generation and clipboard");
  await capture(page, "partners-desktop");
  await page.goto(
    base + "?pack=web3&ref=phase2_browser_qa&utm_source=browser-qa",
    { waitUntil: "networkidle" },
  );
  await capture(page, "homepage-desktop");
  await page.getByText("Fine-tune your scan", { exact: false }).click();
  assert.equal(await page.locator("#vh-pack").inputValue(), "web3");
  await page
    .getByLabel("Website URL", { exact: false })
    .fill("https://molthub.click");
  await page.locator("#vh-industry").fill("stablecoin payment platforms");
  const scanResponse = page.waitForResponse(
    (r) =>
      r.url().endsWith("/api/visibility/scans") &&
      r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Check My Website — Free" }).click();
  const scan = await scanResponse;
  const body = await scan.json();
  assert.equal(scan.status(), 201, JSON.stringify(body));
  report = body.report;
  await page.locator(".vh-score-ring").waitFor();
  assert.equal(
    await page.locator(".vh-score-ring strong").textContent(),
    String(report.score),
  );
  record("desktop real scan and report", {
    reportId: report.id,
    score: report.score,
    questionPack: report.questionPack.id,
  });
  await capture(page, "report-desktop");
  await page.getByRole("button", { name: "Copy report link" }).click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    base + "/report/" + report.id,
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".vh-score-ring").waitFor();
  record("report share and reload");
  await page
    .getByText("View your reusable buyer-question test plan", { exact: false })
    .click();
  assert.equal(await page.locator(".vh-question-plan li").count(), 7);
  await page.getByRole("button", { name: "Print / Save PDF" }).click();
  await page.pdf({
    path: path.join(out, "report-print.pdf"),
    format: "A4",
    printBackground: true,
  });
  record("print button click and Chromium PDF generation");
  await page.getByRole("link", { name: "Review audit scope" }).click();
  await page.getByRole("radio", { name: /Verified GEO Baseline/ }).check();
  await page.getByLabel("Work email").fill("qa-browser-phase2@example.net");
  await page
    .getByLabel("What would you like to improve?")
    .fill(
      "QA TEST. Verify scope selection and immediately delete. Do not contact.",
    );
  const checkboxes = page.locator(".vh-lead input[type=checkbox]");
  await checkboxes.nth(0).check();
  assert.equal(await checkboxes.nth(1).isChecked(), false);
  const leadResponse = page.waitForResponse(
    (r) =>
      r.url().endsWith("/api/visibility/leads") &&
      r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Request My Detailed Audit" }).click();
  const lead = await leadResponse;
  saved = await lead.json();
  assert.equal(lead.status(), 201);
  await page.getByRole("heading", { name: "Your request is saved." }).waitFor();
  record("baseline scope submission with marketing unchecked");
  await page
    .getByRole("link", { name: "Manage / delete this request" })
    .click();
  await page
    .getByRole("button", { name: "Delete my contact information" })
    .click();
  await page
    .getByText(
      "Your audit request and contact information have been deleted.",
      { exact: true },
    )
    .waitFor();
  record("private browser deletion");
  saved = null;
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const phone = await mobile.newPage();
  phone.on("pageerror", (e) => errors.push(e.message));
  await phone.goto(base, { waitUntil: "networkidle" });
  await capture(phone, "homepage-mobile");
  await phone
    .getByLabel("Website URL", { exact: false })
    .fill("http://127.0.0.1");
  await phone.getByRole("button", { name: "Check My Website — Free" }).click();
  await phone.getByRole("alert").waitFor();
  assert.match(
    await phone.getByRole("alert").textContent(),
    /public|private|internal/i,
  );
  record("mobile malicious input error");
  await phone.goto(base + "/report/" + report.id, { waitUntil: "networkidle" });
  await phone.locator(".vh-score-ring").waitFor();
  await capture(phone, "report-mobile");
  await phone
    .getByText("View your reusable buyer-question test plan", { exact: false })
    .click();
  await phone.getByRole("radio", { name: /Verified GEO Baseline/ }).check();
  assert.equal(
    await phone
      .getByRole("radio", { name: /Verified GEO Baseline/ })
      .isChecked(),
    true,
  );
  record("mobile report plan and offer selection");
  await phone.goto(base + "/questions", { waitUntil: "networkidle" });
  await phone.locator("#pack").selectOption("developer-tools");
  await capture(phone, "questions-mobile");
  await phone.goto(base + "/partners", { waitUntil: "networkidle" });
  await phone.getByLabel("Referral code", { exact: true }).fill("agency_north");
  assert.match(
    await phone.getByLabel("Your share link").inputValue(),
    /ref=agency_north/,
  );
  await capture(phone, "partners-mobile");
  assert.deepEqual(errors, []);
  record("no browser page errors");
} finally {
  if (saved?.id && saved?.deleteToken) {
    const response = await desktop.request.delete(
      origin + "/api/visibility/leads/" + saved.id,
      { headers: { "x-deletion-token": saved.deleteToken } },
    );
    record("QA contact cleanup", { status: response.status() });
  }
  await browser.close();
  await writeFile(
    path.join(out, "results.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        origin,
        results,
        pageErrors: errors,
      },
      null,
      2,
    ),
  );
}
console.log(
  JSON.stringify({ passed: results.length, reportId: report?.id, output: out }),
);
