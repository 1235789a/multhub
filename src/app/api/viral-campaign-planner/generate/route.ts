// ============================================================
// Viral Campaign Planner · API（Edge 兼容）
//
// POST /api/viral-campaign-planner/generate
// Headers: X-License: <license_code>
//
// 流程：
//   1. 校验 license
//   2. 校验输入字段
//   3. 单次 LLM 调用（DeepSeek，JSON Mode）
//   4. license 用量自增（best-effort）
//   5. 返回结构化响应
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  findLicenseUsage,
  incrementLicenseUsage,
  type LicenseUsageRecord,
} from "@/lib/firestore-client";
import {
  generateWithLLM,
  LLMRefusedError,
  LLMUpstreamError,
} from "@/lib/viral-campaign-planner/llm";
import type {
  GenerateRequest,
  GenerateResponse,
  ProjectType,
  CampaignGoal,
  Budget,
  CampaignDuration,
  CommunitySize,
  TargetRegion,
  CampaignStyle,
} from "@/lib/viral-campaign-planner/types";

const PRODUCT_SLUG = "viral-campaign-planner";

const VALID_PROJECT_TYPES: ProjectType[] = [
  "Meme Coin",
  "AI Agent",
  "DeFi",
  "GameFi",
  "NFT",
  "Web3 SaaS",
];

const VALID_GOALS: CampaignGoal[] = [
  "Community Growth",
  "X Followers",
  "Telegram Members",
  "Product Awareness",
  "Beta User Acquisition",
  "Engagement Boost",
];

const VALID_BUDGETS: Budget[] = ["100 USDT", "500 USDT", "1000 USDT", "5000+ USDT"];
const VALID_DURATIONS: CampaignDuration[] = ["3 Days", "7 Days", "14 Days", "30 Days"];

const VALID_COMMUNITY_SIZES: CommunitySize[] = [
  "Under 100",
  "100+",
  "1000+",
  "10000+",
  "50000+",
];

const VALID_REGIONS: TargetRegion[] = ["Global", "Asia", "Europe", "North America"];

const VALID_STYLES: CampaignStyle[] = [
  "Aggressive Growth",
  "Balanced",
  "Community First",
  "Premium Brand",
];

// ------------------------------------------------------------
// 输入校验
// ------------------------------------------------------------

function validateInput(body: unknown): GenerateRequest | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "请求体必须是 JSON 对象" };
  }
  const o = body as Record<string, unknown>;

  const projectName = String(o.projectName ?? "").trim();
  if (!projectName || projectName.length > 120) {
    return { error: "projectName 长度需在 1~120 字符" };
  }

  const projectDescription = String(o.projectDescription ?? "").trim();
  if (projectDescription.length < 4 || projectDescription.length > 2000) {
    return { error: "projectDescription 长度需在 4~2000 字符" };
  }

  const projectTypeRaw = String(o.projectType ?? "").trim();
  if (!VALID_PROJECT_TYPES.includes(projectTypeRaw as ProjectType)) {
    return { error: `projectType 需为以下之一: ${VALID_PROJECT_TYPES.join(", ")}` };
  }
  const projectType = projectTypeRaw as ProjectType;

  const goalRaw = String(o.campaignGoal ?? "").trim();
  if (!VALID_GOALS.includes(goalRaw as CampaignGoal)) {
    return { error: `campaignGoal 需为以下之一: ${VALID_GOALS.join(", ")}` };
  }
  const campaignGoal = goalRaw as CampaignGoal;

  const budgetRaw = String(o.budget ?? "").trim();
  if (!VALID_BUDGETS.includes(budgetRaw as Budget)) {
    return { error: `budget 需为以下之一: ${VALID_BUDGETS.join(", ")}` };
  }
  const budget = budgetRaw as Budget;

  const durationRaw = String(o.duration ?? "").trim();
  if (!VALID_DURATIONS.includes(durationRaw as CampaignDuration)) {
    return { error: `duration 需为以下之一: ${VALID_DURATIONS.join(", ")}` };
  }
  const duration = durationRaw as CampaignDuration;

  const sizeRaw = String(o.communitySize ?? "").trim();
  if (!VALID_COMMUNITY_SIZES.includes(sizeRaw as CommunitySize)) {
    return { error: `communitySize 需为以下之一: ${VALID_COMMUNITY_SIZES.join(", ")}` };
  }
  const communitySize = sizeRaw as CommunitySize;

  const regionRaw = String(o.targetRegion ?? "").trim();
  if (!VALID_REGIONS.includes(regionRaw as TargetRegion)) {
    return { error: `targetRegion 需为以下之一: ${VALID_REGIONS.join(", ")}` };
  }
  const targetRegion = regionRaw as TargetRegion;

  const styleRaw = String(o.campaignStyle ?? "").trim();
  if (!VALID_STYLES.includes(styleRaw as CampaignStyle)) {
    return { error: `campaignStyle 需为以下之一: ${VALID_STYLES.join(", ")}` };
  }
  const campaignStyle = styleRaw as CampaignStyle;

  const additionalNotes = String(o.additionalNotes ?? "").trim();
  if (additionalNotes.length > 3000) {
    return { error: "additionalNotes 长度需 ≤ 3000 字符" };
  }

  return {
    projectType,
    campaignGoal,
    budget,
    duration,
    communitySize,
    targetRegion,
    campaignStyle,
    projectName,
    projectDescription,
    additionalNotes,
  };
}

