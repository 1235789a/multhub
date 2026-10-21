export type ScanSignal = {
  label: string;
  passed: boolean;
  detail: string;
  checked?: boolean;
};

export const SIGNALS = [
  "Clear page title",
  "Useful meta description",
  "Structured data",
  "FAQ signal",
  "Documentation signal",
  "Canonical URL",
  "AI search crawler access",
] as const;

export type HedgehogKind =
  | "invisible" | "spiky" | "sleepy" | "detective" | "explorer"
  | "king" | "cosmic" | "librarian" | "builder";

export type HedgehogType = {
  kind: HedgehogKind;
  title: string;
  line: string;
  reason: string;
  accent: string;
};

const TYPES: Record<HedgehogKind, Omit<HedgehogType, "kind">> = {
  invisible: {
    title: "Invisible Hedgehog",
    line: "I'm here. The crawler might disagree.",
    reason: "The robots.txt check detected a blocking rule for OAI-SearchBot.",
    accent: "#9B8DE1",
  },
  spiky: {
    title: "Spiky Hedgehog",
    line: "My spikes have more structure than my homepage.",
    reason: "Only two or fewer of seven homepage readiness checks passed.",
    accent: "#EF735E",
  },
  sleepy: {
    title: "Sleepy Hedgehog",
    line: "Wake me when my homepage explains itself.",
    reason: "The page title and meta description both need attention.",
    accent: "#A9A2DB",
  },
  detective: {
    title: "Detective Hedgehog",
    line: "I found the docs. Still hunting for the schema.",
    reason: "Documentation was detected, but JSON-LD structured data was not.",
    accent: "#5DA5BD",
  },
  explorer: {
    title: "Explorer Hedgehog",
    line: "I found the map. Where's the FAQ?",
    reason: "Documentation is present, while a FAQ signal was not found.",
    accent: "#6CAE89",
  },
  king: {
    title: "Hedgehog King",
    line: "Seven checks. One extremely long spine.",
    reason: "All seven measured homepage readiness checks passed.",
    accent: "#E4A92F",
  },
  cosmic: {
    title: "Cosmic Hedgehog",
    line: "My metadata is in another galaxy.",
    reason: "Structured data, FAQ, and canonical signals were detected with at least five passing checks.",
    accent: "#9981EA",
  },
  librarian: {
    title: "Librarian Hedgehog",
    line: "My answers are organized. My docs are hiding.",
    reason: "FAQ and structured data signals are present, but documentation was not detected.",
    accent: "#4E9CBA",
  },
  builder: {
    title: "Builder Hedgehog",
    line: "Under construction. Spikes included.",
    reason: "The measured mix of signals does not match a more specific character pattern.",
    accent: "#D69A66",
  },
};

export function classifyHedgehog(signals: ReadonlyArray<ScanSignal>): HedgehogType {
  const get = (label: string) => signals.find((signal) => signal.label === label);
  const has = (label: string) => get(label)?.checked !== false && get(label)?.passed === true;
  const fails = (label: string) => get(label)?.checked !== false && get(label)?.passed === false;
  const passed = signals.filter((signal) => signal.checked !== false && signal.passed).length;
  const known = signals.filter((signal) => signal.checked !== false).length;

  let kind: HedgehogKind = "builder";
  if (fails("AI search crawler access")) kind = "invisible";
  else if (known === SIGNALS.length && passed === SIGNALS.length) kind = "king";
  else if (known >= 6 && passed <= 2) kind = "spiky";
  else if (fails("Clear page title") && fails("Useful meta description")) kind = "sleepy";
  else if (has("Documentation signal") && fails("Structured data")) kind = "detective";
  else if (has("Documentation signal") && fails("FAQ signal")) kind = "explorer";
  else if (has("Structured data") && has("FAQ signal") && has("Canonical URL") && passed >= 5) kind = "cosmic";
  else if (has("Structured data") && has("FAQ signal") && fails("Documentation signal")) kind = "librarian";

  return { kind, ...TYPES[kind] };
}

export type HedgehogSnapshot = {
  snapshotId: string;
  scannedAt: string;
  website: string;
  projectName: string;
  category: string;
  score: number;
  signals: ScanSignal[];
  hedgehog: HedgehogType;
  note: string;
};

export type PublicHedgehog = Omit<HedgehogSnapshot, "website" | "projectName"> & {
  projectName?: string;
  website?: string;
  reportId: string;
};

export function publicSnapshot(snapshot: HedgehogSnapshot, id: string, showIdentity: boolean): PublicHedgehog {
  return {
    reportId: id,
    snapshotId: snapshot.snapshotId,
    scannedAt: snapshot.scannedAt,
    category: snapshot.category,
    score: snapshot.score,
    signals: snapshot.signals.map((signal) => ({
      label: signal.label,
      passed: signal.passed,
      checked: signal.checked,
      detail: signal.detail,
    })),
    hedgehog: classifyHedgehog(snapshot.signals),
    note: snapshot.note,
    ...(showIdentity ? { website: snapshot.website, projectName: snapshot.projectName } : {}),
  };
}

export function compareSnapshots(before: HedgehogSnapshot, after: HedgehogSnapshot) {
  if (new URL(before.website).hostname.toLowerCase() !== new URL(after.website).hostname.toLowerCase()) return null;
  const changes = after.signals.flatMap((current) => {
    const previous = before.signals.find((item) => item.label === current.label);
    if (!previous || previous.checked === false || current.checked === false || previous.passed === current.passed) return [];
    return [{ label: current.label, from: previous.passed, to: current.passed }];
  });
  return {
    before: before.scannedAt,
    after: after.scannedAt,
    beforeScore: before.score,
    afterScore: after.score,
    changes,
    note: "Technical homepage checks only. These changes do not measure AI recommendations.",
  };
}

/** Fixed A/B assignment for a report snapshot; it never changes on refresh. */
export function hedgehogVariant(snapshotId: string): "A" | "B" {
  const last = Number.parseInt(snapshotId.replace(/-/g, "").slice(-2), 16);
  return Number.isFinite(last) && last % 2 ? "B" : "A";
}
