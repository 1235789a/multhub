import type { GenerateRequest, GeneratedContent } from "./types";
import { getTextProviderConfig, maskKey } from "@/lib/ai/text-provider";

interface DeepSeekResponse {
  choices: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

const SYSTEM_PROMPT = `You are a Web3 marketing content specialist. You create engaging, authentic content for small Web3 projects.

Task: Generate 7 types of content simultaneously. Output valid JSON only. No markdown, no explanations, no prefix text.

Output JSON schema:
{
  "xPost": "string (280 chars max, punchy, engagement-focused, 2-3 relevant hashtags at end, sound like a real project account)",
  "xThread": ["array of 5 strings, each 240 chars max, each is one tweet in a launch/announcement thread"],
  "telegramAnnouncement": "string (400-800 chars, channel announcement style, emojis, line breaks, call to action)",
  "telegramPinnedMessage": "string (200-400 chars, pinned msg format, what the project is, key links, how to participate",
  "memeImagePrompt": "string (detailed image generation prompt for a meme/promo image, describe style, colors, vibe, Web3 aesthetic)",
  "communityEngagementPost": "string (200-400 chars, a question or poll style post to spark community discussion",
  "sevenDayContentPlan": ["array of 7 strings, each is one day's content idea with suggested format and topic"]
}

Rules:
- Write for real Web3 projects, not generic AI press releases
- Match the tone requested by the user
- No guaranteed profit / no 100x / no pump language
- No fake partnerships or fake KOL mentions
- Do not make up specific token prices, metrics or metrics unless provided
- Content must be ready to copy-paste and publish
- For meme coins: use degen tone, relatable, community-focused
- For NFTs: focus on community, art, vision
- For AI agents: focus on utility, early access
- X posts: short, punchy, question or statement style
- Telegram: more detail, emoji usage appropriate
- 7-day plan: mix of announcements, memes, community questions, threads, AMAs, reminders`;

function buildUserPrompt(req: GenerateRequest): string {
  return [
    `Project Name: ${req.projectName}`,
    `Project Type: ${req.projectType}`,
    `Project Description: ${req.projectDescription}`,
    `Target Audience: ${req.targetAudience}`,
    `Stage: ${req.stage}`,
    `Tone: ${req.tone}`,
    `Website / Links: ${req.websiteLinks || "Not provided"}`,
    ``,
    `Generate all 7 content types in the JSON format specified.`,
    `Make it sound authentic to ${req.projectType} projects at ${req.stage} stage.`,
  ].join("\n");
}

export class LLMRefusedError extends Error {
  constructor(message = "LLM_REFUSED") {
    super(message);
  }
}

export class LLMUpstreamError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super("LLM_UPSTREAM");
    this.status = status;
    this.detail = detail;
  }
}

export async function generateWithLLM(req: GenerateRequest): Promise<{
  output: GeneratedContent;
  promptTokens: number;
  completionTokens: number;
}> {
  const cfg = getTextProviderConfig();
  const apiKey = cfg.apiKey;
  if (!apiKey) {
    throw new LLMUpstreamError(500, "TEXT_API_KEY 未配置（provider: " + cfg.provider + " / model: " + cfg.model + " / key: " + maskKey(apiKey) + "）");
  }

  const baseUrl = cfg.baseUrl;
  const model = cfg.model;
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const body = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: 2500,
    stream: false,
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "network error";
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new LLMUpstreamError(504, "Upstream timeout");
    }
    throw new LLMUpstreamError(502, `Network error: ${msg}`);
  }

  if (!res.ok) {
    const detail = await safeReadText(res);
    throw new LLMUpstreamError(res.status, detail);
  }

  let data: DeepSeekResponse;
  try {
    const rawText = await res.text();
    data = JSON.parse(rawText);
  } catch {
    throw new LLMUpstreamError(502, "Upstream returned non-JSON");
  }

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new LLMUpstreamError(502, "Empty content from upstream");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new LLMUpstreamError(502, `JSON parse failed: ${content.slice(0, 200)}`);
  }

  const xThreadRaw = parsed.xThread;
  const xThread = Array.isArray(xThreadRaw)
    ? xThreadRaw.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 7)
    : [];

  const planRaw = parsed.sevenDayContentPlan;
  const sevenDayContentPlan = Array.isArray(planRaw)
    ? planRaw.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 7)
    : [];

  const output: GeneratedContent = {
    xPost: String(parsed.xPost ?? "").trim(),
    xThread,
    telegramAnnouncement: String(parsed.telegramAnnouncement ?? "").trim(),
    telegramPinnedMessage: String(parsed.telegramPinnedMessage ?? "").trim(),
    memeImagePrompt: String(parsed.memeImagePrompt ?? "").trim(),
    communityEngagementPost: String(parsed.communityEngagementPost ?? "").trim(),
    sevenDayContentPlan,
  };

  if (!output.xPost && !output.telegramAnnouncement) {
    throw new LLMUpstreamError(502, "All content fields empty");
  }

  return {
    output,
    promptTokens: data.usage?.prompt_tokens ?? 0,
    completionTokens: data.usage?.completion_tokens ?? 0,
  };
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return `<status=${res.status}>`;
  }
}
