import { getSupabaseAdmin } from "./supabase-server";
import type { HedgehogIdentity, ScanSignal } from "./hedgehog";

export type StoredHedgehogReport = {
  id: string;
  website: string;
  project_name: string;
  category: string;
  score: number;
  scanned_at: string;
  signals: ScanSignal[];
  identity: HedgehogIdentity;
  published_at: string | null;
  show_website: boolean;
  show_brand: boolean;
};

export async function digestShareToken(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (v) => v.toString(16).padStart(2, "0")).join("");
}

export async function getAuthorizedReport(id: string, token: string): Promise<StoredHedgehogReport | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^[0-9a-f-]{64}$/i.test(token)) return null;
  const admin = await getSupabaseAdmin();
  if (!admin) return null;
  const hash = await digestShareToken(token);
  const { data } = await admin.from("hedgehog_reports")
    .select("id,website,project_name,category,score,scanned_at,signals,identity,published_at,show_website,show_brand")
    .eq("id", id).eq("share_token_hash", hash).maybeSingle();
  return (data ?? null) as StoredHedgehogReport | null;
}

export async function getPublicHedgehogReport(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const admin = await getSupabaseAdmin();
  if (!admin) return null;
  const { data } = await admin.from("hedgehog_reports")
    .select("id,website,project_name,category,score,scanned_at,signals,identity,published_at,show_website,show_brand")
    .eq("id", id).not("published_at", "is", null).maybeSingle();
  if (!data) return null;
  const row = data as Omit<StoredHedgehogReport, "website">;
  // Do not return private data to the browser; never send the unpublished website field.
  return {
    id: row.id,
    projectName: row.show_brand ? row.project_name : null,
    website: row.show_website ? (data as StoredHedgehogReport).website : null,
    score: row.score,
    date: row.scanned_at,
    identity: row.identity,
    signals: row.signals,
    counts: {
      passed: row.signals.filter((s) => s.passed === true).length,
      total: row.signals.filter((s) => s.passed !== null).length,
    },
  };
}
