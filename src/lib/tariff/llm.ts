// ============================================================
// Tariff Lens · LLM 客户端（DeepSeek，OpenAI 兼容协议）
//
// 哲学：单次调用、JSON Mode 强制结构化、严格 token 预算
// 成本控制：max_tokens 600，prompt 紧凑，输入 ~ 500 / 输出 ~ 400
//   DeepSeek-Chat 单价: $0.27 / 1M input + $1.10 / 1M output
//   单次成本 ≈ $0.00058 ≈ ¥0.004
//   单授权 100 次配额 ≈ ¥0.4 成本，对比 ¥29 售价 = 70x 毛利
// ============================================================

import type { EstimateRequest, LLMOutput } from "./types";

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
const DEFAULT_MODEL = "deepseek-v4-flash";

const SYSTEM_PROMPT = `你是国际贸易海关分类专家。仅输出 JSON，禁止任何解释性文字。

任务：根据商品自然语言描述，推理 HS Code 并估算最惠国关税税率。

强约束：
1. hsCode：6~10 位数字（不含点），覆盖目的国/地区适用版本
2. hsConfidence：0~1 之间小数；模糊描述给 0.4~0.6；专业描述给 0.8~0.95
3. alternativeHsCodes：至多 3 条，每条带 reason
4. tariffRateGuess：0~0.6 之间，最惠国基础税率（不含附加税）
5. antiDumpingHint：仅在你确定该原产国 → 目的国对此 HS Prefix 长期存在反倾销时填，否则 null
6. 描述过短或完全无法推理时，返回 {"error": "TOO_VAGUE", "needs": ["材质", "用途"]}

不要编造不存在的法规。优先严谨，宁可低置信度也不要瞎猜高税率。`;

function buildUserPrompt(req: EstimateRequest): string {
  return [
    `商品: ${req.description}`,
    `原产国: ${req.originCountry}`,
    `目的国: ${req.destination}`,
    `申报价值: ${req.declaredValue} ${req.currency}`,
    "",
    "输出 JSON:",
    "{",
    `  "hsCode": "...",`,
    `  "hsConfidence": 0.0,`,
    `  "hsReasoning": "...",`,
    `  "category": "...",`,
    `  "alternativeHsCodes": [{ "code": "...", "reason": "..." }],`,
    `  "tariffRateGuess": 0.0,`,
    `  "antiDumpingHint": null`,
    "}",
  ].join("\n");
}

/** 自定义错误：LLM 拒绝推理 */
export class LLMRefusedError extends Error {
  needs: string[];
  constructor(needs: string[]) {
    super("LLM_REFUSED");
    this.needs = needs;
  }
}

/** 自定义错误：上游故障 */
export class LLMUpstreamError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super("LLM_UPSTREAM");
    this.status = status;
    this.detail = detail;
  }
}

/** 主调用：单次 LLM 调用，返回结构化输出 + token 计费
 * 内部自动重试 2 次（网络抖动时指数退避：5s → 15s） */
export async function classifyWithLLM(req: EstimateRequest): Promise<{
  output: LLMOutput;
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
    temperature: 0.1,
    max_tokens: 600,
    stream: true,
  };

  const MAX_RETRIES = 2;
  const delays = [5_000, 15_000]; // 指数退避

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
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
        if (attempt < MAX_RETRIES) {
          await sleep(delays[attempt]);
          continue;
        }
        throw new LLMUpstreamError(504, "上游请求超时，请稍后再试（网络较慢，已重试）");
      }
      throw new LLMUpstreamError(502, `网络层故障: ${msg}`);
    }

    if (!res.ok) {
      const detail = await safeReadText(res);
      if (attempt < MAX_RETRIES) {
        await sleep(delays[attempt]);
        continue;
      }
      throw new LLMUpstreamError(res.status, detail);
    }

    // 解析 SSE 格式
    const rawText = await res.text();
    const { content, usage } = parseSSE(rawText);
    if (!content) {
      if (attempt < MAX_RETRIES) {
        await sleep(delays[attempt]);
        continue;
      }
      throw new LLMUpstreamError(502, "上游返回空 content");
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      if (attempt < MAX_RETRIES) {
        await sleep(delays[attempt]);
        continue;
      }
      throw new LLMUpstreamError(502, `JSON 解析失败: ${content.slice(0, 200)}`);
    }

    // ---- 拒绝路径 ----
    if (parsed.error === "TOO_VAGUE") {
      const needs = Array.isArray(parsed.needs)
        ? (parsed.needs as string[])
        : ["材质", "用途", "规格"];
      throw new LLMRefusedError(needs);
    }

    // ---- 字段标准化与防御 ----
    const output: LLMOutput = {
      hsCode: String(parsed.hsCode ?? "").trim(),
      hsConfidence: clampNum(parsed.hsConfidence, 0, 1, 0.5),
      hsReasoning: String(parsed.hsReasoning ?? "").trim(),
      category: String(parsed.category ?? "").trim(),
      alternativeHsCodes: normalizeAlternatives(parsed.alternativeHsCodes),
      tariffRateGuess: clampNum(parsed.tariffRateGuess, 0, 0.6, 0.05),
      antiDumpingHint: normalizeAntiDumping(parsed.antiDumpingHint),
    };

    if (!output.hsCode || output.hsCode.replace(/[^0-9]/g, "").length < 4) {
      if (attempt < MAX_RETRIES) {
        await sleep(delays[attempt]);
        continue;
      }
      throw new LLMUpstreamError(502, `HS Code 无效: "${output.hsCode}"`);
    }

    return {
      output,
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
    };
  } // end retry for

  throw new LLMUpstreamError(500, "Unexpected: max retries reached without return");
}

// ------------------------------------------------------------
// helpers
// ------------------------------------------------------------

function clampNum(
  raw: unknown,
  lo: number,
  hi: number,
  fallback: number,
): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(lo, Math.min(hi, n));
}

function normalizeAlternatives(
  raw: unknown,
): Array<{ code: string; reason: string }> {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 3)
    .map((item) => {
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        return {
          code: String(o.code ?? "").trim(),
          reason: String(o.reason ?? "").trim(),
        };
      }
      return { code: "", reason: "" };
    })
    .filter((x) => x.code);
}

function normalizeAntiDumping(
  raw: unknown,
): { applies: boolean; rateGuess: number; reason: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!o.applies) return null;
  return {
    applies: true,
    rateGuess: clampNum(o.rateGuess, 0, 1, 0),
    reason: String(o.reason ?? "").trim(),
  };
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return `<status=${res.status}>`;
  }
}

function parseSSE(
  raw: string,
): { content: string; usage: { prompt_tokens?: number; completion_tokens?: number } } {
  const lines = raw.split("\n");
  let content = "";
  let usage: { prompt_tokens?: number; completion_tokens?: number } = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (payload === "[DONE]") continue;
    try {
      const json = JSON.parse(payload);
      // 从 delta.content
      const delta = json.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta.length > 0) {
        content += delta;
      }
      // 从最后一个包含 usage 的块取 token 计数
      if (json.usage && typeof json.usage === "object") {
        usage = json.usage;
      }
    } catch {
      // 忽略解析失败的行
    }
  }
  return { content, usage };
}
