import test from "node:test";
import assert from "node:assert/strict";
import {
  SIGNALS, classifyHedgehog, publicSnapshot, compareSnapshots,
} from "../app/lib/hedgehog.ts";
import { hedgehogGraphic, posterSvg } from "../app/lib/hedgehog-svg.ts";

const makeSignals = (passes, checked = true) =>
  SIGNALS.map((label, index) => ({
    label, passed: passes[index], checked, detail: "Observed technical signal",
  }));
const kind = (passes) => classifyHedgehog(makeSignals(passes)).kind;

test("each of nine hedgehogs is reachable via real signal patterns", () => {
  assert.equal(kind([1, 1, 1, 1, 1, 1, 1]), "king");
  assert.equal(kind([1, 1, 1, 1, 1, 1, 0]), "invisible");
  assert.equal(kind([1, 0, 0, 0, 0, 0, 1]), "spiky");
  assert.equal(kind([0, 0, 1, 1, 1, 1, 1]), "sleepy");
  assert.equal(kind([1, 1, 0, 1, 1, 1, 1]), "detective");
  assert.equal(kind([1, 1, 1, 0, 1, 1, 1]), "explorer");
  assert.equal(kind([1, 1, 1, 1, 0, 1, 1]), "cosmic");
  assert.equal(kind([1, 1, 1, 1, 0, 0, 1]), "librarian");
  assert.equal(kind([1, 1, 0, 0, 0, 1, 1]), "builder");
});

test("same evidence maps to the same hedgehog without randomization", () => {
  const signals = makeSignals([1, 1, 0, 1, 1, 1, 1]);
  assert.deepEqual(classifyHedgehog(signals), classifyHedgehog(structuredClone(signals)));
});
test("unknown robots status does not generate an invented crawler block", () => {
  const signals = makeSignals([1, 1, 1, 1, 1, 1, 0]);
  signals[6].checked = false;
  assert.notEqual(classifyHedgehog(signals).kind, "invisible");
});
const makeSnapshot = (website, passes, at) => {
  const signals = makeSignals(passes);
  return {
    snapshotId: "a-mocked-snapshot",
    website, projectName: "Acme & <Friends>", category: "Web3",
    scannedAt: at, signals, score: Math.round(passes.filter(Boolean).length / 7 * 100),
    hedgehog: classifyHedgehog(signals),
    note: "Technical audit only; no real AI model query.",
  };
};

test("anonymous publication omits website and project identity", () => {
  const privateReport = makeSnapshot("https://acme.example", [1, 1, 1, 1, 1, 1, 1], "2026-10-21T08:00:00Z");
  const publicReport = publicSnapshot(privateReport, "some-id", false);
  assert.equal(publicReport.website, undefined);
  assert.equal(publicReport.projectName, undefined);
  assert.equal(publicReport.reportId, "some-id");
  assert.equal(publicReport.signals.length, 7);
  assert.equal(publicSnapshot(privateReport, "some-id", true).projectName, privateReport.projectName);
});
test("before/after compares only the same website and changed measured signals", () => {
  const before = makeSnapshot("https://acme.example", [1, 0, 0, 0, 1, 0, 1], "2026-10-21T00:00:00Z");
  const after = makeSnapshot("https://acme.example", [1, 1, 0, 0, 1, 1, 1], "2026-10-22T00:00:00Z");
  const diff = compareSnapshots(before, after);
  assert.ok(diff);
  assert.equal(diff.changes.length, 2);
  assert.equal(diff.changes[0].label, "Useful meta description");
  assert.equal(compareSnapshots(before, makeSnapshot("https://other.example", [1, 1, 1, 1, 1, 1, 1], after.scannedAt)), null);
  assert.match(diff.note, /do not measure AI recommendations/i);
});
test("SVG artwork is distinct; posts have requested export dimensions and escape untrusted text", () => {
  assert.notEqual(hedgehogGraphic("spiky"), hedgehogGraphic("king"));
  const report = makeSnapshot("https://acme.example", [1, 1, 1, 1, 1, 1, 1], "2026-10-21T10:00:00Z");
  const horizontal = posterSvg(report, "landscape", true);
  const vertical = posterSvg(report, "portrait", false);
  assert.match(horizontal, /width="1200" height="675"/);
  assert.match(vertical, /width="1080" height="1350"/);
  assert.ok(horizontal.includes("Acme &amp; &lt;Friends&gt;"));
  assert.ok(!horizontal.includes("Acme & <Friends>"));
  assert.ok(!vertical.includes("Acme"));
  assert.match(horizontal, /not AI mentions/i);
});
