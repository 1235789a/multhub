import { openaiSpec } from "./vendor/optifeed/engines/openai";
import { geminiSpec } from "./vendor/optifeed/engines/gemini";
import { perplexitySpec } from "./vendor/optifeed/engines/perplexity";
import { analyzeAnswer } from "./vendor/optifeed/scoring/detect";
import { boundedText } from "./network";
import { AppError, type ModelRun, type Report } from "./types";
export type VisibilityEnv = {
  DB?: D1Database;
  VISIBILITY_ADMIN_TOKEN?: string;
  VISIBILITY_RATE_SALT?: string;
  VISIBILITY_AI_ENABLED?: string;
  VISIBILITY_AI_DAILY_CALLS?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  PERPLEXITY_API_KEY?: string;
  PERPLEXITY_MODEL?: string;
};
export const providers = {
  openai: openaiSpec,
  gemini: geminiSpec,
  perplexity: perplexitySpec,
};
export function modelConfig(env: VisibilityEnv) {
  return {
    enabled: env.VISIBILITY_AI_ENABLED === "true",
    providers: Object.keys(providers).filter((p) =>
      Boolean(env[`${p.toUpperCase()}_API_KEY` as keyof VisibilityEnv]),
    ),
    access: "admin_only",
    note: "API answers are experimental observations, not consumer app rankings. No paid requests run during a free scan.",
  };
}
export async function testModel(
  report: Report,
  provider: keyof typeof providers,
  question: string,
  env: VisibilityEnv,
  fetcher: typeof fetch = fetch,
): Promise<ModelRun> {
  const spec = providers[provider];
  if (!spec)
    throw new AppError("INVALID_PROVIDER", "Unsupported model provider.");
  const apiKey =
    env[`${provider.toUpperCase()}_API_KEY` as keyof VisibilityEnv];
  if (typeof apiKey !== "string" || !apiKey)
    throw new AppError(
      "MODEL_NOT_CONFIGURED",
      "This model API has not been configured.",
      503,
    );
  const requestedModel = String(
    env[`${provider.toUpperCase()}_MODEL` as keyof VisibilityEnv] ||
      spec.defaultModel,
  );
  if (!/^[a-zA-Z0-9_.-]{1,100}$/.test(requestedModel))
    throw new AppError(
      "INVALID_MODEL",
      "Configure a valid model identifier on the server.",
      503,
    );
  const mode = provider === "perplexity" ? "grounded" : "parametric";
  const req = spec.buildRequest({
    prompt: question,
    model: requestedModel,
    mode,
    apiKey,
    maxTokens: 1600,
  });
  // Upstream Sonar builder omits a cap; set one before any paid request.
  if (provider === "perplexity")
    Object.assign(req.body as object, { max_tokens: 1600 });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetcher(spec.endpoint(mode, requestedModel), {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify(req.body),
      signal: controller.signal,
      redirect: "manual",
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new AppError(
        "MODEL_ERROR",
        `Model API returned HTTP ${response.status}. Check server configuration and provider quota. This attempt counts toward the daily cap.`,
        502,
      );
    }
    const rawResponse = JSON.parse((await boundedText(response, 128000)).text);
    const parsed = spec.parse(rawResponse, mode);
    if (!parsed.text.trim())
      throw new AppError(
        "EMPTY_MODEL_ANSWER",
        "The model returned no visible answer. No mention result was recorded.",
        502,
      );
    const competitor = report.competitor
      ? new URL(report.competitor).hostname.replace(/^www\./, "")
      : "";
    const analysis = analyzeAnswer(
      {
        engine: provider,
        kind: mode,
        prompt: question,
        text: parsed.text,
        citations: parsed.citations,
        model: parsed.model ?? requestedModel,
        ts: new Date().toISOString(),
        costUsd: 0,
      },
      {
        schema_version: "0.3",
        domain: new URL(report.finalUrl).hostname,
        brand: report.brand,
        aliases: [],
        competitors: competitor ? [competitor, competitor.split(".")[0]] : [],
        locale: "en",
        category: report.industry,
      },
    );
    return {
      id: crypto.randomUUID(),
      provider,
      model: parsed.model ?? requestedModel,
      requestedModel,
      mode,
      question,
      answer: parsed.text,
      citations: (parsed.citations ?? []).filter((u) =>
        /^https?:\/\//i.test(u),
      ),
      rawResponse,
      mentioned: analysis.mentioned,
      ambiguous: analysis.ambiguous,
      competitors: analysis.entities.filter((e) => e !== report.brand),
      checkedAt: new Date().toISOString(),
      conditions: {
        language: "en",
        region: "API default; not controlled",
        personalized: false,
        surface: "Provider API; not the consumer ChatGPT/Gemini/Perplexity UI",
      },
      tokens: parsed.usage,
    };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw new AppError(
      "MODEL_REQUEST_FAILED",
      "The model request failed or timed out. No synthetic answer was created.",
      502,
    );
  } finally {
    clearTimeout(timer);
  }
}
