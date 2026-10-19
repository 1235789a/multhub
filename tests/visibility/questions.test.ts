import { describe, it, expect } from "vitest";
import {
  createQuestionPack,
  inferPack,
  questionPackOptions,
  questionCsv,
  csvCell,
} from "../../lib/visibility/questions";
import { auditOffers } from "../../lib/visibility/offers";
import { paidPlans } from "../../app/data/paymentPlans";
describe("reviewable industry question plans", () => {
  it.each(questionPackOptions)(
    "makes five unbranded discovery prompts and two branded fact checks for $id",
    (p) => {
      const pack = createQuestionPack(p.category, "Acme", p.id);
      expect(pack.status).toBe("not_executed");
      expect(pack.questions).toHaveLength(7);
      expect(pack.questions.filter((q) => q.kind === "discovery")).toHaveLength(
        5,
      );
      for (const q of pack.questions)
        expect(q.question.includes("Acme")).toBe(q.kind === "verification");
      expect(new Set(pack.questions.map((q) => q.id)).size).toBe(7);
      expect(createQuestionPack(p.category, "Acme", p.id)).toEqual(pack);
    },
  );
  it("removes brand wording from the discovery category instead of baiting mentions", () => {
    const pack = createQuestionPack(
      "Acme customer support tools",
      "Acme",
      "ai-saas",
    );
    expect(pack.category).toBe("AI customer support tools");
    expect(pack.note).toContain("removed");
    expect(
      pack.questions
        .filter((q) => q.kind === "discovery")
        .every((q) => !q.question.includes("Acme")),
    ).toBe(true);
  });
  it("infers common industries but honors an explicit selection", () => {
    expect(inferPack("stablecoin payments")).toBe("web3");
    expect(inferPack("SEO agency")).toBe("agency");
    expect(inferPack("developer API")).toBe("developer-tools");
    expect(inferPack("AI support SaaS")).toBe("ai-saas");
    expect(
      createQuestionPack("stablecoin payments", "Acme", "developer-tools").id,
    ).toBe("developer-tools");
  });
  it("exports versioned quoted CSV and guards formula cells", () => {
    expect(csvCell('=HYPERLINK("bad")')).toBe('"\'=HYPERLINK(""bad"")"');
    expect(csvCell("@cmd")).toBe('"\'@cmd"');
    const csv = questionCsv(createQuestionPack("AI support", "Acme"));
    expect(csv.split("\r\n")).toHaveLength(8);
    expect(csv).toContain("pack_version");
  });
  it("takes audit prices from the existing main-site catalogue", () => {
    for (const o of auditOffers) {
      expect(o.price).toBe(paidPlans[o.id].amount);
      expect(o.currency).toBe("USDT");
      expect(o.exclusions).toContain("before payment");
    }
  });
});
