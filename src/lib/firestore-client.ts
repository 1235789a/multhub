// ============================================================
// Firestore REST API 封装
//
// Edge Runtime 兼容 - 纯 fetch, 无 Node 依赖
// 用于:
//   - 写入授权记录 (license)
//   - 写入 / 查询 / 幂等检查交易记录 (txId)
//
// 所有调用自动携带 getFirebaseAccessToken() 返回的 OAuth2 token.
// ============================================================

import { getFirebaseAccessToken } from "./firebase-auth";

/** 授权记录结构 */
export interface LicenseRecord {
  txId: string;
  wallet: string;
  amountUsdt: number;
  license: string;
  productSlug: string;
  createdAt?: string;
  status?: "verified" | "pending" | "revoked";
}

/** Firestore 字段类型的 JS 值映射 */
type FirestoreValue =
  | { stringValue: string }
  | { doubleValue: number }
  | { integerValue: string }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null };

type FirestoreFields = Record<string, FirestoreValue>;

/** 将 JS 对象转换为 Firestore REST API 字段格式 */
function toFirestoreFields(record: Record<string, unknown>): FirestoreFields {
  const fields: FirestoreFields = {};

  for (const [key, value] of Object.entries(record)) {
    if (value === null || value === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof value === "string") {
      fields[key] = { stringValue: value };
    } else if (typeof value === "number") {
      fields[key] = Number.isInteger(value)
        ? { integerValue: String(value) }
        : { doubleValue: value };
    } else if (typeof value === "boolean") {
      fields[key] = { booleanValue: value };
    } else if (value instanceof Date) {
      fields[key] = { timestampValue: value.toISOString() };
    } else {
      // 其他复杂类型统一 JSON 序列化为 string (简化处理)
      fields[key] = { stringValue: JSON.stringify(value) };
    }
  }

  return fields;
}

/** 从 Firestore 字段格式反解析为 JS 对象 */
function fromFirestoreFields(fields: FirestoreFields): Record<string, unknown> {
  const obj: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fields)) {
    if ("stringValue" in value) obj[key] = value.stringValue;
    else if ("doubleValue" in value) obj[key] = value.doubleValue;
    else if ("integerValue" in value) obj[key] = Number(value.integerValue);
    else if ("booleanValue" in value) obj[key] = value.booleanValue;
    else if ("timestampValue" in value) obj[key] = value.timestampValue;
    else if ("nullValue" in value) obj[key] = null;
  }

  return obj;
}

/** 获取 Firestore REST base URL */
function getFirestoreBaseUrl(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID 未配置");
  }
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

/**
 * 创建或更新 document (upsert)
 * 使用 PATCH + updateMask 语义确保幂等
 */
