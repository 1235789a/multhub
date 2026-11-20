export const previewAgent = /bot|crawler|spider|preview|whatsapp|facebookexternalhit|meta-externalagent|slack|discord|telegram|linkedin|skype|pinterest/i;

export function identifyPreview(request: Request) {
  const headers = request.headers;
  return previewAgent.test(headers.get("user-agent") ?? "") ||
    /prefetch|prerender/i.test(`${headers.get("purpose")} ${headers.get("sec-purpose")}`);
}
