/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { getReport, lab, privateHeaders } from "../app/lib/growth-lab/storage";
import { identifyPreview } from "../app/lib/growth-lab/visits";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    const privatePath = /^\/(r|workspace)(?:\/|$)/.test(url.pathname);
    if (!privatePath) return handler.fetch(request, env, ctx);

    const response = await handler.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries(privateHeaders)) headers.set(name, value);
    const match = url.pathname.match(/^\/r\/([A-Za-z0-9_-]{43})\/?$/);
    if (match && request.method === "GET" && response.ok &&
      !request.headers.has("rsc") && !request.headers.has("next-router-prefetch")) {
      const kind = identifyPreview(request) ? "preview_bot" : "unverified_load";
      ctx.waitUntil((async () => {
        const report = await getReport(match[1]);
        if (!report) return;
        const { db } = await lab();
        await db.prepare("INSERT INTO report_events VALUES (?, ?, ?, ?)")
          .bind(crypto.randomUUID(), report.id, kind, new Date().toISOString()).run();
      })().catch(() => {}));
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};

export default worker;