async function upsertDocument(
  collectionPath: string,
  documentId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const token = await getFirebaseAccessToken();
  const baseUrl = getFirestoreBaseUrl();
  const url = `${baseUrl}/${collectionPath}/${encodeURIComponent(documentId)}`;

  const body = { fields: toFirestoreFields(data) };

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore upsert 失败 (${res.status}): ${errText}`);
  }
}

/**
 * 原子创建 document（仅当不存在时创建）
 * 用于实现防重放攻击的锁机制
 * @returns true 表示创建成功，false 表示已存在
 */
export async function createDocumentIfNotExists(
  collectionPath: string,
  documentId: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const token = await getFirebaseAccessToken();
  const baseUrl = getFirestoreBaseUrl();
  const url = `${baseUrl}/${collectionPath}/${encodeURIComponent(documentId)}?currentDocument.exists=false`;

  const body = { fields: toFirestoreFields(data) };

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    return true; // 创建成功
  } else if (res.status === 409 || res.status === 412) {
    return false; // 文档已存在
  } else {
    const errText = await res.text();
    throw new Error(`Firestore 条件创建失败 (${res.status}): ${errText}`);
  }
}

/**
 * 读取指定 document; 不存在返回 null
 */
async function getDocument(
  collectionPath: string,
  documentId: string,
): Promise<Record<string, unknown> | null> {
  const token = await getFirebaseAccessToken();
  const baseUrl = getFirestoreBaseUrl();
  const url = `${baseUrl}/${collectionPath}/${encodeURIComponent(documentId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Firestore get 失败 (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as { fields?: FirestoreFields };
  return data.fields ? fromFirestoreFields(data.fields) : null;
}

// ============================================================
// 业务层接口
// ============================================================

/**
 * 查询指定 TxID 是否已经发放过授权码 (幂等检查)
 * 用于防止同一笔链上交易被多次兑换
 */
export async function findLicenseByTxId(txId: string): Promise<LicenseRecord | null> {
  const doc = await getDocument("licenses", txId);
  if (!doc) return null;
  return doc as unknown as LicenseRecord;
}

/**
 * 写入授权记录 (doc id = txId, 天然去重)
 */
export async function writeLicense(record: LicenseRecord): Promise<void> {
  const payload: Record<string, unknown> = {
    txId: record.txId,
    wallet: record.wallet,
    amountUsdt: record.amountUsdt,
    license: record.license,
    productSlug: record.productSlug,
    createdAt: record.createdAt ?? new Date().toISOString(),
    status: record.status ?? "verified",
  };

  await upsertDocument("licenses", record.txId, payload);

  // 同步写入授权码 → 用量映射表（doc id = license code）
  // 用于工具端按 X-License 直接查到对应 productSlug + 用量
  await upsertDocument("license_usage", record.license, {
    license: record.license,
    productSlug: record.productSlug,
    txId: record.txId,
    usedCount: 0,
    quota: getDefaultQuota(record.productSlug),
    createdAt: record.createdAt ?? new Date().toISOString(),
    lastUsedAt: null,
  });
}

/** 已处理交易记录 */
export interface ProcessedTransactionRecord {
  txId: string;
  userId?: string;
  productId: string;
  amount: number;
  timestamp: string;
  status: "processed" | "pending" | "failed";
}

/**
 * 尝试获取处理锁（原子操作）
 * @returns true 表示成功获取锁（可以继续处理），false 表示已被其他请求处理
 */
export async function tryAcquireTransactionLock(
  txId: string,
  productId: string,
  amount: number,
  userId?: string,
): Promise<boolean> {
  return await createDocumentIfNotExists("processed_transactions", txId, {
    txId,
    userId: userId ?? "unknown",
    productId,
    amount,
    timestamp: new Date().toISOString(),
    status: "pending",
  });
}

/**
 * 更新交易记录状态
 */
export async function updateTransactionStatus(
  txId: string,
  status: "processed" | "failed",
): Promise<void> {
  await upsertDocument("processed_transactions", txId, {
    status,
    updatedAt: new Date().toISOString(),
  });
}

/** 各产品默认配额（购买后单授权码可用次数） */
function getDefaultQuota(productSlug: string): number {
  const quotas: Record<string, number> = {
    "tariff-lens": 100, // ¥29 = 4 USDT，按 100 次估算单次成本 < ¥0.01
    "markitdown-lite": 1000,
  };
  return quotas[productSlug] ?? 100;
}

/** 按 license code 查询用量记录 */
export interface LicenseUsageRecord {
  license: string;
  productSlug: string;
  txId: string;
  usedCount: number;
  quota: number;
  createdAt: string;
  lastUsedAt: string | null;
}

export async function findLicenseUsage(
  license: string,
): Promise<LicenseUsageRecord | null> {
  const doc = await getDocument("license_usage", license);
  if (!doc) return null;
  return doc as unknown as LicenseUsageRecord;
}

/** 用量自增 + 时间戳更新（不做严格的事务，足够防止单 license 大规模刷量） */
export async function incrementLicenseUsage(
  license: string,
  current: LicenseUsageRecord,
): Promise<void> {
  await upsertDocument("license_usage", license, {
    license: current.license,
    productSlug: current.productSlug,
    txId: current.txId,
    usedCount: current.usedCount + 1,
    quota: current.quota,
    createdAt: current.createdAt,
    lastUsedAt: new Date().toISOString(),
  });
}
