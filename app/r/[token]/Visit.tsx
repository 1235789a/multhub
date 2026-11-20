"use client";

import { useEffect } from "react";

export default function Visit({ token }: { token: string }) {
  useEffect(() => {
    const controller = new AbortController();
    const confirm = (event: Event) => {
      if (!event.isTrusted || document.visibilityState !== "visible") return;
      controller.abort();
      navigator.sendBeacon(`/r/${token}/visit`);
    };
    for (const event of ["pointerdown", "keydown", "touchstart"]) {
      window.addEventListener(event, confirm, { passive: true, signal: controller.signal });
    }
    return () => controller.abort();
  }, [token]);
  return null;
}
