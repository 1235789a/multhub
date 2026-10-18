import ipaddr from "ipaddr.js";
import { AppError, type FetchRecord } from "./types";
const BLOCKED_SUFFIXES = [
  ".localhost",
  ".local",
  ".internal",
  ".test",
  ".invalid",
  ".example",
  ".onion",
  ".home",
  ".lan",
  ".arpa",
];
export function normalizeUrl(value: unknown): URL {
  if (typeof value !== "string" || !value.trim() || value.length > 2048)
    throw new AppError("INVALID_URL", "Enter a public website URL.");
  let url: URL;
  try {
    url = new URL(
      /^[a-z][a-z0-9+.-]*:/i.test(value.trim())
        ? value.trim()
        : `https://${value.trim()}`,
    );
  } catch {
    throw new AppError(
      "INVALID_URL",
      "This URL is not valid. Try https://example.com.",
    );
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.port ||
    !host.includes(".") ||
    ipaddr.isValid(host.replace(/^\[|\]$/g, "")) ||
    BLOCKED_SUFFIXES.some((s) => host.endsWith(s)) ||
    host === "localhost" ||
    host === "metadata.google.internal" ||
    !/^([a-z0-9-]+\.)+[a-z0-9-]+$/.test(host)
  )
    throw new AppError(
      "UNSAFE_URL",
      "Only public websites on standard HTTP/HTTPS ports are allowed. Local, private and IP addresses are blocked.",
    );
  url.hostname = host;
  url.hash = "";
  url.search = "";
  return url;
}
export function publicIp(value: string): boolean {
  try {
    return ipaddr.parse(value).range() === "unicast";
  } catch {
    return false;
  }
}
export async function boundedText(
  response: Pick<Response, "headers" | "body">,
  maxBytes: number,
): Promise<{ text: string; bytes: number }> {
  if (Number(response.headers.get("content-length") || 0) > maxBytes) {
    await response.body?.cancel();
    throw new AppError(
      "TOO_LARGE",
      "Response exceeds the scan size limit.",
      422,
    );
  }
  if (!response.body) return { text: "", bytes: 0 };
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes)
        throw new AppError(
          "TOO_LARGE",
          "Response exceeds the scan size limit.",
          422,
        );
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const buffer = new Uint8Array(bytes);
  let at = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, at);
    at += chunk.length;
  }
  return { text: new TextDecoder().decode(buffer), bytes };
}
export type NetworkDeps = {
  fetch?: typeof fetch;
  resolve?: (hostname: string) => Promise<string[]>;
  timeoutMs?: number;
};
export function createSafeFetcher(deps: NetworkDeps = {}) {
  const fetcher = deps.fetch ?? fetch;
  const dnsCache = new Map<string, Promise<void>>();
  const resolve =
    deps.resolve ??
    (async (hostname: string) => {
      const replies = await Promise.all(
        ["A", "AAAA"].map(async (type) => {
          const u = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(hostname)}&type=${type}`;
          const r = await fetcher(u, {
            headers: { accept: "application/dns-json" },
            redirect: "manual",
            signal: AbortSignal.timeout(4000),
          });
          if (!r.ok)
            throw new AppError(
              "DNS_FAILED",
              "Public DNS verification is unavailable. Please retry.",
              422,
            );
          const data = JSON.parse((await boundedText(r, 64000)).text);
          if (data.Status !== 0)
            throw new AppError(
              "DNS_FAILED",
              "This hostname could not be resolved through public DNS.",
              422,
            );
          return (data.Answer ?? [])
            .filter((a: { type: number }) => a.type === 1 || a.type === 28)
            .map((a: { data: string }) => a.data) as string[];
        }),
      );
      return replies.flat();
    });
  async function verify(host: string) {
    if (!dnsCache.has(host))
      dnsCache.set(
        host,
        (async () => {
          const addresses = await resolve(host);
          if (!addresses.length || addresses.some((a) => !publicIp(a)))
            throw new AppError(
              "UNSAFE_DNS",
              "This hostname resolves to a private, reserved or unavailable network address.",
              422,
            );
        })(),
      );
    await dnsCache.get(host);
  }
  return async function safeFetch(
    input: string,
    maxBytes = 512000,
  ): Promise<FetchRecord> {
    let current = normalizeUrl(input).href;
    const original = current;
    const deadline = Date.now() + (deps.timeoutMs ?? 8000);
    try {
      for (let hops = 0; hops <= 3; hops++) {
        const url = normalizeUrl(current);
        await verify(url.hostname);
        const remaining = deadline - Date.now();
        if (remaining <= 0)
          throw new AppError(
            "TIMEOUT",
            "The website did not respond within 8 seconds.",
            422,
          );
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), remaining);
        try {
          const response = await fetcher(url.href, {
            redirect: "manual",
            signal: controller.signal,
            headers: {
              "user-agent":
                "MultiHubReadiness/1.0 (+https://molthub.click/tools/ai-visibility)",
              accept:
                "text/html,text/plain,application/xml,text/xml,application/xhtml+xml;q=0.9,*/*;q=0.1",
            },
          });
          if ([301, 302, 303, 307, 308].includes(response.status)) {
            const next = response.headers.get("location");
            await response.body?.cancel();
            if (!next || hops === 3)
              throw new AppError(
                "REDIRECT_LIMIT",
                "This website has too many redirects or an invalid redirect.",
                422,
              );
            const target = normalizeUrl(new URL(next, url).href);
            if (url.protocol === "https:" && target.protocol === "http:")
              throw new AppError(
                "UNSAFE_REDIRECT",
                "HTTPS to HTTP redirects are blocked.",
                422,
              );
            current = target.href;
            continue;
          }
          const data = await boundedText(response, maxBytes);
          return {
            url: original,
            finalUrl: url.href,
            status: response.status,
            ok: response.ok,
            body: data.text,
            bytes: data.bytes,
            contentType: response.headers.get("content-type") ?? "",
          };
        } finally {
          clearTimeout(timer);
        }
      }
      throw new AppError("REDIRECT_LIMIT", "Too many redirects.", 422);
    } catch (e) {
      return {
        url: original,
        finalUrl: current,
        status: null,
        ok: false,
        body: "",
        bytes: 0,
        contentType: "",
        error:
          e instanceof AppError
            ? e.message
            : e instanceof Error &&
                ["AbortError", "TimeoutError"].includes(e.name)
              ? "Website request timed out."
              : "The website could not be reached. It may block automated requests.",
        kind: e instanceof AppError ? e.code : "FETCH_FAILED",
      };
    }
  };
}
