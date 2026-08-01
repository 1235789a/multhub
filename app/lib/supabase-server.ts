import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

let cloudflareEnvPromise: Promise<Record<string, unknown>> | undefined;

function processEnv(name: string) {
  const processValue =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  return processValue || undefined;
}

async function runtimeEnv(name: string) {
  const processValue = processEnv(name);
  if (processValue) return processValue;

  cloudflareEnvPromise ??= import("cloudflare:workers")
    .then((module) => (module.env ?? {}) as Record<string, unknown>)
    .catch(() => ({}));
  const cloudflareEnv = await cloudflareEnvPromise;

  const workerValue = cloudflareEnv[name];
  return typeof workerValue === "string" ? workerValue : undefined;
}

async function publicConfig() {
  const url = await runtimeEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = await runtimeEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export async function getSupabaseAdmin(): Promise<SupabaseClient | null> {
  const config = await publicConfig();
  const serviceRoleKey = await runtimeEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!config || !serviceRoleKey) return null;

  return createClient(config.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getRequestUser(request: Request): Promise<User | null> {
  const config = await publicConfig();
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!config || !accessToken) return null;

  const authClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  const { data, error } = await authClient.auth.getUser(accessToken);
  if (error) return null;
  return data.user;
}

export async function recordProductEvent({
  name,
  userId,
  anonymousId,
  metadata,
}: {
  name: string;
  userId?: string | null;
  anonymousId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const admin = await getSupabaseAdmin();
  if (!admin) return;

  await admin.from("product_events").insert({
    name,
    user_id: userId ?? null,
    anonymous_id: anonymousId ?? null,
    metadata: metadata ?? {},
  });
}
