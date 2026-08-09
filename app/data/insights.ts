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
  coverImage?: string;
  publishedDate: string;
  publishTime: "08:00";
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
    audience: "Daily rotation",
    title: "One new article every day",
    description:
      "Beginner and Professional voices alternate so the library stays useful without repeating itself.",
  },
];

export const insights: Insight[] = [
  {
    title: "What Is GEO for a Web3 Project?",
    slug: "what-is-geo-for-a-web3-project",
    excerpt:
      "A plain-English introduction to how AI search discovers, classifies, and explains Web3 products.",
    category: "GEO Fundamentals",
    coverImage: "/insights/geo-project-clarity.png",
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
    coverImage: "/insights/entity-consistency.png",
    publishedDate: "2026-08-05",
    publishTime: "08:00",
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
    coverImage: "/insights/competitor-paths.png",
    publishedDate: "2026-08-04",
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
    coverImage: "/insights/source-map.png",
    publishedDate: "2026-08-03",
    publishTime: "08:00",
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
    coverImage: "/insights/website-audit.png",
    publishedDate: "2026-08-02",
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
    coverImage: "/insights/prompt-share-voice.png",
    publishedDate: "2026-08-01",
    publishTime: "08:00",
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
  {
    title: "What Makes a Web3 Homepage AI-Friendly?",
    slug: "what-makes-a-web3-homepage-ai-friendly",
    excerpt:
      "A beginner-friendly way to turn a technical homepage into a clear answer about product, audience, and use case.",
    category: "Website Clarity",
    coverImage: "/insights/homepage-clarity.png",
    publishedDate: "2026-07-31",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "5 min read",
    tags: ["Homepage", "Clarity", "Beginner"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Write the first sentence for a new visitor",
        body:
          "The first sentence should identify the product and the user it helps. Avoid opening with an internal slogan that only makes sense after someone has read the docs.",
      },
      {
        heading: "Name the real job to be done",
        body:
          "A strong homepage explains the action a customer can take: accept stablecoin payments, query blockchain data, manage a wallet, or integrate an API. The action is usually clearer than the category label.",
      },
      {
        heading: "Make proof easy to find",
        body:
          "Link the relevant docs, supported networks, product demo, GitHub, and security information near the claim they support. Clear evidence helps both people and AI assistants build a more accurate summary.",
      },
    ],
  },
  {
    title: "Prompt Sets: Designing a Repeatable Visibility Test",
    slug: "designing-a-repeatable-visibility-test",
    excerpt:
      "How to create a small, durable prompt set that can be tested again after a website or documentation change.",
    category: "Measurement",
    coverImage: "/insights/prompt-set.png",
    publishedDate: "2026-07-30",
    publishTime: "08:00",
    audience: "Professional",
    readingTime: "8 min read",
    tags: ["Prompt design", "Testing", "Measurement"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Separate discovery from comparison",
        body:
          "A useful set includes category prompts, use-case prompts, alternative prompts, and direct comparison prompts. Mixing them together makes it harder to understand whether a visibility gap is about classification or preference.",
      },
      {
        heading: "Keep the test small enough to repeat",
        body:
          "A focused set of 15 to 30 prompts is often more useful than an oversized list that no one reruns. Store the exact prompt wording, model, date, and relevant sources with every run.",
      },
      {
        heading: "Define what counts as a useful mention",
        body:
          "Record whether the project appeared, whether the category was correct, whether the answer cited a reliable source, and whether the recommendation matched the buyer's question. A mention without accuracy is not a complete success.",
      },
    ],
  },
  {
    title: "Why Docs Matter More Than Another Blog Post",
    slug: "why-docs-matter-more-than-another-blog-post",
    excerpt:
      "Before publishing more marketing content, check whether the documentation answers the questions an AI system must get right.",
    category: "Documentation",
    coverImage: "/insights/docs-clarity.png",
    publishedDate: "2026-07-29",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "5 min read",
    tags: ["Docs", "Content", "Beginner"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Docs are where product facts live",
        body:
          "Marketing pages explain why a product matters. Documentation explains what it does, how it works, what it supports, and where its limits are. Those facts are essential when an assistant tries to answer a technical question.",
      },
      {
        heading: "Prioritize the first questions",
        body:
          "Start with installation, supported chains, custody, fees, limits, API examples, and current product status. These pages are more valuable than a new opinion article when the existing answers are incomplete.",
      },
      {
        heading: "Keep the same words across the site",
        body:
          "If the homepage says non-custodial and the docs use a different phrase, add a clear definition. Consistent terminology makes the product easier to classify and reduces avoidable factual errors.",
      },
    ],
  },
  {
    title: "Building a Web3 Comparison Page Without Hype",
    slug: "building-a-web3-comparison-page-without-hype",
    excerpt:
      "A practical structure for comparison pages that help buyers decide without making claims you cannot verify.",
    category: "Content Engineering",
    coverImage: "/insights/comparison-balance.png",
    publishedDate: "2026-07-28",
    publishTime: "08:00",
    audience: "Professional",
    readingTime: "8 min read",
    tags: ["Comparison", "Buyer intent", "Trust"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Compare decision criteria, not slogans",
        body:
          "Use criteria a buyer can verify: supported networks, custody model, settlement flow, API style, pricing model, geographic availability, and target customer. Avoid vague claims such as best or fastest without a defined test.",
      },
      {
        heading: "Explain who each option fits",
        body:
          "A comparison becomes more useful when it acknowledges trade-offs. A developer tool may fit teams that need APIs, while a hosted dashboard may fit operators who need speed over customization.",
      },
      {
        heading: "Date the page and cite the sources",
        body:
          "Product capabilities change quickly. Add a last-verified date, link to official documentation, and state which features were checked. This protects credibility and gives future updates a clear starting point.",
      },
    ],
  },
  {
    title: "What Are Citations and Why Do They Matter?",
    slug: "what-are-citations-and-why-do-they-matter",
    excerpt:
      "A simple explanation of the sources behind AI answers and how a Web3 project can become easier to verify.",
    category: "GEO Fundamentals",
    coverImage: "/insights/citation-bridge.png",
    publishedDate: "2026-07-27",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "4 min read",
    tags: ["Citations", "Sources", "Beginner"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "A citation is a path back to evidence",
        body:
          "When an AI answer includes a source, the reader can follow that link to check the claim. A good source is specific, current, and directly related to the fact being used.",
      },
      {
        heading: "First-party and independent sources play different roles",
        body:
          "Your own docs are best for current product details. Independent ecosystem pages, partner references, and technical coverage can add context and help a buyer understand how the product is used outside the homepage.",
      },
      {
        heading: "Do not manufacture mentions",
        body:
          "The goal is not to create a pile of low-quality links. It is to make real, useful facts available in places that people already trust and can inspect.",
      },
    ],
  },
  {
    title: "A Practical Fact-Verification Workflow for Web3 Teams",
    slug: "practical-web3-fact-verification-workflow",
    excerpt:
      "A lightweight review process for checking chains, custody, token references, product status, and integration claims before publication.",
    category: "Operations",
    coverImage: "/insights/fact-verification.png",
    publishedDate: "2026-07-26",
    publishTime: "08:00",
    audience: "Professional",
    readingTime: "9 min read",
    tags: ["Fact checking", "Operations", "Web3"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Create a fact register",
        body:
          "List the claims that appear across the site: supported networks, contract addresses, custody, fees, integrations, launch status, and team or company relationships. Give each claim an owner and a source URL.",
      },
      {
        heading: "Review changes as a release step",
        body:
          "When a product or docs release changes a claim, review the homepage, docs, repository README, ecosystem profiles, and sales copy together. One stale page can reintroduce the old version into future answers.",
      },
      {
        heading: "Keep uncertainty visible",
        body:
          "If a feature is in beta, a chain is planned, or a partner relationship is not public, label it clearly. Accurate uncertainty builds more trust than confident wording that cannot be verified.",
      },
    ],
  },
  {
    title: "How to Explain Wallet, Protocol, and Token Clearly",
    slug: "explain-wallet-protocol-and-token-clearly",
    excerpt:
      "The three Web3 terms that are often mixed together—and a simple way to separate them in your website copy.",
    category: "Web3 Clarity",
    coverImage: "/insights/wallet-protocol-token.png",
    publishedDate: "2026-07-25",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "5 min read",
    tags: ["Wallets", "Protocols", "Tokens"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "A wallet is an interface and a key relationship",
        body:
          "A wallet helps users manage keys and interact with networks. It may also offer swaps, payments, identity, or portfolio features, but those are product capabilities rather than the definition of a wallet itself.",
      },
      {
        heading: "A protocol is a set of rules or contracts",
        body:
          "A protocol can coordinate transactions, lending, payments, identity, or data access. It is not automatically the same thing as the company, interface, or community that supports it.",
      },
      {
        heading: "A token is an asset or representation",
        body:
          "A token may be used for payment, access, governance, or representation. Explain its role separately from the product so an AI system does not mistake the token for the whole business.",
      },
    ],
  },
  {
    title: "Designing an Evidence Brief for AI Search",
    slug: "designing-an-evidence-brief-for-ai-search",
    excerpt:
      "How to compress a complex Web3 project into a source-backed brief that supports writers, partners, and AI visibility work.",
    category: "Content Engineering",
    coverImage: "/insights/evidence-brief.png",
    publishedDate: "2026-07-24",
    publishTime: "08:00",
    audience: "Professional",
    readingTime: "8 min read",
    tags: ["Evidence", "Briefing", "Content systems"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Keep the brief structured",
        body:
          "Use a repeatable layout: one-sentence definition, target users, core workflow, supported networks, limitations, official links, and verified proof. A fixed structure makes gaps obvious before content production begins.",
      },
      {
        heading: "Separate facts from positioning",
        body:
          "Facts describe what can be checked. Positioning explains why a buyer should care. Keeping the two layers separate lets you write persuasive copy without accidentally turning a preference into a factual claim.",
      },
      {
        heading: "Use the brief as a maintenance asset",
        body:
          "A good brief is not a one-time PDF. Store the last-checked date and link each important claim to its source so the team can update it whenever a product release changes the public story.",
      },
    ],
  },
  {
    title: "From AI Answer to Action List: A Founder's First Week",
    slug: "from-ai-answer-to-action-list",
    excerpt:
      "A practical first-week sequence for turning an AI visibility observation into a small set of website and docs improvements.",
    category: "Practical Checks",
    coverImage: "/insights/founder-first-week.png",
    publishedDate: "2026-07-23",
    publishTime: "08:00",
    audience: "Beginner",
    readingTime: "6 min read",
    tags: ["Action plan", "Founders", "Beginner"],
    author: "molthub editorial",
    status: "published",
    sections: [
      {
        heading: "Day one: capture the current answer",
        body:
          "Save the exact question, model, date, answer, and sources. Do not rely on memory or a single score. The original observation is the baseline you will compare later.",
      },
      {
        heading: "Days two and three: fix the clearest facts",
        body:
          "Correct outdated network, custody, product-status, and integration information first. These changes are usually safer and more valuable than rewriting every paragraph on the site.",
      },
      {
        heading: "Days four to seven: add one useful page",
        body:
          "Choose the page that answers the buyer's next question: a use case, FAQ, comparison, or integration guide. Publish it with sources, then rerun the same test set instead of changing the measurement at the same time.",
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
