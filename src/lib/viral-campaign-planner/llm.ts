// ============================================================
// Viral Campaign Planner · LLM 客户端（DeepSeek，OpenAI 兼容协议）
// 单次调用、JSON Mode 强制结构化、max_tokens 3500
// ============================================================

import type { GenerateRequest } from "./types";

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

const DEFAULT_BASE_URL = "https://api.deepseek.com/v1";
const DEFAULT_MODEL = "deepseek-chat";

const SYSTEM_PROMPT = `You are a senior Web3 growth strategist.
You have experience designing campaigns for Meme Coins, DeFi protocols, AI Agent projects, Web3 SaaS, and crypto communities.

Task: Create a complete, actionable viral campaign plan.
Output must be structured, practical, and easy to execute.
Only output valid JSON. No explanations, no markdown fences, no prefix text.

Avoid generic marketing advice. Provide specific, actionable recommendations.
Focus on community growth, engagement, retention, and reward efficiency.

Output JSON schema:
{
  "overview": {
    "goal": "string - Specific, measurable campaign goal. 2-3 sentences.",
    "strategy": "string - Core strategic approach, why this works for the project type. 3-4 sentences.",
    "mechanics": "string - Recommended campaign mechanics (Airdrop / Giveaway / Ambassador / Growth). Explain which and why. 3-4 sentences."
  },
  "rewards": {
    "rewardMechanics": "string - Detailed reward mechanism, token distribution logic, tiered rewards. 4-5 sentences.",
    "rewardDistribution": "string - How rewards are distributed across participants, by tier/level. 3-4 sentences.",
    "budgetAllocation": "string - Budget breakdown across rewards, ops, promotion, contingency. Specific percentages per category. 3-4 sentences."
  },
  "tasks": {
    "recommendedTasks": "string - List of specific tasks users must complete (follow, like, retweet, join TG, invite, etc). Each task with point value. 5-7 tasks.",
    "participationFlow": "string - Step-by-step user participation flow from entry to reward claim. 4-5 steps.",
    "userJourney": "string - User journey map: discovery → registration → engagement → reward → retention. 4-5 sentences."
  },
  "promotion": {
    "twitter": "string - X/Twitter promotion plan. Content cadence, hashtags, engagement tactics, KOL outreach strategy. 4-5 sentences.",
    "telegram": "string - Telegram channel/group promotion. Pin messages, community calls, AMAs, moderation plan. 3-4 sentences.",
    "discord": "string - Discord server promotion. Role mechanics, activity channels, community events, mod team setup. 3-4 sentences."
  },
  "timeline": {
    "day1": "string - Day 1 execution plan (launch, announcement, initial push). 3-4 sentences.",
    "day2": "string - Day 2 execution plan (amplification, engagement push, KOL coordination). 3-4 sentences.",
    "day3": "string - Day 3 execution plan (peak engagement, community content, retention push). 3-4 sentences.",
    "keyMilestones": "string - Key checkpoints, metrics to monitor, decision gates throughout the campaign. 4-5 sentences."
  },
  "risks": {
    "sybilAttack": "string - Sybil attack vulnerability assessment and concrete prevention measures. 3-4 sentences.",
    "botWash": "string - Bot / fake account risk and detection strategies. 2-3 sentences.",
    "budgetWaste": "string - Budget waste risks and mitigation (reward farming, dead accounts). 2-3 sentences.",
    "complexity": "string - Campaign complexity risk; what to simplify. 2-3 sentences."
  },
  "optimization": {
    "engagement": "string - How to improve engagement rates. Specific tactics. 3-4 sentences.",
    "conversion": "string - How to improve conversion from participant to user/holder. 3-4 sentences.",
    "antiCheat": "string - Anti-cheat system recommendations: tools, checks, manual review process. 3-4 sentences."
  }
}

Style rules:
- Write like a real Web3 growth consultant, not a corporate press release
- Use concrete numbers, percentages, and specific platforms
- Avoid empty buzzwords (game-changing, revolutionary, next-gen)
- Be realistic about what can be achieved given the budget and duration
- Match recommendations to the project type and community size`;

