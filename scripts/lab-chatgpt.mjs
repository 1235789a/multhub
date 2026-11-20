import { chromium } from "playwright";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const [input, directory] = process.argv.slice(2);
if (!input || !directory) throw new Error("Usage: node scripts/lab-chatgpt.mjs <company-plan.json> <private-evidence-directory>");
const companies = JSON.parse(await readFile(input, "utf8"));
await mkdir(directory, { recursive: true, mode: 0o700 });

const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}),
  headless: process.env.LAB_VISIBLE_BROWSER !== "1",
});
const context = await browser.newContext({ locale: "en-US", viewport: { width: 1280, height: 900 } });

function outputName(company, position, repetition) {
  return [company.prospectId, "q" + position, "r" + repetition].join("-");
}

async function capture(company, question, position, repetition) {
  const file = outputName(company, position, repetition);
  const page = await context.newPage();
  const startedAt = new Date().toISOString();
  const record = {
    runId: randomUUID(), company: company.name, prospectId: company.prospectId, question: question.question,
    position, repetition, provider: "OpenAI", executionMethod: "chatgpt_consumer",
    model: "Model undisclosed in ChatGPT guest UI", language: "en-US",
    locationSetting: "Platform-detected, unchanged", searchMode: "web_search", timestamp: startedAt,
    screenshot: file + ".png", status: "hold",
  };
  let stop = false;
  page.on("response", (response) => {
    if (response.status() === 429 && new URL(response.url()).origin === "https://chatgpt.com") stop = true;
  });
  try {
    await page.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.getByRole("button", { name: "Add files and more" }).click({ timeout: 12000 });
    const search = page.getByRole("button", { name: "Web search", exact: true });
    const selected = page.getByLabel("Web search, click to remove");
    for (let click = 0; click < 3 && !await selected.count(); click++) {
      await search.click({ timeout: 10000 });
      await selected.waitFor({ state: "attached", timeout: 3000 }).catch(() => {});
    }
    if (!await selected.count()) throw new Error("The ChatGPT composer did not enable Web Search.");
    await page.getByRole("textbox", { name: "Chat with ChatGPT" }).fill(question.question);
    await page.getByRole("button", { name: "Send message" }).click();
    await page.waitForURL(/chatgpt\.com\/(?:uc|c)\/[a-z0-9-]+/, { timeout: 35000 });
    record.observedId = page.url().split("?")[0];
    const stopGenerating = page.getByRole("button", { name: "Stop generating" });
    await stopGenerating.waitFor({ state: "visible", timeout: 8000 }).catch(() => {});
    await stopGenerating.waitFor({ state: "hidden", timeout: 90000 });
    const assistant = page.locator('[data-message-role="assistant"][data-message-complete]').last();
    await assistant.waitFor({ timeout: 30000 });
    record.answer = await assistant.innerText();
    record.htmlFile = file + ".html";
    await writeFile(join(directory, record.htmlFile), await assistant.innerHTML(), { mode: 0o600 });
    record.pageLinks = await assistant.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => ({ url: anchor.href, title: (anchor.innerText || anchor.getAttribute("aria-label") || "").trim() }))
      .filter((link) => /^https?:\/\//.test(link.url)));
    const screenshot = await page.screenshot({ path: join(directory, record.screenshot), fullPage: true });
    record.sha256 = createHash("sha256").update(screenshot).digest("hex");
    const sourceButtons = assistant.locator('button[aria-label^="Open "]');
    record.sourceLinks = [];
    record.unresolvedSourceLabels = [];
    const external = (url) => url && /^https?:\/\//.test(url) && new URL(url).hostname !== "chatgpt.com";
    for (const source of await sourceButtons.all()) {
      const title = (await source.getAttribute("aria-label") ?? "").replace(/^Open /, "");
      const popupEvent = page.waitForEvent("popup", { timeout: 2000 }).catch(() => null);
      await source.click({ timeout: 4000 }).catch(() => {});
      const popup = await popupEvent;
      const discovered = popup ? popup.url() : null;
      if (external(discovered)) {
        record.sourceLinks.push({ title, url: discovered });
      } else {
        const popover = page.locator('[role="dialog"]:visible, [data-d-component="popover"]:visible').last();
        const links = await popover.locator('a[href]').evaluateAll((anchors) =>
          anchors.map((anchor) => ({ url: anchor.href, title: (anchor.innerText || anchor.getAttribute("aria-label") || "").trim() }))).catch(() => []);
        const matches = links.filter((link) => external(link.url));
        if (matches.length) record.sourceLinks.push(...matches);
        else record.unresolvedSourceLabels.push(title);
        await page.keyboard.press("Escape");
      }
      if (popup) await popup.close().catch(() => {});
      if (page.url().split("?")[0] !== record.observedId) break;
    }
    record.sourceLinks = [...new Map(record.sourceLinks.map((source) => [source.url, source])).values()];
    record.status = "captured_pending_review";
  } catch (error) {
    record.error = error instanceof Error ? error.message.split("\n")[0] : String(error);
    record.renderedText = await page.locator("body").innerText({ timeout: 4000 }).catch(() => "");
    if (/verify you are human|too many requests|rate limit|usage limit|search limit|sign in to (?:use|continue)|log in to (?:continue|use web search)/i.test(record.renderedText)) stop = true;
    const screenshot = await page.screenshot({ path: join(directory, record.screenshot), fullPage: true, timeout: 8000 }).catch(() => null);
    if (screenshot) record.sha256 = createHash("sha256").update(screenshot).digest("hex");
  } finally {
    record.finishedAt = new Date().toISOString();
    await writeFile(join(directory, file + ".json"), JSON.stringify(record, null, 2), { mode: 0o600 });
    console.log(new Date().toISOString(), file, record.status, record.pageLinks?.length ?? 0, record.sourceLinks?.length ?? 0, record.error ?? "");
    await page.close();
  }
  return stop;
}

try {
  const parallel = Math.min(2, Math.max(1, Number(process.env.LAB_BROWSER_CONCURRENCY) || 1));
  const queue = companies.flatMap((company) => company.questions.flatMap((question, index) =>
    [1, 2, 3].map((repetition) => ({ company, question, index, repetition }))));
  let paused = false;
  async function consume() {
    while (queue.length && !paused) {
      const { company, question, index, repetition } = queue.shift();
      {
        const file = join(directory, outputName(company, index + 1, repetition) + ".json");
        if (await readFile(file).then(() => true, () => false)) continue;
        if (await capture(company, question, index + 1, repetition)) {
          console.log("ChatGPT asked for a login, verification, or imposed a usage limit. The batch is paused.");
          paused = true;
        }
      }
    }
  }
  await Promise.all(Array.from({ length: parallel }, consume));
} finally {
  await browser.close();
}
