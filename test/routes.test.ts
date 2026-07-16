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
    PRODUCT_ASSETS: {} as R2Bucket,
    ASSETS: {} as Fetcher,
    ...overrides,
  };
}

describe("public routes", () => {
  it("renders the complete service homepage", async () => {
    const response = await app.request("/", {}, publicEnv());
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("One-Product First Fix");
    expect(html).toContain("One-Product Visibility Launch");
    expect(html).toContain("Custom Brand Visibility Site");
    expect(html).toContain("Visibility Care");
    expect(html).toContain("Request my personalized review");
    expect(html).toContain("application/ld+json");
  });

  it("publishes the honest AI-ready boundary", async () => {
    const response = await app.request("/ai-ready", {}, publicEnv());
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("eligibility, not entitlement");
    expect(html).toContain("nobody can promise it");
  });

  it("fails closed on production admin access", async () => {
    const response = await app.request("/admin", {}, publicEnv());
    const html = await response.text();
    expect(response.status).toBe(401);
    expect(html).toContain("Private workspace");
  });
});