// ------------------------------------------------------------
// License 校验
// ------------------------------------------------------------

interface LicenseCheckOk {
  ok: true;
  bypass?: boolean;
  record?: LicenseUsageRecord;
}
interface LicenseCheckFail {
  ok: false;
  status: number;
  error: string;
}

function isValidLicenseFormat(license: string): boolean {
  return /^[A-Z0-9]{8,}-[A-Z0-9]{8,}-[A-Z0-9]{8,}$/.test(license);
}

async function checkLicense(
  request: NextRequest,
): Promise<LicenseCheckOk | LicenseCheckFail> {
  const license = (request.headers.get("x-license") ?? "").trim();

  if (process.env.VIRAL_CAMPAIGN_PLANNER_LICENSE_BYPASS === "1") {
    return { ok: true, bypass: true };
  }

  if (!license || license.length < 8) {
    return { ok: false, status: 402, error: "缺少或无效的 X-License 授权码" };
  }

  if (!isValidLicenseFormat(license)) {
    console.warn(`授权码格式不正确，降级到试用模式: ${license.substring(0, 20)}...`);
    return { ok: false, status: 402, error: "授权码格式不正确，请留空以使用试用模式" };
  }

  let record: LicenseUsageRecord | null;
  try {
    record = await findLicenseUsage(license);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("findLicenseUsage 失败:", msg);
    return { ok: false, status: 502, error: "授权码校验服务暂不可用" };
  }

  if (!record) {
    return { ok: false, status: 402, error: "授权码不存在或已失效" };
  }

  if (record.productSlug !== PRODUCT_SLUG) {
    return {
      ok: false,
      status: 402,
      error: `此授权码不适用于本工具（属于 ${record.productSlug}）`,
    };
  }

  if (record.usedCount >= record.quota) {
    return {
      ok: false,
      status: 402,
      error: `授权码用量已达上限（${record.quota} 次）`,
    };
  }

  return { ok: true, record };
}

// ------------------------------------------------------------
// POST handler
// ------------------------------------------------------------

export async function POST(request: NextRequest) {
  const lic = await checkLicense(request);
  if (!lic.ok) {
    return NextResponse.json(
      { error: lic.status === 402 ? "INVALID_LICENSE" : "UPSTREAM", message: lic.error },
      { status: lic.status },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_INPUT", message: "请求体不是合法的 JSON" },
      { status: 400 },
    );
  }
  const v = validateInput(body);
  if ("error" in v) {
    return NextResponse.json(
      { error: "INVALID_INPUT", message: v.error },
      { status: 400 },
    );
  }
  const req: GenerateRequest = v;

  let llmResult;
  try {
    llmResult = await generateWithLLM(req);
  } catch (err) {
    if (err instanceof LLMRefusedError) {
      return NextResponse.json(
        { error: "LLM_REFUSED", message: "输入信息不足，无法生成活动策划方案" },
        { status: 422 },
      );
    }
    if (err instanceof LLMUpstreamError) {
      console.error("LLM 上游错误:", err.status, err.detail);
      return NextResponse.json(
        { error: "LLM_UPSTREAM", message: "AI 推理服务暂时不可用，请稍后再试" },
        { status: 502 },
      );
    }
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("LLM 未知错误:", msg);
    return NextResponse.json(
      { error: "INTERNAL", message: "服务器内部错误" },
      { status: 500 },
    );
  }

  let licenseUsage = 0;
  let licenseQuota = 0;
  if (lic.bypass) {
    licenseUsage = 0;
    licenseQuota = 9999;
  } else if (lic.record) {
    licenseUsage = lic.record.usedCount + 1;
    licenseQuota = lic.record.quota;
    incrementLicenseUsage(lic.record.license, lic.record).catch((err) => {
      const m = err instanceof Error ? err.message : "unknown";
      console.warn("incrementLicenseUsage 失败 (非致命):", m);
    });
  }

  const response: GenerateResponse = {
    success: true,
    overview: llmResult.output.overview,
    rewards: llmResult.output.rewards,
    tasks: llmResult.output.tasks,
    promotion: llmResult.output.promotion,
    timeline: llmResult.output.timeline,
    risks: llmResult.output.risks,
    optimization: llmResult.output.optimization,
    remainingQuota: licenseQuota - licenseUsage,
    meta: {
      licenseUsage,
      licenseQuota,
      promptTokens: llmResult.promptTokens,
      completionTokens: llmResult.completionTokens,
    },
  };

  return NextResponse.json(response);
}

export async function GET() {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED", message: "仅支持 POST" },
    { status: 405 },
  );
}
