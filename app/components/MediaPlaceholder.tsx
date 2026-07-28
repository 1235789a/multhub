type MediaType =
  | "image"
  | "video"
  | "chart"
  | "report"
  | "comparison"
  | "case-study";

type AspectRatio = "16:9" | "4:3" | "1:1" | "3:4" | "16:10";

const symbols: Record<MediaType, string> = {
  image: "□",
  video: "▶",
  chart: "↗",
  report: "≡",
  comparison: "⇄",
  "case-study": "◇",
};

export function MediaPlaceholder({
  type,
  label,
  description,
  aspectRatio = "16:9",
  compact = false,
}: {
  type: MediaType;
  label: string;
  description: string;
  aspectRatio?: AspectRatio;
  compact?: boolean;
}) {
  return (
    <div
      className={`media-placeholder ${compact ? "media-placeholder--compact" : ""}`}
      style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
    >
      <span className="media-placeholder__symbol" aria-hidden="true">
        {symbols[type]}
      </span>
      <div>
        <p className="media-placeholder__label">{label}</p>
        <p className="media-placeholder__description">{description}</p>
      </div>
      <span className="media-placeholder__type">{type}</span>
    </div>
  );
}
