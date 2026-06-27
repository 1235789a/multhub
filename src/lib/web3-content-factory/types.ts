export type ProjectType =
  | "Meme Coin"
  | "NFT Project"
  | "AI Agent"
  | "Telegram Bot"
  | "DeFi Tool"
  | "Web3 Tool";

export type ProjectStage =
  | "Pre-launch"
  | "Launched"
  | "Presale"
  | "Airdrop"
  | "Community Growth";

export type ToneType =
  | "Degen"
  | "Professional"
  | "Funny"
  | "Community-first"
  | "Investor-focused";

export interface GenerateRequest {
  projectName: string;
  projectType: ProjectType;
  projectDescription: string;
  targetAudience: string;
  stage: ProjectStage;
  tone: ToneType;
  websiteLinks: string;
}

export interface GeneratedContent {
  xPost: string;
  xThread: string[];
  telegramAnnouncement: string;
  telegramPinnedMessage: string;
  memeImagePrompt: string;
  communityEngagementPost: string;
  sevenDayContentPlan: string[];
}

export interface GenerateResponse {
  request: GenerateRequest;
  content: GeneratedContent;
  disclaimer: string;
  meta: {
    licenseUsage: number;
    licenseQuota: number;
    promptTokens: number;
    completionTokens: number;
    mode: "license" | "trial";
  };
}
