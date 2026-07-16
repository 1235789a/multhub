import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Bindings } from "../types";

const jwksByDomain = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

export async function authenticateAdmin(request: Request, env: Bindings): Promise<string | null> {
  if (env.ENVIRONMENT !== "production" && env.DEV_ADMIN_BYPASS === "true") {
    return "local-admin@example.test";
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || !env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) return null;

  const domain = env.CF_ACCESS_TEAM_DOMAIN.replace(/\/$/, "");
  let jwks = jwksByDomain.get(domain);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`));
    jwksByDomain.set(domain, jwks);
  }

  try {
    const { payload } = await jwtVerify(token, jwks, { audience: env.CF_ACCESS_AUD });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
    if (!email) return null;
    const allowed = env.ADMIN_EMAILS.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
    return allowed.includes(email) ? email : null;
  } catch (error) {
    console.error("Cloudflare Access verification failed", error);
    return null;
  }
}

export async function verifyTurnstile(request: Request, env: Bindings, token?: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  const payload = new FormData();
  payload.set("secret", env.TURNSTILE_SECRET_KEY);
  payload.set("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) payload.set("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: payload,
  });
  if (!response.ok) return false;
  const result = await response.json<{ success?: boolean }>();
  return result.success === true;
}
