import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const port = 8791;
const server = spawn(
  process.execPath,
  [
    "node_modules/wrangler/bin/wrangler.js",
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--port",
    String(port),
    "--persist-to",
    ".wrangler/render-test-state",
    "--log-level",
    "error",
  ],
  { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, CI: "1" } },
);
let logs = "";
server.stdout.on("data", (b) => (logs = (logs + b).slice(-12000)));
server.stderr.on("data", (b) => (logs = (logs + b).slice(-12000)));
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/tools/ai-visibility`, {
        signal: AbortSignal.timeout(750),
      });
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    if (server.exitCode !== null)
      throw new Error("Worker exited before readiness.");
    await setTimeout(250);
  }
  if (!ready) throw new Error("Worker did not become ready.");
  const test = spawn(
    process.execPath,
    ["--test", "tests/rendered-html.test.mjs"],
    {
      stdio: "inherit",
      env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${port}` },
    },
  );
  const code = await new Promise((resolve) => test.on("exit", resolve));
  if (code) process.exitCode = Number(code);
} catch (e) {
  console.error(e.message);
  console.error(logs);
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
}
