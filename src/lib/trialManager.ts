import FingerprintJS from '@fingerprintjs/fingerprintjs';

// 简单加密混淆函数，防止用户直接修改 localStorage
function encodeData(key: string, value: number): string {
  const timestamp = Date.now().toString(36);
  const salt = Math.random().toString(36).substring(2, 8);
  const encoded = btoa(`${key}:${value}:${timestamp}:${salt}`);
  return encoded;
}

function decodeData(data: string): { key: string; value: number } | null {
  try {
    const decoded = atob(data);
    const parts = decoded.split(':');
    if (parts.length >= 2) {
      return { key: parts[0], value: parseInt(parts[1], 10) };
    }
  } catch {
    // 解码失败，返回 null
  }
  return null;
}

let fpPromise: Promise<string> | null = null;

// 初始化 FingerprintJS 并获取设备指纹
export async function getVisitorId(): Promise<string> {
  if (!fpPromise) {
    fpPromise = (async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
      } catch {
        // 如果 FingerprintJS 失败，使用降级方案生成一个简单的 ID
        const fallbackId = localStorage.getItem('fallback_visitor_id') || 
          `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        if (!localStorage.getItem('fallback_visitor_id')) {
          localStorage.setItem('fallback_visitor_id', fallbackId);
        }
        return fallbackId;
      }
    })();
  }
  return fpPromise;
}

// 存储试用次数
function setTrialCount(visitorId: string, productSlug: string, count: number): void {
  const key = `trial_${productSlug}_${visitorId}`;
  localStorage.setItem(key, encodeData(key, count));
}

// 获取试用次数
function getTrialCount(visitorId: string, productSlug: string): number {
  const key = `trial_${productSlug}_${visitorId}`;
  const data = localStorage.getItem(key);
  if (data) {
    const decoded = decodeData(data);
    if (decoded && decoded.key === key && !isNaN(decoded.value)) {
      return decoded.value;
    }
  }
  return 0;
}

// 增加试用次数
export function incrementTrialCount(visitorId: string, productSlug: string): number {
  const current = getTrialCount(visitorId, productSlug);
  const next = current + 1;
  setTrialCount(visitorId, productSlug, next);
  return next;
}

// 检查是否可以试用
export function canUseTrial(
  visitorId: string, 
  productSlug: string, 
  maxUses: number
): boolean {
  const count = getTrialCount(visitorId, productSlug);
  return count < maxUses;
}

// 获取当前试用次数
export function getCurrentTrialCount(
  visitorId: string, 
  productSlug: string
): number {
  return getTrialCount(visitorId, productSlug);
}

// 检查用户是否有授权码（简化版检查）
export function hasValidLicense(license: string): boolean {
  return license.trim().length > 0;
}
