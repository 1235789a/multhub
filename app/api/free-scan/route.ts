const MAX_HTML_BYTES = 1_000_000;

type ScanPayload = {
  website?: string;
  category?: string;
};

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Enter your project website.");
  }

  const url = new URL(
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`,
  );
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only public http or https websites can be scanned.");
  }

  const hostname = url.hostname.toLowerCase();
  const blockedHost =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".test") ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname) ||
    hostname.includes(":");

  if (blockedHost) {
    throw new Error("Enter a public project website.");
  }

  url.hash = "";
  return url;
}

function extractMatch(source: string, pattern: RegExp) {
  return source.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function buildPrompts(projectName: string, category: string) {
  return [
    `What are the best ${category.toLowerCase()} for early-stage teams?`,
    `How does ${projectName} compare with its closest competitors?`,
    `Is ${projectName} a credible option for Web3 users?`,
  ];
}

function isCrawlerBlocked(robotsText: string, targetAgent: string) {
  const lines = robotsText.split(/\r?\n/);
  let agents: string[] = [];
  let rulesStarted = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;

    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim().toLowerCase();

    if (key === "user-agent") {
      if (rulesStarted) {
        agents = [];
        rulesStarted = false;
      }
      agents.push(value);
      continue;
    }

    if (agents.length === 0) continue;
    rulesStarted = true;
    const applies = agents.some(
      (agent) => agent === "*" || agent === targetAgent.toLowerCase(),
    );
    if (applies && key === "disallow" && value === "/") {
      return true;
    }
  }

  return false;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ScanPayload;
    const url = normalizeWebsite(payload.website ?? "");
    const category = payload.category?.trim() || "Web3 infrastructure";

    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "molthub-free-geo-scan/1.0",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });

    if (response.status >= 300 && response.status < 400) {
      throw new Error(
        "This website redirects before it can be checked. Try its final URL.",
      );
    }
    if (!response.ok) {
      throw new Error(`The website returned HTTP ${response.status}.`);
    }

    const contentLength = Number(
      response.headers.get("content-length") || "0",
    );
    if (contentLength > MAX_HTML_BYTES) {
      throw new Error("The homepage is too large for this quick scan.");
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error(
        "The supplied URL does not appear to be a website homepage.",
      );
    }

    const html = (await response.text()).slice(0, MAX_HTML_BYTES);
    const lower = html.toLowerCase();
    const title =
      extractMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ||
      url.hostname.replace(/^www\./, "");
    const description =
      extractMatch(
        html,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
      ) ||
      extractMatch(
        html,
        /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i,
      );

    const signals = [
      {
        label: "Clear page title",
        passed: title.length >= 18 && title.length <= 70,
        detail:
          title.length >= 18 && title.length <= 70
            ? "A usable title was found."
            : "The title may be missing, vague, or too long.",
      },
      {
        label: "Useful meta description",
        passed: description.length >= 70 && description.length <= 180,
        detail:
          description.length >= 70 && description.length <= 180
            ? "The homepage has a descriptive summary."
            : "Add a concise product and audience description.",
      },
      {
        label: "Structured data",
        passed: /application\/ld\+json/.test(lower),
        detail: /application\/ld\+json/.test(lower)
          ? "Machine-readable structured data was detected."
          : "No JSON-LD structured data was detected.",
      },
      {
        label: "FAQ signal",
        passed: /faq|frequently asked/.test(lower),
        detail: /faq|frequently asked/.test(lower)
          ? "FAQ content or navigation was detected."
          : "No clear FAQ signal was detected.",
      },
      {
        label: "Documentation signal",
        passed: /docs|documentation|developer portal|api reference/.test(lower),
        detail: /docs|documentation|developer portal|api reference/.test(lower)
          ? "Docs or developer material was detected."
          : "No obvious documentation link was detected.",
      },
      {
        label: "Canonical URL",
        passed: /rel=["']canonical["']/.test(lower),
        detail: /rel=["']canonical["']/.test(lower)
          ? "A canonical URL was detected."
          : "No canonical URL was detected.",
      },
    ];

    let robotsText = "";
    try {
      const robotsResponse = await fetch(new URL("/robots.txt", url), {
        headers: { "user-agent": "molthub-free-geo-scan/1.0" },
        redirect: "manual",
        signal: AbortSignal.timeout(5_000),
      });
      if (robotsResponse.ok) {
        robotsText = (await robotsResponse.text()).slice(0, 100_000);
      }
    } catch {
      robotsText = "";
    }

    const blocksSearchBot = isCrawlerBlocked(robotsText, "OAI-SearchBot");

    signals.push({
      label: "AI search crawler access",
      passed: !blocksSearchBot,
      detail: !robotsText
        ? "No blocking rule was detected in the quick check."
        : blocksSearchBot
          ? "robots.txt may block AI search discovery."
          : "No obvious OAI-SearchBot block was detected.",
    });

    const passedCount = signals.filter((signal) => signal.passed).length;
    const score = Math.round((passedCount / signals.length) * 100);
    const projectName =
      title.split(/[|\-—]/)[0]?.trim() || url.hostname.replace(/^www\./, "");
    const actions = signals
      .filter((signal) => !signal.passed)
      .slice(0, 3)
      .map((signal) => signal.detail);

    const fallbackActions = [
      "Create a comparison page for a high-intent competitor query.",
      "Publish a concise fact block covering product category, users, networks, and custody model.",
      "Retest the same buyer-intent prompts across multiple AI platforms.",
    ];
    while (actions.length < 3) {
      actions.push(fallbackActions[actions.length]);
    }

    return Response.json({
      website: url.origin,
      projectName,
      category,
      score,
      verdict:
        score >= 80
          ? "Strong technical foundation"
          : score >= 55
            ? "Visible gaps worth fixing"
            : "Weak AI-search readiness",
      signals,
      prompts: buildPrompts(projectName, category),
      actions,
      note:
        "This free scan checks website readiness signals. It does not query paid AI platforms or guarantee mentions.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The scan could not be completed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
