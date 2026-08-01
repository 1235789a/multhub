import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

function publicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const config = publicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!config || !serviceRoleKey) return null;

  return createClient(config.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function getRequestUser(request: Request): Promise<User | null> {
  const config = publicConfig();
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
  const admin = getSupabaseAdmin();
  if (!admin) return;

  await admin.from("product_events").insert({
    name,
    user_id: userId ?? null,
    anonymous_id: anonymousId ?? null,
    metadata: metadata ?? {},
  });
}
