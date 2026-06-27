export interface ImageProviderResult {
  imageUrl?: string;
  error?: string;
  provider: string;
}

interface OpenAIImageResponse {
  data?: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
  }>;
  error?: {
    message?: string;
    type?: string;
  };
}

const DEFAULT_TIMEOUT_MS = 120_000;
const MAX_IMAGE_SIZE = "1024x1024";

export async function generateImageIfAvailable(params: {
  prompt: string;
  negativePrompt?: string;
  workflowId?: string;
}): Promise<ImageProviderResult> {
  const mode = process.env.IMAGE_PROVIDER ?? "prompt_only";

  if (mode === "prompt_only") {
    return { provider: "prompt_only" };
  }

  const apiKey = process.env.IMAGE_API_KEY;
  if (!apiKey) {
    return {
      provider: "prompt_only",
      error: "IMAGE_API_KEY not configured",
    };
  }

  const baseUrl = process.env.IMAGE_API_BASE_URL ?? "https://api.openai.com/v1";
  const model = process.env.IMAGE_MODEL ?? "dall-e-3";
  const url = `${baseUrl.replace(/\/+$/, "")}/images/generations`;

  const body: Record<string, unknown> = {
    model,
    prompt: params.prompt,
    n: 1,
    size: MAX_IMAGE_SIZE,
    response_format: "url",
  };

  if (params.negativePrompt) {
    body.prompt = `${params.prompt}. Negative: ${params.negativePrompt}`;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const errBody = await res.json();
        detail = errBody?.error?.message ?? `${res.status}`;
      } catch {
        detail = `${res.status}`;
      }
      return {
        provider: "provider",
        error: `Image provider error: ${detail}`,
      };
    }

    const data: OpenAIImageResponse = await res.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return {
        provider: "provider",
        error: "No image URL returned from provider",
      };
    }

    return { provider: "provider", imageUrl };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return {
      provider: "provider",
      error: `Image generation failed: ${msg}`,
    };
  }
}
