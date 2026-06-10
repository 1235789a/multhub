// ============================================================
// Token Poster Generator · API（Edge 兼容）
//
// POST /api/token-poster/generate
// Headers: X-License: <license_code>
// Body:    GenerateRequest
//
// 流程：
//   1. 校验 license（可选）
//   2. 校验输入字段
//   3. 构建动态 prompt
//   4. 调用 AI 图像生成 API
//   5. license 用量自增（仅成功后）
//   6. 返回 GenerateResponse
//
// 错误码：
//   400 INVALID_INPUT
//   402 INVALID_LICENSE / LICENSE_EXHAUSTED
//   502 AI_UPSTREAM
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  findLicenseUsage,
  incrementLicenseUsage,
  type LicenseUsageRecord,
} from "@/lib/firestore-client";
import type {
  GenerateRequest,
  PosterType,
  VisualStyle,
  ColorTheme,
} from "@/app/apps/token-poster-generator/types";

const PRODUCT_SLUG = "token-poster-generator";
const AI_API_BASE_URL = process.env.AI_API_BASE_URL;
const AI_API_KEY = process.env.AI_API_KEY;
const AI_IMAGE_MODEL = process.env.AI_IMAGE_MODEL || "gpt-image-2";

const VALID_POSTER_TYPES: PosterType[] = ["Partnership", "AMA", "Airdrop", "Launch"];

const VALID_VISUAL_STYLES: VisualStyle[] = [
  "Professional",
  "Minimal",
  "Premium",
  "Cyberpunk",
  "Meme",
];

const VALID_COLOR_THEMES: ColorTheme[] = ["Blue", "Purple", "Green", "Black Gold", "Red"];

// ------------------------------------------------------------
// 输入校验
// ------------------------------------------------------------

function validateInput(body: unknown): GenerateRequest | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "请求体必须是 JSON 对象" };
  }
  const o = body as Record<string, unknown>;

  const posterTypeRaw = String(o.posterType ?? "").trim();
  if (!VALID_POSTER_TYPES.includes(posterTypeRaw as PosterType)) {
    return {
      error: `posterType 需为以下之一: ${VALID_POSTER_TYPES.join(", ")}`,
    };
  }
  const posterType = posterTypeRaw as PosterType;

  const projectName = String(o.projectName ?? "").trim();
  if (!projectName || projectName.length > 100) {
    return { error: "projectName 长度需在 1~100 字符" };
  }

  const ticker = String(o.ticker ?? "").trim();
  if (!ticker || ticker.length > 20) {
    return { error: "ticker 长度需在 1~20 字符" };
  }

  const subtitle = String(o.subtitle ?? "").trim();
  if (subtitle.length > 200) {
    return { error: "subtitle 长度需 ≤ 200 字符" };
  }

  const visualStyleRaw = String(o.visualStyle ?? "").trim();
  if (!VALID_VISUAL_STYLES.includes(visualStyleRaw as VisualStyle)) {
    return {
      error: `visualStyle 需为以下之一: ${VALID_VISUAL_STYLES.join(", ")}`,
    };
  }
  const visualStyle = visualStyleRaw as VisualStyle;

  const colorThemeRaw = String(o.colorTheme ?? "").trim();
  if (!VALID_COLOR_THEMES.includes(colorThemeRaw as ColorTheme)) {
    return {
      error: `colorTheme 需为以下之一: ${VALID_COLOR_THEMES.join(", ")}`,
    };
  }
  const colorTheme = colorThemeRaw as ColorTheme;

  const result: GenerateRequest = {
    posterType,
    projectName,
    ticker,
    subtitle,
    visualStyle,
    colorTheme,
  };

  if (posterType === "Partnership") {
    const partnerName = String(o.partnerName ?? "").trim();
    if (!partnerName || partnerName.length > 100) {
      return { error: "partnerName 长度需在 1~100 字符" };
    }
    result.partnerName = partnerName;
  }

  if (posterType === "AMA") {
    const guestName = String(o.guestName ?? "").trim();
    if (!guestName || guestName.length > 100) {
      return { error: "guestName 长度需在 1~100 字符" };
    }
    result.guestName = guestName;
    result.amaDate = String(o.amaDate ?? "").trim();
  }

  if (posterType === "Airdrop") {
    const rewardAmount = String(o.rewardAmount ?? "").trim();
    if (!rewardAmount || rewardAmount.length > 50) {
      return { error: "rewardAmount 长度需在 1~50 字符" };
    }
    result.rewardAmount = rewardAmount;
    result.campaignName = String(o.campaignName ?? "").trim();
  }

  if (posterType === "Launch") {
    result.launchDate = String(o.launchDate ?? "").trim();
    result.network = String(o.network ?? "").trim();
    if (!result.network || result.network.length > 50) {
      return { error: "network 长度需在 1~50 字符" };
    }
  }

  return result;
}

// ------------------------------------------------------------
// 构建图像生成 Prompt
// ------------------------------------------------------------

