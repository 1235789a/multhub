import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const useLocalLab = process.env.LAB_LOCAL_BINDINGS === "1";
const previewDatabaseId = process.env.LAB_PREVIEW_D1_DATABASE_ID;
const previewDatabaseName = process.env.LAB_PREVIEW_D1_DATABASE_NAME;
const previewBucketName = process.env.LAB_PREVIEW_R2_BUCKET_NAME;
const previewConfigured = Boolean(previewDatabaseId && previewDatabaseName && previewBucketName);

if ([previewDatabaseId, previewDatabaseName, previewBucketName].some(Boolean) && !previewConfigured) {
  throw new Error("Configure the preview D1 ID, D1 name and private R2 bucket together.");
}

const d1 = useLocalLab || previewConfigured ? "LAB_DB" : hostingConfig.d1;
const r2 = useLocalLab || previewConfigured ? "LAB_EVIDENCE" : hostingConfig.r2;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  // Preserve plaintext variables configured in the Cloudflare dashboard when
  // GitHub builds deploy a new Worker version.
  keep_vars: true,
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: useLocalLab ? "growth-lab-local" : previewDatabaseName || "site-creator-d1",
          database_id: useLocalLab ? SITE_CREATOR_PLACEHOLDER_DATABASE_ID : previewDatabaseId || SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: useLocalLab ? "growth-lab-evidence-local" : previewBucketName || "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
