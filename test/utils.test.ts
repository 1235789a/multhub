import { describe, expect, it } from "vitest";
import { absoluteUrl, humanize, isSameOrigin, safeJsonArray } from "../src/lib/utils";

describe("utility boundaries", () => {
  it("returns an empty array for malformed product JSON", () => {
    expect(safeJsonArray("not-json")).toEqual([]);
    expect(safeJsonArray('{"value":1}')).toEqual([]);
  });

  it("builds canonical URLs without double slashes", () => {
    expect(absoluteUrl("https://example.com", "/products/item")).toBe("https://example.com/products/item");
  });

  it("checks write origins", () => {
    expect(isSameOrigin(new Request("https://example.com/api", { headers: { Origin: "https://example.com" } }), "https://example.com")).toBe(true);
    expect(isSameOrigin(new Request("https://example.com/api", { headers: { Origin: "https://attacker.test" } }), "https://example.com")).toBe(false);
  });

  it("humanizes database states", () => {
    expect(humanize("follow_up_due")).toBe("Follow Up Due");
  });
});
