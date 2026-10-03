type MediaType =
  | "image"
  | "video"
  | "chart"
  | "report"
  | "comparison"
  | "case-study";

type AspectRatio = "16:9" | "4:3" | "1:1" | "3:4" | "16:10";

// Illustrative response counts only; these are not observed client results.
const sampleResponseCount = 20;
const sampleBrands = [
  { name: "Your project", mentions: 7 },
  { name: "Competitor A", mentions: 12 },
  { name: "Competitor B", mentions: 10 },
];

function sampleMentionRate(mentions: number) {
  return `${Math.round((mentions / sampleResponseCount) * 100)}%`;
}

function ReportVisual() {
  return (
    <div className="evidence-ui evidence-ui--report">
      <div className="evidence-ui__topline">
        <span className="evidence-ui__brand">molthub</span>
        <span className="evidence-ui__sample">SAMPLE DATA</span>
      </div>
      <div className="evidence-ui__heading">
        <div>
          <small>WEB3 AI VISIBILITY AUDIT</small>
          <strong>Evidence before promises.</strong>
        </div>
        <b aria-label="Sample prompt presence">{sampleMentionRate(sampleBrands[0].mentions)}</b>
      </div>
      <div className="evidence-ui__metrics">
        <span>
          <small>Prompt presence</small>
          <b>{`${sampleBrands[0].mentions} / ${sampleResponseCount}`}</b>
        </span>
        <span>
          <small>Competitor A mentions</small>
          <b>{`${sampleBrands[1].mentions} / ${sampleResponseCount}`}</b>
        </span>
        <span>
          <small>Fact conflicts</small>
          <b>2 found</b>
        </span>
      </div>
      <div className="evidence-ui__chart" aria-label="Sample brand mention rates across the same 20 responses">
        {sampleBrands.map((brand) => (
          <span
            key={brand.name}
            aria-label={`${brand.name}: ${sampleMentionRate(brand.mentions)}`}
            style={{ width: sampleMentionRate(brand.mentions) }}
          />
        ))}
      </div>
      <div className="evidence-ui__footer">
        <span>Prompt presence</span>
        <span>Citation Sources</span>
        <span>Priority Actions</span>
      </div>
    </div>
  );
}

function ChartVisual({ process }: { process: boolean }) {
  if (process) {
    return (
      <div className="evidence-ui evidence-ui--flow">
        {["Submit", "Review", "Verify", "Improve", "Retest"].map(
          (step, index) => (
            <span key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              <small>{step}</small>
            </span>
          ),
        )}
      </div>
    );
  }

  return (
    <div className="evidence-ui evidence-ui--bars">
      <div className="evidence-ui__topline">
        <span>PROMPT MENTION RATE · 20 RESPONSES</span>
        <span className="evidence-ui__sample">SAMPLE DATA</span>
      </div>
      {sampleBrands.map((brand) => (
        <div className="evidence-bar" key={brand.name}>
          <span>{brand.name}</span>
          <i>
            <b style={{ width: sampleMentionRate(brand.mentions) }} />
          </i>
          <strong>{sampleMentionRate(brand.mentions)}</strong>
        </div>
      ))}
    </div>
  );
}

function ComparisonVisual() {
  return (
    <div className="evidence-ui evidence-ui--comparison">
      <div>
        <small>BEFORE REVIEW</small>
        <strong>Category unclear</strong>
        <span>Sources conflict</span>
        <span>Claims are hard to verify</span>
      </div>
      <b aria-hidden="true">→</b>
      <div>
        <small>AFTER IMPLEMENTATION</small>
        <strong>Positioning aligned</strong>
        <span>Core facts verified</span>
        <span>Evidence is easier to cite</span>
      </div>
      <em>Report format. Project results are calculated separately.</em>
    </div>
  );
}

function CaseVisual({ label }: { label: string }) {
  const title = label.replace(" Visual", "");

  return (
    <div className="evidence-ui evidence-ui--case">
      <strong>{title}</strong>
      <div>
        <span>
          <small>01</small>
          Challenge
        </span>
        <span>
          <small>02</small>
          Finding
        </span>
        <span>
          <small>03</small>
          Next action
        </span>
      </div>
      <p>Case format. Client evidence is published only with permission.</p>
    </div>
  );
}

function VideoVisual({ compact }: { compact: boolean }) {
  return (
    <div className="evidence-ui evidence-ui--video">
      <span className="evidence-ui__play" aria-hidden="true">
        ▶
      </span>
      <div>
        <small>{compact ? "VIDEO MODULE" : "REPORT WALKTHROUGH"}</small>
        <strong>{compact ? "English visual story" : "Evidence → Context → Action"}</strong>
      </div>
      <div className="evidence-ui__timeline">
        <span />
        <b>00:00</b>
        <b>01:30</b>
      </div>
    </div>
  );
}

function ResearchVisual() {
  return (
    <div className="evidence-ui evidence-ui--research">
      <div className="evidence-ui__topline">
        <span>molthub RESEARCH</span>
        <span>WEB3 GEO</span>
      </div>
      <strong>How AI understands a Web3 product</strong>
      <div>
        <span>DISCOVER</span>
        <span>VERIFY</span>
        <span>CITE</span>
      </div>
    </div>
  );
}

export function MediaPlaceholder({
  type,
  label,
  description,
  aspectRatio = "16:9",
  compact = false,
  src,
  alt,
}: {
  type: MediaType;
  label: string;
  description: string;
  aspectRatio?: AspectRatio;
  compact?: boolean;
  src?: string;
  alt?: string;
}) {
  const processChart = label.toLowerCase().includes("process");
  const hasImage = Boolean(src);

  return (
    <figure
      className={`media-placeholder media-placeholder--visual ${compact ? "media-placeholder--compact" : ""} ${hasImage ? "media-placeholder--image" : ""}`}
      style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
      aria-label={`${label}. ${description}`}
    >
      {src ? (
        <img
          className="media-placeholder__image"
          src={src}
          alt={alt ?? label}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <>
          {type === "report" ? <ReportVisual /> : null}
          {type === "chart" ? <ChartVisual process={processChart} /> : null}
          {type === "comparison" ? <ComparisonVisual /> : null}
          {type === "case-study" ? <CaseVisual label={label} /> : null}
          {type === "video" ? <VideoVisual compact={compact} /> : null}
          {type === "image" ? <ResearchVisual /> : null}
        </>
      )}
    </figure>
  );
}
