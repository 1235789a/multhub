// ============================================================
// Tariff Lens · 关税预估 API（Edge 兼容）
//
// POST /api/tariff-lens/estimate
// Headers: X-License: <license_code>
// Body:    EstimateRequest（见 lib/tariff/types.ts）
//
// 流程：
//   1. 校验 license（命中配额限制）
//   2. 单次 LLM 调用（DeepSeek，JSON Mode）
//   3. 数学兜底层 → 风险评级
//   4. license 用量自增（best-effort）
//   5. 返回 EstimateResponse
//
// 错误码：
//   400 INVALID_INPUT
//   402 INVALID_LICENSE / LICENSE_EXHAUSTED
//   422 LLM_REFUSED（描述过模糊）
//   502 LLM_UPSTREAM
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  findLicenseUsage,
  incrementLicenseUsage,
  type LicenseUsageRecord,
} from "@/lib/firestore-client";
import { calculate } from "@/lib/tariff/calculator";
import {
  classifyWithLLM,
  LLMRefusedError,
  LLMUpstreamError,
} from "@/lib/tariff/llm";
import { assessRisk } from "@/lib/tariff/risk";
import type {
  EstimateRequest,
  EstimateResponse,
} from "@/lib/tariff/types";

const PRODUCT_SLUG = "tariff-lens";
const DISCLAIMER =
  "本结果由 AI 推理 + 静态规则计算生成，仅供参考。最终归类、税率与税费以目的国海关裁定为准。";

// ------------------------------------------------------------
// 输入校验
// ------------------------------------------------------------

function validateInput(body: unknown): EstimateRequest | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "请求体必须是 JSON 对象" };
  }
  const o = body as Record<string, unknown>;

  const description = String(o.description ?? "").trim();
  if (description.length < 4 || description.length > 500) {
    return { error: "description 长度需在 4~500 字符" };
  }

  const destination = String(o.destination ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(destination)) {
    return { error: "destination 需为 ISO-3166 alpha-2 大写字母" };
  }

  const originCountry = String(o.originCountry ?? "CN").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(originCountry)) {
    return { error: "originCountry 需为 ISO-3166 alpha-2 大写字母" };
  }

  const declaredValue = Number(o.declaredValue);
  if (!Number.isFinite(declaredValue) || declaredValue <= 0 || declaredValue > 1_000_000) {
    return { error: "declaredValue 需为正数且 ≤1,000,000" };
  }

  const currency = String(o.currency ?? "USD").trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) {
    return { error: "currency 需为 ISO-4217 三位字母" };
  }

  const shippingCost = o.shippingCost == null ? 0 : Number(o.shippingCost);
  const insuranceCost = o.insuranceCost == null ? 0 : Number(o.insuranceCost);
  if (!Number.isFinite(shippingCost) || shippingCost < 0) {
    return { error: "shippingCost 必须为 ≥0 的数字" };
  }
  if (!Number.isFinite(insuranceCost) || insuranceCost < 0) {
    return { error: "insuranceCost 必须为 ≥0 的数字" };
  }

  return {
    description,
    destination,
    originCountry,
    declaredValue,
    currency,
    shippingCost,
    insuranceCost,
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

  // 开发期 bypass：方便 demo / 自测，正式环境务必将 env 设为 0
  if (process.env.TARIFF_LENS_LICENSE_BYPASS === "1") {
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
  // 1. License
  const lic = await checkLicense(request);
  if (!lic.ok) {
    return NextResponse.json(
      { error: lic.status === 402 ? "INVALID_LICENSE" : "UPSTREAM", message: lic.error },
      { status: lic.status },
    );
  }

  // 2. Body
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
  const req: EstimateRequest = v;

  // 3. LLM
  let llmResult;
  try {
    llmResult = await classifyWithLLM(req);
  } catch (err) {
    if (err instanceof LLMRefusedError) {
      return NextResponse.json(
        {
          error: "LLM_REFUSED",
          message: "商品描述过于模糊，无法准确归类",
          needs: err.needs,
        },
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

  // 4. 数学兜底 + 风险评级
  const calculation = calculate(req, llmResult.output);
  const risk = assessRisk(req, llmResult.output, calculation);

  // 5. 用量自增（best-effort，失败不阻塞）
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

  // 6. 响应
  const response: EstimateResponse = {
    input: req,
    llmOutput: llmResult.output,
    calculation,
    riskLevel: risk.level,
    riskReasons: risk.reasons,
    disclaimer: DISCLAIMER,
    meta: {
      licenseUsage,
      licenseQuota,
      promptTokens: llmResult.promptTokens,
      completionTokens: llmResult.completionTokens,
    },
  };

  return NextResponse.json(response);
}

// 显式禁用 GET（防误访问）
export async function GET() {
  return NextResponse.json(
    { error: "METHOD_NOT_ALLOWED", message: "仅支持 POST" },
    { status: 405 },
  );
}
