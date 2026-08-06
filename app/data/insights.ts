export type InsightAudience = "Beginner" | "Professional";

export type InsightSection = {
  heading: string;
  body: string;
};

export type Insight = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  publishTime: "08:00" | "20:00";
  audience: InsightAudience;
  readingTime: string;
  tags: string[];
  author: string;
  status: "draft" | "published" | "coming-soon";
  featured?: boolean;
  sections: InsightSection[];
};

export const insightSchedule = [
  {
    time: "08:00",
    audience: "Beginner" as const,
    title: "One clear Web3 GEO concept",
    description: "A short explanation for founders, operators, and curious teams.",
  },
  {
    time: "20:00",
    audience: "Professional" as const,
    title: "One practical implementation note",
    description: "A deeper field note for teams already working on visibility.",
  },
];

export const insights: Insight[] = [
  {
    title: "What Is GEO for a Web3 Project?",
    slug: "what-is-geo-for-a-web3-project",
    excerpt:
      "A plain-English introduction to how AI search discovers, classifies, and explains Web3 products.",
    category: "GEO Fundamentals",
    publishedDate: "2026-08-06",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "4 min read",
    tags: ["GEO", "Web3", "Beginner"],
    author: "molthub editorial",
    status: "published",
    featured: true,
    sections: [
      {
        heading: "GEO is about being understood",
        body:
          "Traditional SEO helps a page appear in a list of links. GEO asks a related question: when someone asks an AI assistant for a recommendation, does the assistant understand what your product is and when it should be mentioned?",
      },
      {
        heading: "Why Web3 needs extra clarity",
        body:
          "A Web3 project can be a company, protocol, token, wallet, API, or several of these at once. Clear definitions of the product, supported networks, custody model, and target user give AI systems fewer opportunities to confuse it with a competitor.",
      },
      {
        heading: "Start with one buyer question",
        body:
          "Choose one question a real user might ask, then compare the answer with your homepage and docs. The gap between what you say and what the answer says is a useful first GEO task.",
      },
    ],
  },
  {
    title: "Entity Consistency: The Hidden Layer of Web3 AI Visibility",
    slug: "entity-consistency-web3-ai-visibility",
    excerpt:
      "Why the same project must be described consistently across its homepage, docs, GitHub, ecosystem listings, and social profiles.",
    category: "AI Visibility",
    publishedDate: "2026-08-06",
    publishTime: "20:00",
    audience: "Professional",
    readingTime: "7 min read",
    tags: ["Entities", "Docs", "Fact accuracy"],
    author: "molthub editorial",
    status: "published",
    featured: true,
    sections: [
      {
        heading: "One brand can contain several entities",
        body:
          "AI systems need to distinguish a legal company, a protocol, a product, a token, and a community. If those entities are mixed together, the safest answer for an assistant is often a vague or incorrect one.",
      },
      {
        heading: "Build a fact spine before adding more content",
        body:
          "Create one maintained source of truth for the project name, category, supported chains, custody model, product status, official links, and key integrations. Reuse those facts across the homepage, docs, GitHub profile, and partner pages.",
      },
      {
        heading: "Measure consistency, not just volume",
        body:
          "Adding more articles will not fix a contradictory source map. A smaller set of consistent, independently verifiable facts is often more useful than a large collection of pages that describe the project differently.",
      },
    ],
  },
  {
    title: "Why AI Keeps Recommending Your Competitors",
    slug: "why-ai-keeps-recommending-your-competitors",
    excerpt:
      "Three practical reasons a smaller Web3 product can disappear from an answer while a better-documented competitor gets the mention.",
    category: "Competitive Visibility",
    publishedDate: "2026-08-05",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "5 min read",
    tags: ["Competitors", "AI search", "Beginner"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "The competitor may simply be easier to classify",
        body:
          "A clear category, audience, and use case give an assistant a simple sentence to repeat. A technically strong project can still be invisible when its homepage uses broad language instead of a concrete product description.",
      },
      {
        heading: "The competitor may have stronger source coverage",
        body:
          "AI answers often draw from more than one page. A project with consistent docs, ecosystem profiles, tutorials, and partner references gives the system more evidence to work with.",
      },
      {
        heading: "The fix is not to mention competitors everywhere",
        body:
          "Start by making your own facts easier to verify. Then publish one useful comparison page that explains the actual trade-offs without making unsupported claims.",
      },
    ],
  },
  {
    title: "How to Build a Citation-Ready Web3 Source Map",
    slug: "citation-ready-web3-source-map",
    excerpt:
      "A practical source hierarchy for turning product facts into pages that AI assistants and human buyers can verify.",
    category: "Source Engineering",
    publishedDate: "2026-08-05",
    publishTime: "20:00",
    audience: "Professional",
    readingTime: "8 min read",
    tags: ["Citations", "Source map", "Implementation"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Start with first-party facts",
        body:
          "The homepage and docs should clearly state what the product does, who it serves, which networks it supports, and how it handles custody or settlement. These pages should be easy to quote and easy to update.",
      },
      {
        heading: "Add independent context",
        body:
          "Ecosystem directories, partner pages, technical tutorials, and reputable interviews can provide useful outside context. They should describe the same facts as the official source, not repeat a different version of the story.",
      },
      {
        heading: "Record the evidence trail",
        body:
          "For each important claim, record the source URL, publication date, owner, and last verification date. This turns citation work into an operating process rather than a one-time content push.",
      },
    ],
  },
  {
    title: "A Simple Web3 Website Audit in 10 Minutes",
    slug: "simple-web3-website-audit",
    excerpt:
      "A quick first-pass checklist for founders who want to spot obvious AI-search gaps before commissioning a full review.",
    category: "Practical Checks",
    publishedDate: "2026-08-04",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "5 min read",
    tags: ["Checklist", "Website", "Beginner"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Read only the first screen",
        body:
          "Can a new visitor identify the product, target user, supported environment, and next action in under thirty seconds? If not, an AI assistant may also struggle to summarize it accurately.",
      },
      {
        heading: "Check the docs against the homepage",
        body:
          "Look for mismatches in supported networks, product status, fees, custody, and integration steps. Outdated details are more damaging than a short page because they create conflicting evidence.",
      },
      {
        heading: "Ask one real question",
        body:
          "Search for a question your buyer would ask, then note which products appear and which sources are cited. Save the exact wording and date so the observation can be repeated later.",
      },
    ],
  },
  {
    title: "Measuring Prompt Share of Voice Without Overclaiming",
    slug: "measuring-prompt-share-of-voice",
    excerpt:
      "A careful way to compare AI mentions over time without pretending that one answer is a permanent ranking.",
    category: "Measurement",
    publishedDate: "2026-08-04",
    publishTime: "20:00",
    audience: "Professional",
    readingTime: "9 min read",
    tags: ["Measurement", "Share of voice", "Research"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Define the prompt set first",
        body:
          "Use a stable set of buyer-intent, category, and comparison prompts. Keep the wording and model list documented so later measurements are comparable.",
      },
      {
        heading: "Treat each answer as an observation",
        body:
          "AI responses can vary by model, time, location, and conversation context. Record the date, model, response, cited sources, position, and whether the product was described accurately.",
      },
      {
        heading: "Report direction, not certainty",
        body:
          "A useful report shows changes in visibility and accuracy across a defined test set. It should not turn a small sample into a guaranteed ranking claim or promise a fixed amount of revenue.",
      },
    ],
  },
];

export function getPublishedInsights() {
  const seen = new Set<string>();

  return [...insights]
    .filter((insight) => insight.status === "published")
    .filter((insight) => {
      if (seen.has(insight.slug)) return false;
      seen.add(insight.slug);
      return true;
    })
    .sort((a, b) => {
      const aDate = `${a.publishedDate}T${a.publishTime}`;
      const bDate = `${b.publishedDate}T${b.publishTime}`;
      return bDate.localeCompare(aDate);
    });
}

export function getInsight(slug: string) {
  return insights.find((insight) => insight.slug === slug);
}
