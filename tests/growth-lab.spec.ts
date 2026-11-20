import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const output = process.env.LAB_SCREENSHOTS;
const live = process.env.LAB_REAL_REPORTS ? JSON.parse(process.env.LAB_REAL_REPORTS) as Array<{
  name: string; path: string; evidencePath: string; sha256: string;
}> : [];

test("Lab links to the existing tools and fits the viewport", async ({ page }, info) => {
  await page.goto("/lab");
  await expect(page.getByRole("heading", { name: "Be easier to find when buyers ask AI." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  if (output) {
    await mkdir(output, { recursive: true });
    await page.screenshot({ path: join(output, `lab-${info.project.name}.png`), fullPage: true });
  }
  await page.getByRole("link", { name: "Check your website" }).click();
  await expect(page.getByRole("heading", { name: "Free website scan", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Cases", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Case studies", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Read the experiment" }).click();
  await expect(page).toHaveURL(/research\/self-geo-experiment/);
});

test("invalid shares and anonymous admin access return private errors", async ({ page, request }) => {
  const response = await page.goto("/r/unavailable-token");
  expect(response?.status()).toBe(404);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(page.getByRole("heading", { name: "This private link is unavailable" })).toBeVisible();
  const missingAsset = await request.get("/r/unavailable-token/evidence/invalid");
  expect(missingAsset.status()).toBe(404);
  const admin = await request.get("/api/lab/companies");
  expect(admin.status()).toBe(401);
  expect(admin.headers()["cache-control"]).toContain("no-store");
});

test("existing homepage, walkthrough, quick scan validation and checkout stay available", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Make Your Web3 Project");
  const scan = await request.post("/api/free-scan", { data: { website: "http://localhost", category: "software" } });
  expect(scan.status()).toBe(400);
  await page.goto("/checkout?plan=trial&projectName=Checkout+regression&website=https%3A%2F%2Fexample.com&category=SaaS");
  await expect(page.getByRole("heading", { name: "Pay with USDT on TRON" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Website", exact: true })).toHaveValue("https://example.com");
  expect((await request.post("/api/orders", { data: { planId: "trial" } })).status()).toBe(401);
  expect((await request.post("/api/orders/verify", { data: {} })).status()).toBe(401);
});

for (const item of live) {
  test(`real preview opens without an account for ${item.name}`, async ({ page, request }, info) => {
    const opened = await page.goto(item.path);
    expect(opened?.status()).toBe(200);
    expect(opened?.headers()["x-robots-tag"]).toContain("noindex");
    expect(opened?.headers()["cache-control"]).toContain("no-store");
    await expect(page.getByText(item.name, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your content preview" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "What AI search recommended" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const asset = await request.get(item.evidencePath);
    expect(asset.status()).toBe(200);
    expect(asset.headers()["x-evidence-sha256"]).toBe(item.sha256);
    if (output) await page.screenshot({ path: join(output, `real-${item.name.replace(/\W/g, "")}-${info.project.name}.png`), fullPage: true });
  });
}
