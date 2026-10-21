import { hedgehogVariant, type HedgehogKind, type HedgehogSnapshot, type PublicHedgehog } from "./hedgehog";

function esc(input: string) {
  return input.replace(/[&<>"']/g, (char) => (({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  }) as Record<string, string>)[char] ?? char);
}
function label(input: string, max = 56) {
  return esc(input.replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, max));
}

const palette: Record<HedgehogKind, [string, string]> = {
  invisible: ["#A9A1CF", "#EAE6FF"], spiky: ["#D9745B", "#FFE5CD"],
  sleepy: ["#8881C8", "#F1E7FF"], detective: ["#3A92AE", "#E0F8FB"],
  explorer: ["#59A77D", "#D9F8E5"], king: ["#D8A137", "#FFF2BF"],
  cosmic: ["#9173D6", "#EDE3FF"], librarian: ["#4A92A7", "#DEF0F7"],
  builder: ["#CA8B5B", "#FDE9D4"],
};

export function hedgehogGraphic(kind: HedgehogKind, width = 800, height = 520): string {
  const [dark, light] = palette[kind];
  const spike = kind === "spiky" ? "#D65E48" : dark;
  const ghost = kind === "invisible";
  const closedEye = kind === "sleepy";
  const spikes = Array.from({ length: kind === "spiky" ? 22 : 16 }, (_, i) => {
    const x = 90 + i * (kind === "spiky" ? 25 : 35);
    const tall = kind === "spiky" ? 54 + (i % 4) * 16 : 30 + (i % 5) * 11;
    return '<path d="M' + x + ' 332 l18 -' + tall + ' 22 ' + tall + 'Z" fill="' + spike + '" stroke="#312C38" stroke-width="3" stroke-linejoin="round"/>';
  }).join("");
  const star = '<path d="M0 -22L6 -6 22 0 6 6 0 22 -6 6 -22 0 -6 -6Z" fill="#F9E4A1"/>';
  const props: Record<HedgehogKind, string> = {
    invisible: '<circle cx="630" cy="160" r="78" fill="none" stroke="#B7AEFA" stroke-width="6" stroke-dasharray="15 16"/><text x="630" y="178" font-size="50" text-anchor="middle">?</text>',
    spiky: '<path d="M620 115l40 -58 25 40 30 -36 5 78Z" fill="#FB9E7C"/><path d="M620 115h105" stroke="#3A2930" stroke-width="7"/>',
    sleepy: '<path d="M594 160q28 -30 56 0" fill="none" stroke="#806CC9" stroke-width="7"/><text x="630" y="108" font-size="51" font-weight="800" fill="#7968BC">Z z z</text>',
    detective: '<path d="M468 238h205l-25 -28h-130z" fill="#315566"/><path d="M517 205l18 -61h87l19 61Z" fill="#446B78"/><circle cx="646" cy="345" r="48" stroke="#2F506B" fill="none" stroke-width="13"/><path d="M675 381l45 53" stroke="#2F506B" stroke-width="15" stroke-linecap="round"/>',
    explorer: '<path d="M490 255q95 -75 185 0" stroke="#F5D18C" stroke-width="35" fill="none"/><circle cx="662" cy="158" r="55" fill="#F8E2A5" stroke="#396F61" stroke-width="7"/><path d="M662 122l19 40 -35 20Z" fill="#D86955"/>',
    king: '<path d="M497 226l-23 -93 51 29 45 -65 41 66 53 -27 -23 90Z" fill="#F8CE51" stroke="#513C2C" stroke-width="7"/><circle cx="570" cy="183" r="10" fill="#D75E55"/><path d="M582 308l93 71 -82 95" fill="#C15B6D"/>',
    cosmic: '<ellipse cx="573" cy="166" rx="105" ry="32" fill="none" stroke="#F6D47B" stroke-width="13" transform="rotate(-13 573 166)"/><g transform="translate(692 135) scale(.8)">' + star + '</g><g transform="translate(126 124) scale(.65)">' + star + '</g>',
    librarian: '<path d="M610 350l78 -20v114l-78 20Z" fill="#E3C486" stroke="#30556A" stroke-width="6"/><path d="M610 350l-83 -20v114l83 20Z" fill="#F2DBA4" stroke="#30556A" stroke-width="6"/><circle cx="527" cy="289" r="34" fill="none" stroke="#34586C" stroke-width="7"/><circle cx="618" cy="289" r="34" fill="none" stroke="#34586C" stroke-width="7"/><path d="M561 289h23" stroke="#34586C" stroke-width="6"/>',
    builder: '<path d="M495 245q76 -99 154 0Z" fill="#F4B84B" stroke="#564537" stroke-width="6"/><path d="M485 240h170" stroke="#564537" stroke-width="13" stroke-linecap="round"/><path d="M665 330l27 -27 30 30 -27 27 42 45 -25 22 -47 -46" fill="#A6B3C0" stroke="#4D5158" stroke-width="6"/>',
  };
  const eyes = closedEye
    ? '<path d="M510 321q20 22 42 0M586 321q20 22 42 0" stroke="#3C3540" stroke-width="7" fill="none" stroke-linecap="round"/>'
    : '<circle cx="532" cy="317" r="10" fill="#302A31"/><circle cx="611" cy="317" r="10" fill="#302A31"/><circle cx="535" cy="314" r="3.5" fill="#FFF"/><circle cx="614" cy="314" r="3.5" fill="#FFF"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 800 520" role="img" aria-label="' + kind + ' hedgehog illustration">' +
    '<defs><linearGradient id="fur" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + light + '"/><stop offset="1" stop-color="' + dark + '"/></linearGradient></defs>' +
    '<ellipse cx="392" cy="462" rx="265" ry="24" fill="#23314D" opacity=".10"/>' +
    '<g opacity="' + (ghost ? '.27' : '1') + '">' +
    '<path d="M92 350Q160 258 335 259L590 315 633 407Q422 474 175 428Z" fill="url(#fur)" stroke="#35313A" stroke-width="8"/>' +
    spikes +
    '<path d="M410 356q-2 -116 144 -119 132 0 134 117v75H417Z" fill="' + light + '" stroke="#36303B" stroke-width="8"/>' +
    '<ellipse cx="617" cy="376" rx="75" ry="55" fill="#FFEDE2"/>' + eyes +
    '<circle cx="660" cy="365" r="11" fill="#302A31"/>' +
    '<path d="M552 390q26 23 52 0" stroke="#59464D" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M207 434q-18 38 -44 4M422 445q-17 32 -45 0" stroke="#3D323C" stroke-width="13" fill="none" stroke-linecap="round"/>' +
    props[kind] + '</g></svg>';
}

export function posterSvg(
  snapshot: HedgehogSnapshot | PublicHedgehog,
  format: "landscape" | "portrait",
  showIdentity = false,
  shareUrl = "",
): string {
  const portrait = format === "portrait";
  const width = portrait ? 1080 : 1200;
  const height = portrait ? 1350 : 675;
  const artY = portrait ? 376 : 120;
  const artX = portrait ? 15 : 515;
  const artW = portrait ? 1030 : 665;
  const artH = portrait ? 680 : 450;
  const headlineY = portrait ? 215 : 191;
  const lineY = portrait ? 303 : 267;
  const dataY = portrait ? 1124 : 512;
  const passing = snapshot.signals.filter((s) => s.checked !== false && s.passed).length;
  const measured = snapshot.signals.filter((s) => s.checked !== false).length;
  const title = label(snapshot.hedgehog.title, 36);
  const caption = label(snapshot.hedgehog.line, 70);
  const identity = showIdentity && snapshot.projectName ? label(snapshot.projectName, 45) : 'A mystery website';
  const uri = shareUrl ? label(shareUrl.replace(/^https?:\/\//, ''), 88) : 'molthub.click  •  Run your own scan';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height +
    '" viewBox="0 0 ' + width + ' ' + height + '">' +
    '<rect width="100%" height="100%" fill="#101D32"/>' +
    '<circle cx="' + (portrait ? 820 : 1030) + '" cy="170" r="330" fill="' + snapshot.hedgehog.accent + '" opacity=".2"/>' +
    '<rect x="32" y="32" width="' + (width - 64) + '" height="' + (height - 64) + '" rx="31" fill="none" stroke="#64748B" stroke-width="2"/>' +
    '<text x="72" y="91" fill="#E4BD79" font-size="27" font-weight="800" font-family="Arial,sans-serif" letter-spacing="3">HEDGEHOG LAB</text>' +
    '<text x="72" y="' + headlineY + '" fill="#FAF9F6" font-size="' + (portrait ? 69 : 51) + '" font-weight="900" font-family="Arial,sans-serif">' + title + '</text>' +
    '<text x="72" y="' + lineY + '" fill="#E0EAF0" font-size="' + (portrait ? 32 : 24) + '" font-family="Arial,sans-serif">' + caption + '</text>' +
    '<g transform="translate(' + artX + ' ' + artY + ') scale(' + (artW / 800) + ' ' + (artH / 520) + ')">' +
    hedgehogGraphic(snapshot.hedgehog.kind).replace(/^<svg[^>]+>/, '').replace(/<\/svg>$/, '') + '</g>' +
    '<rect x="72" y="' + (dataY - 45) + '" width="' + (portrait ? 936 : 465) + '" height="116" rx="20" fill="#243550"/>' +
    '<text x="95" y="' + dataY + '" fill="#FFFFFF" font-family="Arial" font-size="29" font-weight="700">' + passing + '/' + measured + ' homepage checks</text>' +
    '<text x="95" y="' + (dataY + 42) + '" fill="#C5D6E3" font-family="Arial" font-size="22">' + identity + ' • ' + label(snapshot.scannedAt.slice(0, 10), 10) + '</text>' +
    '<text x="72" y="' + (height - 86) + '" fill="#E4BD79" font-family="Arial" font-weight="700" font-size="25">' + (hedgehogVariant(snapshot.snapshotId) === "A" ? "WHAT IS YOUR HEDGEHOG?" : "I DARE YOU TO REVEAL YOURS") + '</text>' +
    '<text x="72" y="' + (height - 53) + '" fill="#CCD8E4" font-family="Arial" font-size="19">' + uri + '</text>' +
    '<text x="' + (width - 78) + '" y="' + (height - 54) + '" text-anchor="end" fill="#90A1B7" font-family="Arial" font-size="16">MultiHub • Technical checks, not AI mentions</text>' +
    '</svg>';
}