function buildPrompt(req: GenerateRequest): string {
  const styleMap: Record<VisualStyle, string> = {
    Professional: "professional corporate style, clean design, high quality",
    Minimal: "minimalist design, clean background, simple elegant",
    Premium: "luxury premium style, high-end design, sophisticated",
    Cyberpunk: "cyberpunk futuristic style, neon lights, tech aesthetic",
    Meme: "funny meme style, humorous, internet culture",
  };

  const colorMap: Record<ColorTheme, string> = {
    Blue: "blue color scheme, professional blue tones",
    Purple: "purple color scheme, royal purple tones",
    Green: "green color scheme, fresh green tones",
    "Black Gold": "black and gold color scheme, luxurious",
    Red: "red color scheme, vibrant red tones",
  };

  let subject = "";
  let details = "";

  switch (req.posterType) {
    case "Partnership":
      subject = `Partnership announcement between ${req.projectName} (${req.ticker}) and ${req.partnerName}`;
      details = `Two company logos, collaboration concept, strategic alliance`;
      break;
    case "AMA":
      subject = `AMA announcement poster for ${req.projectName} (${req.ticker})`;
      details = `Guest: ${req.guestName}${req.amaDate ? `, Date: ${req.amaDate}` : ""}, live event, community engagement`;
      break;
    case "Airdrop":
      subject = `Airdrop campaign poster for ${req.projectName} (${req.ticker})`;
      details = `Reward: ${req.rewardAmount}${req.campaignName ? `, Campaign: ${req.campaignName}` : ""}, token distribution, celebration`;
      break;
    case "Launch":
      subject = `Token launch poster for ${req.projectName} (${req.ticker})`;
      details = `${req.network}${req.launchDate ? `, Launch Date: ${req.launchDate}` : ""}, rocket launch concept, exciting announcement`;
      break;
  }

  const subtitleText = req.subtitle ? `, subtitle: "${req.subtitle}"` : "";

  return `Create a stunning Web3 cryptocurrency poster for ${subject}${subtitleText}. Visual style: ${styleMap[req.visualStyle]}. Color theme: ${colorMap[req.colorTheme]}. Details: ${details}. Include token ticker prominently. Modern digital art, high resolution, professional graphic design, suitable for social media sharing.`;
}

// ------------------------------------------------------------
// License 校验（可选）
// ------------------------------------------------------------

interface LicenseCheckResult {
  bypass?: boolean;
  record?: LicenseUsageRecord;
  error?: { status: number; message: string };
}

function isValidLicenseFormat(license: string): boolean {
  return /^[A-Z0-9]{8,}-[A-Z0-9]{8,}-[A-Z0-9]{8,}$/.test(license);
}

async function checkLicense(request: NextRequest): Promise<LicenseCheckResult> {
  const license = (request.headers.get("x-license") ?? "").trim();

  if (!license || license.length < 8) {
    return {};
  }

  if (process.env.TOKEN_POSTER_LICENSE_BYPASS === "1") {
    return { bypass: true };
  }

  if (!isValidLicenseFormat(license)) {
    console.warn(`授权码格式不正确: ${license.substring(0, 20)}...`);
    return {};
  }

  let record: LicenseUsageRecord | null;
  try {
    record = await findLicenseUsage(license);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("findLicenseUsage 失败:", msg);
    return { error: { status: 502, message: "授权码校验服务暂不可用" } };
  }

  if (!record) {
    return { error: { status: 402, message: "授权码不存在或已失效" } };
  }

  if (record.productSlug !== PRODUCT_SLUG) {
    return {
      error: {
        status: 402,
        message: `此授权码不适用于本工具（属于 ${record.productSlug}）`,
      },
    };
  }

  if (record.usedCount >= record.quota) {
    return {
      error: { status: 402, message: `授权码用量已达上限（${record.quota} 次）` },
    };
  }

  return { record };
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------

export async function POST(request: NextRequest) {
  const lic = await checkLicense(request);
  if (lic.error) {
    return NextResponse.json(
      { success: false, error: lic.error.status === 402 ? "INVALID_LICENSE" : "UPSTREAM", message: lic.error.message },
      { status: lic.error.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", message: "请求体不是合法的 JSON" },
      { status: 400 },
    );
  }

  const v = validateInput(body);
  if ("error" in v) {
    return NextResponse.json(
      { success: false, error: "INVALID_INPUT", message: v.error },
      { status: 400 },
    );
  }
  const req: GenerateRequest = v;

  const prompt = buildPrompt(req);

  if (!AI_API_BASE_URL || !AI_API_KEY) {
    return NextResponse.json(
      { success: false, error: "INTERNAL", message: "AI API 配置未完成，请联系管理员配置 AI_API_BASE_URL 和 AI_API_KEY 环境变量" },
      { status: 500 },
    );
  }

  let imageUrl: string | undefined;
  try {
    const res = await fetch(`${AI_API_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_IMAGE_MODEL,
        prompt,
        response_format: "url",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || "AI 图像生成失败";
      console.error("AI 图像生成错误:", msg);
      return NextResponse.json(
        { success: false, error: "AI_UPSTREAM", message: msg },
        { status: 502 },
      );
    }

    imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "AI_UPSTREAM", message: "AI 未返回有效图像" },
        { status: 502 },
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI 服务调用失败";
    console.error("AI 图像生成异常:", msg);
    return NextResponse.json(
      { success: false, error: "AI_UPSTREAM", message: "AI 服务暂时不可用，请稍后再试" },
      { status: 502 },
    );
  }

  let remainingQuota = 0;
  if (lic.bypass) {
    remainingQuota = 9999;
  } else if (lic.record) {
    remainingQuota = lic.record.quota - lic.record.usedCount - 1;
    incrementLicenseUsage(lic.record.license, lic.record).catch((err) => {
      const m = err instanceof Error ? err.message : "unknown";
      console.warn("incrementLicenseUsage 失败 (非致命):", m);
    });
  }

  return NextResponse.json({
    success: true,
    imageUrl,
    remainingQuota,
    prompt,
  });
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "METHOD_NOT_ALLOWED", message: "仅支持 POST" },
    { status: 405 },
  );
}