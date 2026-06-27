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

const DEFAULT_BASE_URL = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";

const SYSTEM_PROMPT = `You are a Web3 visual content specialist. You create detailed image generation prompts and visual briefs for small Web3 projects.

Task: Generate a complete visual content package for a Web3 project. Output valid JSON only. No markdown, no explanations, no prefix text.

Output JSON schema:
{
  "imagePrompt": "string (detailed image generation prompt suitable for Midjourney, DALL-E, Leonardo, Ideogram, or similar tools. Include style, composition, colors, mood, subject description. No text in the image. No fake logos. No financial symbols like dollar signs or rockets unless appropriate for the project style.)",
  "negativePrompt": "string (what to avoid in image generation: blurry, low quality, distorted text, fake brand logos, real exchange logos, financial promises, dollar signs, rockets, scammy visuals, cluttered layout, etc.)",
  "visualBrief": "string (300-600 chars, describe the visual concept, target platform, intended emotional response, how it fits the project's brand identity)",
  "headlineText": "string (suggested overlay text for the image, if any. Keep it short and punchy, 5-10 words max. Write it as a caption/hashtag style text that could go below the image on social media.)",
  "captionText": "string (100-200 chars, social media caption that pairs with this visual, includes call-to-action or engagement hook, suitable for X/Twitter)",
  "layoutTips": ["array of 4 strings, each is one practical tip for how to use this visual: sizing for different platforms, where to place text overlay, recommended color adjustments, composition notes"],
  "variants": ["array of 4 strings, each describes one alternative visual direction: different style, different focal point, different emotional tone, suitable for A/B testing or different campaigns"]
}

Rules:
- Prompts must be specific, actionable, and copy-paste ready for popular AI image tools
- No guaranteed profit / no 100x / no pump language
- No fake partnerships or fake KOL mentions
- Do not make up specific token prices, metrics, or investor claims
- Content must be suitable for small Web3 projects: meme coins, NFTs, AI agents, Telegram bots, DeFi tools, crypto communities
- Style the prompts to match the requested visual style (Cyberpunk, Clean Web3, Meme/Degen, Futuristic, Premium Fintech, Dark Crypto, Cute Mascot)
- Include relevant Web3 aesthetics: blockchain elements, community vibes, crypto symbols, decentralized identity, etc. where appropriate
- Make prompts detailed enough that any AI image model can generate a quality result
- HeadlineText should be catchy and engagement-focused, not financial advice`;

function buildUserPrompt(req: GenerateRequest): string {
  const sections = [
    `Project Name: ${req.projectName}`,
    `Project Type: ${req.projectType}`,
    `Project Description: ${req.projectDescription}`,
    `Visual Goal: ${req.visualGoal}`,
    `Style: ${req.style}`,
    `Tone: ${req.tone}`,
    `Key Message: ${req.keyMessage}`,
  ];

  if (req.brandColors) {
    sections.push(`Brand Colors: ${req.brandColors}`);
  }
  if (req.logoDescription) {
    sections.push(`Logo Description: ${req.logoDescription}`);
  }

  sections.push("", "Generate all 7 fields in the JSON format specified.");

  return sections.join("\n");
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
  const apiKey =
    process.env.PARTNERSHIP_API_KEY ?? process.env.IMAGE_API_KEY;
  if (!apiKey) {
    throw new LLMUpstreamError(500, "API key not configured");
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

  const layoutTipsRaw = parsed.layoutTips;
  const layoutTips = Array.isArray(layoutTipsRaw)
    ? layoutTipsRaw.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 5)
    : [];

  const variantsRaw = parsed.variants;
  const variants = Array.isArray(variantsRaw)
    ? variantsRaw.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 5)
    : [];

  const output: GeneratedContent = {
    imagePrompt: String(parsed.imagePrompt ?? "").trim(),
    negativePrompt: String(parsed.negativePrompt ?? "").trim(),
    visualBrief: String(parsed.visualBrief ?? "").trim(),
    headlineText: String(parsed.headlineText ?? "").trim(),
    captionText: String(parsed.captionText ?? "").trim(),
    layoutTips,
    variants,
  };

  if (!output.imagePrompt) {
    throw new LLMUpstreamError(502, "Image prompt is empty");
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
