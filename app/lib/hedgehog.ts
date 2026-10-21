export type ScanSignal = { label: string; passed: boolean | null; detail: string };

export const HEDGEHOG_TYPES = [
  "invisible", "spiky", "sleepy", "detective",
  "explorer", "king", "longboi", "scout",
] as const;
export type HedgehogKind = (typeof HEDGEHOG_TYPES)[number];

export type HedgehogIdentity = {
  kind: HedgehogKind;
  title: string;
  quip: string;
  explanation: string;
};

const profiles: Record<HedgehogKind, Omit<HedgehogIdentity, "kind">> = {
  invisible: {
    title: "THE INVISIBLE HEDGEHOG",
    quip: "My hedgehog got stopped at the crawler door. Who let it out?",
    explanation: "The robots.txt check found a full-site disallow rule for OAI-SearchBot or all crawlers.",
  },
  spiky: {
    title: "THE SPIKY HEDGEHOG",
    quip: "My hedgehog has more missing signals than spare quills.",
    explanation: "At least four measured homepage signals need attention.",
  },
  sleepy: {
    title: "THE SLEEPY HEDGEHOG",
    quip: "My homepage is apparently putting this hedgehog to sleep.",
    explanation: "Both the page-title and meta-description checks failed.",
  },
  detective: {
    title: "THE DETECTIVE HEDGEHOG",
    quip: "My hedgehog found structured clues. The documentation vanished.",
    explanation: "Structured data was detected, but no documentation signal was found.",
  },
  explorer: {
    title: "THE EXPLORER HEDGEHOG",
    quip: "My hedgehog found the docs and is hunting for the FAQs.",
    explanation: "Documentation was detected but a FAQ signal was not.",
  },
  king: {
    title: "THE HEDGEHOG KING",
    quip: "My hedgehog has a crown. The internet owes it no throne.",
    explanation: "All seven measured readiness signals passed. This is not an AI ranking.",
  },
  longboi: {
    title: "THE EXTRA-LONG HEDGEHOG",
    quip: "Why is my hedgehog longer than my homepage title?",
    explanation: "The scanned homepage title exceeds 70 characters.",
  },
  scout: {
    title: "THE SCOUT HEDGEHOG",
    quip: "My hedgehog is still scouting for the next website clue.",
    explanation: "Mixed technical signals did not match another distinct diagnostic pattern.",
  },
};

function status(signals: ScanSignal[], label: string) {
  return signals.find((signal) => signal.label === label)?.passed ?? null;
}

export function classifyHedgehog(signals: ScanSignal[], titleLength = 0): HedgehogIdentity {
  const value = (label: string) => status(signals, label);
  const gaps = signals.filter((s) => s.passed === false).length;
  let kind: HedgehogKind;
  if (value("AI search crawler access") === false) kind = "invisible";
  else if (titleLength > 70) kind = "longboi";
  else if (gaps === 0 && signals.every((s) => s.passed === true) && signals.length >= 7) kind = "king";
  else if (value("Clear page title") === false && value("Useful meta description") === false) kind = "sleepy";
  else if (gaps >= 4) kind = "spiky";
  else if (value("Structured data") === true && value("Documentation signal") === false) kind = "detective";
  else if (value("Documentation signal") === true && value("FAQ signal") === false) kind = "explorer";
  else kind = "scout";
  return { kind, ...profiles[kind] };
}

export function countSignals(signals: ScanSignal[]) {
  return {
    passed: signals.filter((s) => s.passed === true).length,
    failed: signals.filter((s) => s.passed === false).length,
    unknown: signals.filter((s) => s.passed === null).length,
    total: signals.length,
  };
}

export function compareSignals(
  previous: ScanSignal[], current: ScanSignal[],
  previousDate: string, currentDate: string,
) {
  const changes = current.flatMap((now) => {
    const before = previous.find((s) => s.label === now.label);
    if (!before || before.passed === now.passed) return [];
    return [{ label: now.label, before: before.passed, after: now.passed }];
  });
  return {
    previousDate, currentDate, changes,
    netPassChange: countSignals(current).passed - countSignals(previous).passed,
    label: "Measured technical signal changes only. No live AI model ranking was tested.",
  };
}
