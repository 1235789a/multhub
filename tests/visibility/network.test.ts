import { describe, it, expect, vi } from "vitest";
import {
  normalizeUrl,
  publicIp,
  createSafeFetcher,
  boundedText,
} from "../../lib/visibility/network";
describe("SSRF input boundary", () => {
  it.each([
    "http://127.0.0.1",
    "http://2130706433",
    "http://0x7f000001",
    "http://0177.0.0.1",
    "http://[::1]",
    "http://[::ffff:127.0.0.1]",
    "http://169.254.169.254/latest/meta-data",
    "http://localhost",
    "http://service.internal",
    "http://test.local",
    "file:///etc/passwd",
    "ftp://public.com",
    "https://user:password@public.com",
    "http://public.com:8080",
    "http://metadata.google.internal",
    "http://public.com.localhost",
    "http://invalid.invalid",
    "http://singlelabel",
  ])("blocks %s", (u) => expect(() => normalizeUrl(u)).toThrow());
  it("normalizes scheme, removes query and fragment without changing page path", () =>
    expect(normalizeUrl("https://Acme.com./pricing?secret=1#x").href).toBe(
      "https://acme.com/pricing",
    ));
  it.each([
    "10.1.2.3",
    "127.0.0.1",
    "169.254.169.254",
    "172.16.4.5",
    "192.168.1.3",
    "100.64.1.2",
    "192.0.2.1",
    "198.18.0.1",
    "224.0.0.1",
    "::1",
    "fc00::1",
    "fe80::123",
    "::ffff:192.168.1.2",
    "2001:db8::1",
  ])("rejects nonpublic DNS address %s", (ip) =>
    expect(publicIp(ip)).toBe(false),
  );
  it.each(["1.1.1.1", "8.8.8.8", "2606:4700:4700::1111"])(
    "accepts public DNS address %s",
    (ip) => expect(publicIp(ip)).toBe(true),
  );
  it("rejects a mixed public/private DNS answer before issuing a target fetch", async () => {
    const fetcher = vi.fn();
    const r = await createSafeFetcher({
      resolve: async () => ["1.1.1.1", "10.0.0.1"],
      fetch: fetcher,
    })("https://acme.com");
    expect(r.kind).toBe("UNSAFE_DNS");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("checks every redirect target", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response("", {
        status: 302,
        headers: { location: "http://169.254.169.254" },
      }),
    );
    const r = await createSafeFetcher({
      resolve: async () => ["1.1.1.1"],
      fetch: fetcher,
    })("https://acme.com");
    expect(r.kind).toBe("UNSAFE_URL");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("rejects a redirect to a private DNS name", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response("", {
        status: 302,
        headers: { location: "https://evil.com" },
      }),
    );
    const r = await createSafeFetcher({
      resolve: async (h) => (h === "acme.com" ? ["1.1.1.1"] : ["192.168.1.1"]),
      fetch: fetcher,
    })("https://acme.com");
    expect(r.kind).toBe("UNSAFE_DNS");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("bounds redirect chains", async () => {
    const f = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new Response("", { status: 302, headers: { location: "/again" } }),
        ),
      );
    const r = await createSafeFetcher({
      fetch: f,
      resolve: async () => ["1.1.1.1"],
    })("https://acme.com");
    expect(r.kind).toBe("REDIRECT_LIMIT");
    expect(f).toHaveBeenCalledTimes(4);
  });
  it("rejects HTTPS downgrade", async () => {
    const f = vi.fn().mockResolvedValue(
      new Response("", {
        status: 301,
        headers: { location: "http://acme.com" },
      }),
    );
    const r = await createSafeFetcher({
      fetch: f,
      resolve: async () => ["1.1.1.1"],
    })("https://acme.com");
    expect(r.kind).toBe("UNSAFE_REDIRECT");
  });
  it("bounds chunked response bytes without trusting Content-Length", async () => {
    const r = new Response(
      new ReadableStream({
        start(c) {
          c.enqueue(new Uint8Array(65));
          c.close();
        },
      }),
    );
    await expect(boundedText(r, 64)).rejects.toThrow("size limit");
  });
  it("times out an incomplete body, not only the response headers", async () => {
    const f = vi.fn().mockImplementation((_u, init) =>
      Promise.resolve(
        new Response(
          new ReadableStream({
            start(c) {
              init.signal.addEventListener("abort", () =>
                c.error(new DOMException("timeout", "AbortError")),
              );
              c.enqueue(new Uint8Array(1));
            },
          }),
        ),
      ),
    );
    const r = await createSafeFetcher({
      fetch: f,
      resolve: async () => ["1.1.1.1"],
      timeoutMs: 25,
    })("https://acme.com");
    expect(r.ok).toBe(false);
    expect(r.error).toContain("timed out");
  });
});

// Cloudflare Workers does not implement RequestRedirect=error. Every redirect is manual.
it("uses the redirect modes supported by the deployed Workers runtime", async () => {
  const fetcher = vi.fn().mockImplementation((_url, init) => {
    if (init?.redirect === "error")
      throw new TypeError("Unsupported Workers redirect mode");
    return Promise.resolve(
      Response.json({ Status: 0, Answer: [{ type: 1, data: "1.1.1.1" }] }),
    );
  });
  const result = await createSafeFetcher({ fetch: fetcher })(
    "https://acme.com",
  );
  expect(result.ok).toBe(true);
  expect(
    fetcher.mock.calls.every(([, init]) => init.redirect === "manual"),
  ).toBe(true);
});
