import { describe, expect, it } from "vitest";
import { parseFaq, reviewRequestSchema, splitList, transactionSchema } from "../src/lib/validation";

describe("reviewRequestSchema", () => {
  it("accepts a useful product review", () => {
    const result = reviewRequestSchema.safeParse({
      name: "Maya Chen",
      product_name: "Pressed flower necklace",
      product_url: "https://example.com/item",
      craft_type: "Handmade jewelry",
      story: "Made from flowers saved after weddings.",
      problem: "Visitors like the post but do not ask how to order.",
      contact_channel: "email",
      contact_value: "maya@example.com",
      preferred_package: "first-fix",
      consent: "on",
      company: "",
      turnstile_token: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects thin submissions", () => {
    const result = reviewRequestSchema.safeParse({
      name: "M",
      product_name: "X",
      craft_type: "Art",
      problem: "help",
      contact_channel: "email",
      contact_value: "x",
      consent: "on",
    });
    expect(result.success).toBe(false);
  });
});

describe("product passport helpers", () => {
  it("normalizes comma and newline lists", () => {
    expect(splitList("resin, dried flowers\n brass, resin")).toEqual(["resin", "dried flowers", "brass", "resin"]);
  });

  it("parses the plain-text FAQ format", () => {
    expect(parseFaq("Can I choose colors? | Yes, from the current palette.\n\nHow long? | 5–7 days.")).toEqual([
      { question: "Can I choose colors?", answer: "Yes, from the current palette." },
      { question: "How long?", answer: "5–7 days." },
    ]);
  });
});

describe("USDT transaction input", () => {
  it("requires a TRON-style 64 character transaction hash", () => {
    expect(transactionSchema.safeParse({ tx_hash: "a".repeat(64) }).success).toBe(true);
    expect(transactionSchema.safeParse({ tx_hash: "not-a-hash" }).success).toBe(false);
  });
});
