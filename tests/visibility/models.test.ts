import { describe, it, expect, vi } from "vitest";
import { testModel } from "../../lib/visibility/models";
import { scanWebsite } from "../../lib/visibility/scanner";
import { fixtureFetch } from "./fixtures";
describe("real provider adapters (mock HTTP, not live AI evidence)", () => {
  it("persists exact answer, model, raw response and mention ambiguity", async () => {
    const report = await scanWebsite(
      { website: "acme.com", competitor: "rival.com" },
      { fetchPage: fixtureFetch() },
    );
    const raw = {
      model: "test-pinned-model",
      choices: [
        { message: { content: "Acme and Rival are options worth comparing." } },
      ],
      usage: { prompt_tokens: 10, completion_tokens: 20 },
    };
    const http = vi.fn().mockResolvedValue(new Response(JSON.stringify(raw)));
    const run = await testModel(
      report,
      "openai",
      "Which support tools should a team shortlist?",
      { OPENAI_API_KEY: "secret-server-test-key", OPENAI_MODEL: "test-model" },
      http,
    );
    expect(run.answer).toBe(raw.choices[0].message.content);
    expect(run.model).toBe("test-pinned-model");
    expect(run.rawResponse).toEqual(raw);
    expect(run.mentioned).toBe(true);
    expect(run.competitors).toContain("rival");
    expect(run.citations).toEqual([]);
    expect(http.mock.calls[0][1].body).toContain("max_completion_tokens");
    expect(JSON.stringify(run)).not.toContain("secret-server-test-key");
  });
  it("requires a key and never replaces an API error with an answer", async () => {
    const report = await scanWebsite(
      { website: "acme.com" },
      { fetchPage: fixtureFetch() },
    );
    await expect(testModel(report, "openai", "Question", {})).rejects.toThrow(
      "not been configured",
    );
    const http = vi
      .fn()
      .mockResolvedValue(
        new Response("provider error with secret", { status: 429 }),
      );
    await expect(
      testModel(report, "openai", "Question", { OPENAI_API_KEY: "key" }, http),
    ).rejects.toThrow("HTTP 429");
    expect(http).toHaveBeenCalledTimes(1);
  });
});
