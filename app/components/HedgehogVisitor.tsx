"use client";
import { useEffect } from "react";
import { trackProductEvent } from "../lib/product-events";

export function HedgehogVisitor({ reportId }: { reportId: string }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    void trackProductEvent("hedgehog_share_visit", {
      reportId,
      utmSource: (params.get("utm_source") || "direct").slice(0, 60),
    });
  }, [reportId]);
  return null;
}
