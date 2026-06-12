// ============================================================
// Partnership Announcement Generator · LLM 客户端（DeepSeek，OpenAI 兼容协议）
//
// 哲学：单次调用、JSON Mode 强制结构化、token 预算适中
// 成本控制：max_tokens 2000，partnership announcements 内容较长
// ============================================================

import type { GenerateRequest, GeneratedContent } from "./types";

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

const DEFAULT_BASE_URL = "https://api.dddai.dev/v1";
const DEFAULT_MODEL = "gpt-5.4-mini";

const SYSTEM_PROMPT = `You are a Web3 marketing expert specializing in crafting authentic partnership announcements.
You write for real projects like LayerZero, Arbitrum, Base, Polygon, and EigenLayer.

Task: Generate partnership announcements in 4 versions simultaneously.
Only output valid JSON. No explanations, no markdown fences, no prefix text.

Output JSON schema:
{
  "twitter": "string (280 chars max, punchy, engagement-focused, hashtags at end)",
  "telegram": "string (400-800 chars, channel format, emojis, line breaks, call-to-action links)",
  "discord": "string (500-1000 chars, server announcement format, bold section headers, bullet points, friendly tone)",
  "medium": "string (800-1500 words, full article, headline, intro paragraph, sections, conclusion, formatted with plain text line breaks)"
}

Each version must cover these elements (adapt length & style per platform):
- Partnership background: what's the context, why now
- Partnership value: what specifically does this change
- Both parties' strengths: what each side brings, not empty praise
- User benefits: concrete things users can do or get from this
- Call to action: specific next steps
- Links area: where to learn more

Tone guide:
- Professional: formal, precise, institutional language
- Exciting: energetic, forward-looking, visionary
- Community-first: warm, inclusive, speaks to members directly
- Investor-focused: milestones, metrics, strategic positioning

Style rules:
- Sound like a real project announcement, not an AI press release
- Avoid empty buzzwords like "revolutionary," "game-changing," "next-generation"
- Avoid exaggerated claims; stick to concrete statements
- Use natural language variation; avoid repetitive sentence structures
- Mention real-sounding specifics instead of generic filler
- No emojis in twitter/medium content except where appropriate; telegram/discord can have selective emoji usage
- Do NOT use phrases like "we are excited to announce" if they feel overdone; mix it up
- Do NOT invent token tickers, technical specs, or fake metrics unless provided in the input`;

function buildUserPrompt(req: GenerateRequest): string {
  return [
    `Project A: ${req.projectAName}`,
    `Project A Description: ${req.projectADescription}`,
    ``,
    `Project B: ${req.projectBName}`,
    `Project B Description: ${req.projectBDescription}`,
    ``,
    `Partnership Type: ${req.partnershipType}`,
    `Main Benefits / What This Does: ${req.mainBenefits}`,
    `Relevant Website Links: ${req.websiteLinks}`,
    `Tone: ${req.tone}`,
    `Length: ${req.length}`,
    ``,
    `Generate the 4 platform versions (twitter, telegram, discord, medium) as JSON.`,
    `The "medium" version should be the longest and most thorough; twitter the shortest and most punchy.`,
    `Adapt the depth and detail per the "Length" setting: Short = concise, Medium = standard, Long = detailed.`,
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
  const apiKey = process.env.IMAGE_API_KEY;
  if (!apiKey) {
    throw new LLMUpstreamError(500, "IMAGE_API_KEY 未配置");
  }

  const baseUrl = DEFAULT_BASE_URL;
  const model = process.env.IMAGE_MODEL ?? DEFAULT_MODEL;

  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const body = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2000,
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
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "network error";
    throw new LLMUpstreamError(502, `网络层故障: ${msg}`);
  }

  if (!res.ok) {
    const detail = await safeReadText(res);
    throw new LLMUpstreamError(res.status, detail);
  }

  const data = (await res.json()) as DeepSeekResponse;
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new LLMUpstreamError(502, "上游返回空 content");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new LLMUpstreamError(502, `JSON 解析失败: ${content.slice(0, 200)}`);
  }

  const output: GeneratedContent = {
    twitter: String(parsed.twitter ?? "").trim(),
    telegram: String(parsed.telegram ?? "").trim(),
    discord: String(parsed.discord ?? "").trim(),
    medium: String(parsed.medium ?? "").trim(),
  };

  if (!output.twitter && !output.telegram && !output.discord && !output.medium) {
    throw new LLMUpstreamError(502, "所有平台内容均为空");
  }

  return {
    output,
    promptTokens: data.usage?.prompt_tokens ?? 0,
    completionTokens: data.usage?.completion_tokens ?? 0,
  };
}

// ------------------------------------------------------------
// helpers
// ------------------------------------------------------------

async function safeReadText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return `<status=${res.status}>`;
  }
}