function buildUserPrompt(req: GenerateRequest): string {
  return [
    `Project Name: ${req.projectName}`,
    `Project Type: ${req.projectType}`,
    `Project Description: ${req.projectDescription}`,
    ``,
    `Campaign Goal: ${req.campaignGoal}`,
    `Budget: ${req.budget}`,
    `Campaign Duration: ${req.duration}`,
    `Current Community Size: ${req.communitySize}`,
    `Target Region: ${req.targetRegion}`,
    `Campaign Style: ${req.campaignStyle}`,
    `Additional Notes: ${req.additionalNotes || "None"}`,
    ``,
    `Generate a complete, actionable viral campaign plan matching the JSON schema above.`,
    `Be specific. Use the project type, budget, and duration to tailor realistic recommendations.`,
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

type CampaignOutput = {
  overview: { goal: string; strategy: string; mechanics: string };
  rewards: { rewardMechanics: string; rewardDistribution: string; budgetAllocation: string };
  tasks: { recommendedTasks: string; participationFlow: string; userJourney: string };
  promotion: { twitter: string; telegram: string; discord: string };
  timeline: { day1: string; day2: string; day3: string; keyMilestones: string };
  risks: { sybilAttack: string; botWash: string; budgetWaste: string; complexity: string };
  optimization: { engagement: string; conversion: string; antiCheat: string };
};

export async function generateWithLLM(req: GenerateRequest): Promise<{
  output: CampaignOutput;
  promptTokens: number;
  completionTokens: number;
}> {
  const apiKey = process.env.DEEPSEEK_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new LLMUpstreamError(500, "DEEPSEEK_API_KEY 未配置");
  }

  const baseUrl =
    process.env.DEEPSEEK_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    DEFAULT_BASE_URL;
  const model =
    process.env.DEEPSEEK_MODEL ??
    process.env.OPENAI_MODEL ??
    DEFAULT_MODEL;

  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const body = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 3500,
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

  const ov = parsed.overview as Record<string, unknown> | undefined;
  const rw = parsed.rewards as Record<string, unknown> | undefined;
  const tk = parsed.tasks as Record<string, unknown> | undefined;
  const pr = parsed.promotion as Record<string, unknown> | undefined;
  const tl = parsed.timeline as Record<string, unknown> | undefined;
  const rk = parsed.risks as Record<string, unknown> | undefined;
  const op = parsed.optimization as Record<string, unknown> | undefined;

  const output: CampaignOutput = {
    overview: {
      goal: String(ov?.goal ?? "").trim(),
      strategy: String(ov?.strategy ?? "").trim(),
      mechanics: String(ov?.mechanics ?? "").trim(),
    },
    rewards: {
      rewardMechanics: String(rw?.rewardMechanics ?? "").trim(),
      rewardDistribution: String(rw?.rewardDistribution ?? "").trim(),
      budgetAllocation: String(rw?.budgetAllocation ?? "").trim(),
    },
    tasks: {
      recommendedTasks: String(tk?.recommendedTasks ?? "").trim(),
      participationFlow: String(tk?.participationFlow ?? "").trim(),
      userJourney: String(tk?.userJourney ?? "").trim(),
    },
    promotion: {
      twitter: String(pr?.twitter ?? "").trim(),
      telegram: String(pr?.telegram ?? "").trim(),
      discord: String(pr?.discord ?? "").trim(),
    },
    timeline: {
      day1: String(tl?.day1 ?? "").trim(),
      day2: String(tl?.day2 ?? "").trim(),
      day3: String(tl?.day3 ?? "").trim(),
      keyMilestones: String(tl?.keyMilestones ?? "").trim(),
    },
    risks: {
      sybilAttack: String(rk?.sybilAttack ?? "").trim(),
      botWash: String(rk?.botWash ?? "").trim(),
      budgetWaste: String(rk?.budgetWaste ?? "").trim(),
      complexity: String(rk?.complexity ?? "").trim(),
    },
    optimization: {
      engagement: String(op?.engagement ?? "").trim(),
      conversion: String(op?.conversion ?? "").trim(),
      antiCheat: String(op?.antiCheat ?? "").trim(),
    },
  };

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
