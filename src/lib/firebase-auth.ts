// ============================================================
// Firebase Service Account JWT 签发 + Access Token 缓存
//
// Edge Runtime 兼容 (Cloudflare Workers / Pages)
// 基于 jose 库 (Web Crypto API) — 零 Node 依赖
//
// 工作流程:
// 1. 读取 FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
// 2. 用 RS256 签一个有效期 1 小时的 JWT
// 3. POST 到 oauth2.googleapis.com/token 换 OAuth2 Access Token
// 4. 内存缓存 token (有效期 - 5 分钟安全边际)
// 5. 后续请求命中缓存直接返回
//
// "永久免维护": 冷启动后首次调用触发 JWT 签名,
// 之后 ~55 分钟内零签名开销
// ============================================================

import { SignJWT, importPKCS8 } from "jose";

type PrivateKey = Awaited<ReturnType<typeof importPKCS8>>;

/** 所需 OAuth2 Scope — Firestore 数据库读写 */
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";

/** Google OAuth2 Token 端点 */
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

/** JWT Bearer 授权模式 */
const GRANT_TYPE = "urn:ietf:params:oauth:grant-type:jwt-bearer";

/** 缓存安全边际 — token 到期前 5 分钟即视为过期 */
const CACHE_SAFETY_MARGIN_MS = 5 * 60 * 1000;

/** 内存缓存的 Access Token (单个 Worker 实例生命周期内有效) */
let cachedToken: { token: string; expiresAt: number } | null = null;

/** 正在进行中的 token 请求 (防并发多次签名) */
let pendingTokenPromise: Promise<string> | null = null;

/** Private Key 导入后的 KeyLike 缓存 (避免重复解析 PEM) */
let cachedPrivateKey: PrivateKey | null = null;

/**
 * 读取并规范化 PEM 私钥
 * Cloudflare Dashboard 存储 secret 时可能把换行符转义成 \n 字面量,
 * 这里统一替换回真实换行符
 */
function normalizePrivateKey(raw: string): string {
  return raw.replace(/\\n/g, "\n").trim();
}

/**
 * 导入 PKCS8 PEM 私钥为 CryptoKey (只在首次调用时执行)
 */
async function getPrivateKey(): Promise<PrivateKey> {
  if (cachedPrivateKey) return cachedPrivateKey;

  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) {
    throw new Error("FIREBASE_PRIVATE_KEY 未配置");
  }

  const pem = normalizePrivateKey(raw);
  cachedPrivateKey = await importPKCS8(pem, "RS256");
  return cachedPrivateKey;
}

/**
 * 签发 JWT 并交换 Access Token
 */
async function fetchNewAccessToken(): Promise<{ token: string; expiresIn: number }> {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (!clientEmail) {
    throw new Error("FIREBASE_CLIENT_EMAIL 未配置");
  }

  const privateKey = await getPrivateKey();

  // ---- 构造 JWT ----
  // Google 要求:
  //   iss: 服务账号邮箱
  //   scope: 目标 API scope
  //   aud: https://oauth2.googleapis.com/token
  //   iat / exp: 有效期最长 1 小时
  const jwt = await new SignJWT({ scope: FIRESTORE_SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(clientEmail)
    .setAudience(GOOGLE_TOKEN_URL)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  // ---- 交换 Access Token ----
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: GRANT_TYPE,
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth2 交换失败 (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  if (!data.access_token) {
    throw new Error("Google OAuth2 返回缺少 access_token");
  }

  return {
    token: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * 获取 Firebase Access Token (命中缓存 / 防并发)
 *
 * 这是对外暴露的唯一接口.
 * 调用方不需要关心签名、缓存、并发等细节.
 */
export async function getFirebaseAccessToken(): Promise<string> {
  const now = Date.now();

  // 缓存命中
  if (cachedToken && cachedToken.expiresAt > now + CACHE_SAFETY_MARGIN_MS) {
    return cachedToken.token;
  }

  // 正在签发中 (防止并发 5 个请求同时签 5 次 JWT)
  if (pendingTokenPromise) {
    return pendingTokenPromise;
  }

  pendingTokenPromise = (async () => {
    try {
      const { token, expiresIn } = await fetchNewAccessToken();
      cachedToken = {
        token,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      return token;
    } finally {
      pendingTokenPromise = null;
    }
  })();

  return pendingTokenPromise;
}

/**
 * 手动清除 token 缓存 (测试用途 / 强制刷新)
 */
export function clearTokenCache() {
  cachedToken = null;
  pendingTokenPromise = null;
}
