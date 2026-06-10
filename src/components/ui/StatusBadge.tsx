// ============================================================
// 🟢 StatusBadge — 工具发布状态徽章（available / beta / forging / roadmap）
// ============================================================
// 单一职责：根据 ProductStatus 输出一个带颜色圆点的小胶囊。
// 不接 i18n，文本由调用方传入 → 方便在不同语境（hero status line /
// store grid / changelog）复用。

import type { ProductStatus } from "@/app/data/products";

export interface StatusBadgeProps {
  status: ProductStatus;
  /** 显式文本，未提供则回退到 status 的英文枚举 */
  label?: string;
  /** 紧凑模式：去掉左右 padding，仅圆点 + 文本 */
  compact?: boolean;
  className?: string;
}

interface StatusVisual {
  dot: string;
  text: string;
  bg: string;
  border: string;
}

const STATUS_VISUAL: Record<ProductStatus, StatusVisual> = {
  available: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  beta: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  forging: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  roadmap: {
    dot: "bg-zinc-400",
    text: "text-zinc-600",
    bg: "bg-zinc-50",
    border: "border-zinc-200",
  },
};

export default function StatusBadge({
  status,
  label,
  compact = false,
  className = "",
}: StatusBadgeProps) {
  const v = STATUS_VISUAL[status];
  const padding = compact ? "px-1.5 py-0" : "px-2 py-0.5";
  const text = label ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${v.bg} ${v.border} ${v.text} ${padding} text-[11px] font-medium ${className}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${v.dot} ${
          status === "forging" || status === "beta" ? "animate-pulse" : ""
        }`}
      />
      <span>{text}</span>
    </span>
  );
}

/** 把 status 映射成 i18n key 的小工具 */
export function statusLabelKey(status: ProductStatus): string {
  switch (status) {
    case "available":
      return "statusAvailable";
    case "beta":
      return "statusBeta";
    case "forging":
      return "statusForging";
    case "roadmap":
    default:
      return "statusRoadmap";
  }
}
