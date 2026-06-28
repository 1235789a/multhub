export interface TextProviderConfig {
  provider: string;
  apiKey?: string;
  baseUrl: string;
  model: string;
}

export interface TextProviderOptions {
  defaultBaseUrl?: string;
  defaultModel?: string;
}

const GLOBAL_DEFAULT_BASE_URL = "https://api.deepseek.com";
const GLOBAL_DEFAULT_MODEL = "deepseek-chat";

export function getTextProviderConfig(opts?: TextProviderOptions): TextProviderConfig {
  const apiKey =
    process.env.TEXT_API_KEY ??
    process.env.PARTNERSHIP_API_KEY ??
    process.env.IMAGE_API_KEY;

  const baseUrl =
    process.env.TEXT_API_BASE_URL ??
    opts?.defaultBaseUrl ??
    GLOBAL_DEFAULT_BASE_URL;

  const model =
    process.env.TEXT_MODEL ??
    process.env.IMAGE_MODEL ??
    opts?.defaultModel ??
    GLOBAL_DEFAULT_MODEL;

  const provider = process.env.TEXT_PROVIDER ?? "openai_compatible";

  return {
    provider,
    apiKey,
    baseUrl,
    model,
  };
}

export function requireTextApiKey(opts?: TextProviderOptions): string {
  const cfg = getTextProviderConfig(opts);
  if (!cfg.apiKey) {
    throw new Error(
      "TEXT_API_KEY not configured. Set TEXT_API_KEY (or PARTNERSHIP_API_KEY / IMAGE_API_KEY as fallback) in Cloudflare Secrets.",
    );
  }
  return cfg.apiKey;
}

export function maskKey(key?: string): string {
  if (!key) return "(unset)";
  if (key.length <= 8) return "***";
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}
