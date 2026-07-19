import { describe, expect, it } from "vitest";
import { app } from "../src/index";
import type { Bindings } from "../src/types";

function publicEnv(overrides: Partial<Bindings> = {}): Bindings {
  return {
    ENVIRONMENT: "production",
    SITE_URL: "https://handmade.example",
    BRAND_NAME: "Handmade Visibility",
    PUBLIC_USDT_NETWORK: "TRC20",
    PUBLIC_USDT_ADDRESS: "TExampleAddress",
    ADMIN_EMAILS: "owner@example.com",
    ADMIN_NOTIFY_EMAIL: "owner@example.com",
    FROM_EMAIL: "Handmade Visibility <hello@example.com>",
    DB: {} as D1Database,
    PRODUCT_ASSETS: {} as KVNamespace,
    ASSETS: {} as Fetcher,
    ...overrides,
  };
}

describe("public routes", () => {
  it("renders the complete service homepage", async () => {
    const response = await app.request("/", {}, publicEnv());
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("Product Listing Checkup");
    expect(html).toContain("Complete Listing Refresh");
    expect(html).toContain("Handmade Shop Website");
    expect(html).toContain("Product Content Update");
    expect(html).toContain("Send my product for review");
    expect(html).not.toContain("Digital product passport");
    expect(html).not.toContain("We do not guarantee rankings");
    expect(html).toContain("application/ld+json");
  });

  it("explains search-ready product pages in plain language", async () => {
    const response = await app.request("/ai-ready", {}, publicEnv());
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("Help search tools understand");
    expect(html).toContain("Answer buying questions");
    expect(html).not.toContain("eligibility, not entitlement");
  });

  it("fails closed on production admin access", async () => {
    const response = await app.request("/admin", {}, publicEnv());
    const html = await response.text();
    expect(response.status).toBe(401);
    expect(html).toContain("Private workspace");
  });
});
