type MediaType =
  | "image"
  | "video"
  | "chart"
  | "report"
  | "comparison"
  | "case-study";

type AspectRatio = "16:9" | "4:3" | "1:1" | "3:4" | "16:10";

function ReportVisual() {
  return (
    <div className="evidence-ui evidence-ui--report">
      <div className="evidence-ui__topline">
        <span className="evidence-ui__brand">molthub</span>
        <span>ILLUSTRATIVE SAMPLE</span>
      </div>
      <div className="evidence-ui__heading">
        <div>
          <small>WEB3 AI VISIBILITY AUDIT</small>
          <strong>Evidence before promises.</strong>
        </div>
        <b>38%</b>
      </div>
      <div className="evidence-ui__metrics">
        <span>
          <small>Prompt presence</small>
          <b>7 / 20</b>
        </span>
        <span>
          <small>Competitor mentions</small>
          <b>12 / 20</b>
        </span>
        <span>
          <small>Fact conflicts</small>
          <b>2 found</b>
        </span>
      </div>
      <div className="evidence-ui__chart">
        <span style={{ width: "38%" }} />
        <span style={{ width: "66%" }} />
        <span style={{ width: "52%" }} />
      </div>
      <div className="evidence-ui__footer">
        <span>AI Visibility</span>
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
        <span>COMPETITOR SHARE OF VOICE</span>
        <span>SAMPLE</span>
      </div>
      {[
        ["Your project", "38%", "38%"],
        ["Competitor A", "66%", "66%"],
        ["Competitor B", "52%", "52%"],
      ].map(([name, value, width]) => (
        <div className="evidence-bar" key={name}>
          <span>{name}</span>
          <i>
            <b style={{ width }} />
          </i>
          <strong>{value}</strong>
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
      <em>Illustrative workflow — not a ranking guarantee</em>
    </div>
  );
}

function CaseVisual({ label }: { label: string }) {
  const title = label.replace(" Visual", "");
  const category = title.includes("Wallet")
    ? "WALLET"
    : title.includes("Developer")
      ? "INFRASTRUCTURE"
      : "PAYMENTS";

  return (
    <div className="evidence-ui evidence-ui--case">
      <div className="evidence-ui__topline">
        <span>{category}</span>
        <span>DIAGNOSTIC SAMPLE</span>
      </div>
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
      <p>No client claim. Structure ready for verified evidence.</p>
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
}: {
  type: MediaType;
  label: string;
  description: string;
  aspectRatio?: AspectRatio;
  compact?: boolean;
}) {
  const processChart = label.toLowerCase().includes("process");

  return (
    <figure
      className={`media-placeholder media-placeholder--visual ${compact ? "media-placeholder--compact" : ""}`}
      style={{ aspectRatio: aspectRatio.replace(":", " / ") }}
      aria-label={`${label}. ${description}`}
    >
      {type === "report" ? <ReportVisual /> : null}
      {type === "chart" ? <ChartVisual process={processChart} /> : null}
      {type === "comparison" ? <ComparisonVisual /> : null}
      {type === "case-study" ? <CaseVisual label={label} /> : null}
      {type === "video" ? <VideoVisual compact={compact} /> : null}
      {type === "image" ? <ResearchVisual /> : null}
    </figure>
  );
}
