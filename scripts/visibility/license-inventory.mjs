import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
const inventory = [];
for (const [location, pkg] of Object.entries(lock.packages)) {
  if (!location || pkg.dev || pkg.devOptional) continue;
  const root = path.resolve(location);
  if (!fs.existsSync(path.join(root, "package.json"))) {
    inventory.push({
      location,
      version: pkg.version,
      spdx: pkg.license,
      installed: false,
    });
    continue;
  }
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );
  const candidates = fs
    .readdirSync(root)
    .filter(
      (f) =>
        /^(licen[sc]e|copying|notice)/i.test(f) &&
        fs.statSync(path.join(root, f)).isFile(),
    );
  const files = candidates.map((f) => {
    const content = fs.readFileSync(path.join(root, f));
    return {
      file: f,
      sha256: crypto.createHash("sha256").update(content).digest("hex"),
      bytes: content.length,
      firstLine: content
        .toString("utf8")
        .split("\n")
        .slice(0, 3)
        .join(" ")
        .slice(0, 160),
    };
  });
  inventory.push({
    name: manifest.name,
    version: manifest.version,
    location,
    spdx: manifest.license || pkg.license,
    licenseFiles: files,
    verifiedFilePresent: files.length > 0,
  });
}
fs.writeFileSync(
  "docs/visibility/DEPENDENCY_LICENSES.json",
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      scope:
        "Installed production dependency closure; actual license/notice file hashes. Upstream vendored license tracked separately.",
      packages: inventory,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    productionPackages: inventory.length,
    missingFiles: inventory
      .filter((p) => p.installed !== false && !p.verifiedFilePresent)
      .map((p) => p.name),
    licenses: [...new Set(inventory.map((p) => p.spdx))],
  }),
);
