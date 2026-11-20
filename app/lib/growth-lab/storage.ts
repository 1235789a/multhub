import { reportToken } from "./schema";
import type { Report } from "./model";

export class LabError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function bindings() {
  const { env } = await import("cloudflare:workers").catch(() => ({ env: {} }));
  const values = env as {
    LAB_DB?: D1Database;
    LAB_EVIDENCE?: R2Bucket;
    LAB_ADMIN_TOKEN?: string;
    LAB_CHECKOUT_MODE?: string;
  };
  return values;
}

export async function lab() {
  const env = await bindings();
  if (!env.LAB_DB || !env.LAB_EVIDENCE) {
    throw new LabError(503, "Growth Lab storage is unavailable.");
  }
  return { db: env.LAB_DB, evidence: env.LAB_EVIDENCE };
}

export async function sha256(input: string | Uint8Array<ArrayBuffer>) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function getReport(token: string) {
  if (!reportToken.test(token)) return null;
  const { db } = await lab();
  return db.prepare(`
    SELECT id, company_id, snapshot, expires_at FROM reports
    WHERE token_hash = ? AND expires_at > ? AND revoked_at IS NULL
  `).bind(await sha256(token), new Date().toISOString()).first<Report>();
}

export const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};
