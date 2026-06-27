import type { VisualGoal, VisualStyle, ToneType } from "./types";

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  defaultVisualGoal: VisualGoal;
  defaultStyle: VisualStyle;
  defaultTone: ToneType;
  promptRules: string[];
  recommendedFor: string[];
  visualFocus: string;
  communityVoice: string;
}

const COMPLIANCE_RULES = [
  "No guaranteed profit or investment returns",
  "No 100x, pump, moon, or guaranteed financial gains",
  "No fake partnerships or fake KOL endorsements",
  "No real exchange logos unless user owns rights",
  "No misleading financial promises or scam packaging",
  "No fabricated metrics, fake investor claims, or fabricated social proof",
  "Content must be suitable for small Web3 projects: meme coins, NFTs, AI agents, Telegram bots, DeFi tools, crypto communities",
  "Prompts must be detailed enough for Midjourney, DALL-E, Leonardo, or Ideogram",
];

export const WORKFLOWS: WorkflowTemplate[] = [
  {
    id: "web3-launch-poster",
    name: "Web3 Launch Poster",
    description:
      "Generate a launch poster prompt and visual brief for a small Web3 product launch.",
    defaultVisualGoal: "Launch Poster",
    defaultStyle: "Dark Crypto",
    defaultTone: "Professional",
    promptRules: [
      ...COMPLIANCE_RULES,
      "Launch poster should convey: new beginnings, technology breakthrough, community arrival, and project identity",
      "Use dark crypto aesthetic with neon accents, blockchain elements, and Web3 symbolism",
      "Avoid busy cluttered layouts; keep focal point clear and readable",
      "Include subtle community gathering metaphor (crowd silhouettes, connected nodes, open doors)",
    ],
    recommendedFor: [
      "Meme coins",
      "NFT collections",
      "New DeFi protocols",
      "Web3 tools",
      "Crypto communities",
    ],
    visualFocus:
      "Dark background, neon accents, bold project name treatment, clean composition, Web3 symbolism",
    communityVoice:
      "Professional and informative, conveying credibility and innovation",
  },
  {
    id: "telegram-bot-promo",
    name: "Telegram Bot Promo",
    description:
      "Generate promo visual prompts for Telegram bots and crypto automation tools.",
    defaultVisualGoal: "Telegram Announcement Image",
    defaultStyle: "Clean Web3",
    defaultTone: "Community-first",
    promptRules: [
      ...COMPLIANCE_RULES,
      "Visual should feature: Telegram interface elements, bot automation indicators, signal alerts, community interaction",
      "Clean interface aesthetic, mobile-first thinking, signal and notification design language",
      "Avoid showing fake trading results or guaranteed returns",
      "Emphasize: automation, ease of use, community value, and signal quality",
    ],
    recommendedFor: [
      "Telegram bots",
      "Crypto signal tools",
      "Trading automation",
      "Community management bots",
      "Analytics tools",
    ],
    visualFocus:
      "Telegram UI frame, bot avatar, signal indicators, clean mobile-friendly layout, Web3 branding",
    communityVoice:
      "Community-focused, accessible, highlighting automation benefits for community members",
  },
  {
    id: "ai-agent-launch",
    name: "AI Agent Launch",
    description:
      "Generate launch visual prompts for AI x Crypto agents and automation tools.",
    defaultVisualGoal: "X Promo Image",
    defaultStyle: "Futuristic",
    defaultTone: "Professional",
    promptRules: [
      ...COMPLIANCE_RULES,
      "Visual should convey: artificial intelligence, data processing, automation, crypto integration",
      "Futuristic interface aesthetic with AI visualization (neural networks, data streams, AI avatars)",
      "Avoid implying the AI has human-level judgment in trading or investment decisions",
      "Emphasize: utility, innovation, automation efficiency, and technical capability",
    ],
    recommendedFor: [
      "AI agents",
      "Trading bots",
      "Analytics automation",
      "Smart contract automation",
      "Data aggregation tools",
    ],
    visualFocus:
      "Futuristic AI interface, data visualization, neural network motifs, clean tech aesthetic, crypto symbols",
    communityVoice:
      "Professional and tech-forward, conveying cutting-edge innovation and real utility",
  },
  {
    id: "crypto-dashboard-promo",
    name: "Crypto Dashboard Promo",
    description:
      "Generate product promo visuals for dashboards, analytics tools, and crypto SaaS.",
    defaultVisualGoal: "X Promo Image",
    defaultStyle: "Premium Fintech",
    defaultTone: "Serious",
    promptRules: [
      ...COMPLIANCE_RULES,
      "Visual should feature: clean dashboard interface, data visualization, charts, analytics UI",
      "Premium fintech aesthetic: minimalist, data-driven, trustworthy, professional",
      "Avoid showing fake trading P&L or guaranteed returns from the tool",
      "Emphasize: insight, clarity, professional-grade analytics, and actionable data",
    ],
    recommendedFor: [
      "Analytics dashboards",
      "Portfolio trackers",
      "On-chain analytics",
      "Trading tools",
      "Crypto SaaS products",
    ],
    visualFocus:
      "Clean dashboard UI, chart elements, data visualization, premium fintech layout, trustworthy aesthetic",
    communityVoice:
      "Serious and data-driven, conveying professional-grade insight and analytical value",
  },
  {
    id: "meme-visual-concept",
    name: "Meme Visual Concept",
    description:
      "Generate meme-friendly visual concepts without fake financial claims or hype.",
    defaultVisualGoal: "Meme Image",
    defaultStyle: "Meme / Degen",
    defaultTone: "Funny",
    promptRules: [
      ...COMPLIANCE_RULES,
      "Visual can be funny, relatable, or satirical but must NOT promise financial returns",
      "Meme aesthetic: relatable humor, community culture, Internet-native design, viral-ready format",
      "Absolutely NO: guaranteed moon, 100x claims, fake pump signals, investment guarantees",
      "Allowed: community jokes, relatable crypto struggles, project personality, viral meme formats",
    ],
    recommendedFor: [
      "Meme coins",
      "Community-driven projects",
      "Satirical crypto projects",
      "Community engagement campaigns",
      "Viral marketing initiatives",
    ],
    visualFocus:
      "Meme-style imagery, relatable humor, community culture references, viral-ready format, Internet-native aesthetic",
    communityVoice:
      "Funny and community-focused, building cultural resonance without financial hype",
  },
];

export function getWorkflow(id: string): WorkflowTemplate {
  return (
    WORKFLOWS.find((w) => w.id === id) ?? WORKFLOWS[0]!
  );
}
