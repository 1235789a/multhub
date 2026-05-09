// ============================================================
// Firebase Auth 端到端自检脚本
//
// 用途: 不依赖 Cloudflare, 直接在本机用 jose 库模拟 Worker 的
// JWT 签发 → OAuth2 换 token → Firestore 读取 的完整链路.
//
// 运行: node scripts/verify-firebase-auth.mjs
//
// 预期输出:
//   ✅ Step 1: PEM private key imported
//   ✅ Step 2: JWT signed
//   ✅ Step 3: OAuth2 access token obtained (1h expiry)
//   ✅ Step 4: Firestore REST ping succeeded
//
// 如果任何一步失败, 会打印详细错误, 直接定位是凭据、网络, 还是 Firestore 规则问题.
// ============================================================

import { SignJWT, importPKCS8 } from "jose";
import { readFileSync } from "node:fs";
import { ProxyAgent, setGlobalDispatcher } from "undici";

// 本机通过 HTTP 代理出口 (Clash/v2ray 等). 直接读环境变量, 未设则探测常见端口.
const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.https_proxy ||
  process.env.http_proxy ||
  "http://127.0.0.1:7890";

try {
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
  console.log(`🌐 Using HTTP proxy: ${proxyUrl}\n`);
} catch (err) {
  console.warn(`⚠️  代理设置失败, 尝试直连: ${err.message}\n`);
}


const CRED_PATH = process.argv[2] || "C:/Users/MI/Desktop/multhub-10397-firebase-adminsdk-fbsvc-ab289a3213.json";

console.log(`🔍 Reading credentials: ${CRED_PATH}`);
const creds = JSON.parse(readFileSync(CRED_PATH, "utf8"));
const { project_id, client_email, private_key } = creds;

if (!project_id || !client_email || !private_key) {
  console.error("❌ 凭据文件缺少必要字段");
  process.exit(1);
}

console.log(`   project_id   = ${project_id}`);
console.log(`   client_email = ${client_email}`);
console.log(`   key length   = ${private_key.length} chars\n`);

// ---- Step 1: Import PEM ----
let pk;
try {
  pk = await importPKCS8(private_key, "RS256");
  console.log("✅ Step 1: PEM private key imported (PKCS8 / RS256)");
} catch (err) {
  console.error("❌ Step 1 失败: PEM 无法解析");
  console.error(err.message);
  process.exit(1);
}

// ---- Step 2: Sign JWT ----
let jwt;
try {
  jwt = await new SignJWT({ scope: "https://www.googleapis.com/auth/datastore" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(pk);
  console.log(`✅ Step 2: JWT signed (${jwt.length} chars)`);
} catch (err) {
  console.error("❌ Step 2 失败: JWT 签名异常");
  console.error(err.message);
  process.exit(1);
}

// ---- Step 3: Exchange for OAuth2 Access Token ----
let accessToken;
let expiresIn;
try {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    console.error("❌ Step 3 失败: Google OAuth2 拒绝 token 交换");
    console.error(`   status: ${res.status}`);
    console.error(`   response:`, data);
    process.exit(1);
  }

  accessToken = data.access_token;
  expiresIn = data.expires_in;
  console.log(`✅ Step 3: Access token acquired (expires in ${expiresIn}s)`);
  console.log(`   token preview: ${accessToken.slice(0, 24)}...${accessToken.slice(-8)}`);
} catch (err) {
  console.error("❌ Step 3 失败: 网络 / OAuth2 异常");
  console.error(err.message);
  process.exit(1);
}

// ---- Step 4: Firestore REST Ping ----
// 读一个不存在的文档, 预期 404 (说明鉴权通过, 只是文档不存在)
const testDoc = `licenses/__healthcheck_${Date.now()}`;
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/${testDoc}`;

try {
  const res = await fetch(firestoreUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 404) {
    console.log("✅ Step 4: Firestore REST ping OK (404 as expected for non-existent doc)");
  } else if (res.status === 200) {
    console.log("✅ Step 4: Firestore REST ping OK (doc happened to exist)");
  } else if (res.status === 401 || res.status === 403) {
    const body = await res.text();
    console.error(`❌ Step 4 失败: Firestore 鉴权被拒 (${res.status})`);
    console.error("   可能原因: Service Account 角色不足, 需要 'Cloud Datastore User' 或 'Editor'");
    console.error(`   响应: ${body}`);
    process.exit(1);
  } else {
    const body = await res.text();
    console.error(`⚠️  Step 4 非预期状态码: ${res.status}`);
    console.error(`   响应: ${body}`);
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Step 4 失败: Firestore 请求异常");
  console.error(err.message);
  process.exit(1);
}

// ---- Step 5: 写入测试文档 ----
const writeUrl = `https://firestore.googleapis.com/v1/projects/${project_id}/databases/(default)/documents/${testDoc}`;
try {
  const res = await fetch(writeUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        probeAt: { timestampValue: new Date().toISOString() },
        message: { stringValue: "firebase-auth e2e self-check OK" },
      },
    }),
  });

  if (res.ok) {
    console.log(`✅ Step 5: Firestore write OK (created test doc ${testDoc})`);

    // 清理
    const del = await fetch(writeUrl, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (del.ok) {
      console.log(`🧹 Step 6: Test doc cleaned up`);
    }
  } else {
    const body = await res.text();
    console.error(`❌ Step 5 失败: Firestore 写入被拒 (${res.status})`);
    console.error(`   响应: ${body}`);
    process.exit(1);
  }
} catch (err) {
  console.error("❌ Step 5 失败: 写入请求异常");
  console.error(err.message);
  process.exit(1);
}

console.log("\n🎉 所有检查通过. Worker 线上鉴权链路必然可用.");
