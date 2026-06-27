import type { NextRequest } from "next/server";
import {
  findLicenseUsage,
  incrementLicenseUsage,
  getTrialUsage,
  incrementTrialUsage,
  type LicenseUsageRecord,
} from "./firestore-client";
import { PRODUCTS } from "@/app/data/products";

export interface EntitlementOk {
  ok: true;
  mode: "license" | "trial";
  licenseKey?: string;
  visitorId?: string;
  remainingUses: number;
  totalQuota: number;
  record?: LicenseUsageRecord;
}

export interface EntitlementBlocked {
  ok: false;
  status: number;
  error: string;
  errorCode: string;
}

export type EntitlementResult = EntitlementOk | EntitlementBlocked;

export async function checkEntitlement(
  request: NextRequest,
  productSlug: string,
): Promise<EntitlementResult> {
  const product = PRODUCTS.find((p) => p.slug === productSlug);
  if (!product) {
    return {
      ok: false,
      status: 400,
      error: "Product not found",
      errorCode: "PRODUCT_NOT_FOUND",
    };
  }

  const licenseKey = (request.headers.get("x-license") ?? "").trim();

  if (licenseKey && licenseKey.length >= 8) {
    return await checkLicense(licenseKey, productSlug);
  }

  const visitorId = (request.headers.get("x-visitor-id") ?? "").trim();

  if (product.trialConfig?.allowed && visitorId && visitorId.length >= 6) {
    return await checkTrial(visitorId, productSlug, product.trialConfig.maxUses);
  }

  return {
    ok: false,
    status: 402,
    error: "A valid license key is required. Purchase one from the store.",
    errorCode: "LICENSE_REQUIRED",
  };
}

async function checkLicense(
  licenseKey: string,
  productSlug: string,
): Promise<EntitlementResult> {
  let record: LicenseUsageRecord | null;
  try {
    record = await findLicenseUsage(licenseKey);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("findLicenseUsage failed:", msg);
    return {
      ok: false,
      status: 502,
      error: "License verification service unavailable",
      errorCode: "UPSTREAM_ERROR",
    };
  }

  if (!record) {
    return {
      ok: false,
      status: 402,
      error: "Invalid license key",
      errorCode: "INVALID_LICENSE",
    };
  }

  if (record.productSlug !== productSlug) {
    return {
      ok: false,
      status: 402,
      error: `This license is for ${record.productSlug}, not ${productSlug}`,
      errorCode: "WRONG_PRODUCT",
    };
  }

  if (record.usedCount >= record.quota) {
    return {
      ok: false,
      status: 402,
      error: `License quota exhausted (${record.quota} uses)`,
      errorCode: "LICENSE_EXHAUSTED",
    };
  }

  return {
    ok: true,
    mode: "license",
    licenseKey,
    remainingUses: record.quota - record.usedCount,
    totalQuota: record.quota,
    record,
  };
}

async function checkTrial(
  visitorId: string,
  productSlug: string,
  maxUses: number,
): Promise<EntitlementResult> {
  try {
    const trial = await getTrialUsage(productSlug, visitorId);
    const used = trial?.used ?? 0;

    if (used >= maxUses) {
      return {
        ok: false,
        status: 402,
        error: `Trial limit reached (${maxUses} free uses). Purchase a license to continue.`,
        errorCode: "TRIAL_EXHAUSTED",
      };
    }

    return {
      ok: true,
      mode: "trial",
      visitorId,
      remainingUses: maxUses - used,
      totalQuota: maxUses,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("checkTrial failed:", msg);
    return {
      ok: false,
      status: 502,
      error: "Trial service unavailable",
      errorCode: "UPSTREAM_ERROR",
    };
  }
}

export async function consumeEntitlement(
  productSlug: string,
  entitlement: EntitlementOk,
): Promise<void> {
  if (entitlement.mode === "license" && entitlement.record && entitlement.licenseKey) {
    incrementLicenseUsage(entitlement.licenseKey, entitlement.record).catch((err) => {
      const m = err instanceof Error ? err.message : "unknown";
      console.warn("incrementLicenseUsage failed (non-fatal):", m);
    });
  } else if (entitlement.mode === "trial" && entitlement.visitorId) {
    const product = PRODUCTS.find((p) => p.slug === productSlug);
    const maxUses = product?.trialConfig?.maxUses ?? 3;
    incrementTrialUsage(productSlug, entitlement.visitorId, maxUses).catch((err) => {
      const m = err instanceof Error ? err.message : "unknown";
      console.warn("incrementTrialUsage failed (non-fatal):", m);
    });
  }
}
