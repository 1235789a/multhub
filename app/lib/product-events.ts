"use client";

import type { Session } from "@supabase/supabase-js";

const ANONYMOUS_ID_KEY = "molthub_anonymous_id";

export function getAnonymousId() {
  if (typeof window === "undefined") return "";

  let id = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

export async function trackProductEvent(
  name: string,
  metadata: Record<string, unknown> = {},
  session?: Session | null,
) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(session?.access_token
          ? { authorization: `Bearer ${session.access_token}` }
          : {}),
      },
      body: JSON.stringify({
        name,
        anonymousId: getAnonymousId(),
        metadata,
      }),
      keepalive: true,
    });
  } catch {
    // Product analytics must never block the user flow.
  }
}
