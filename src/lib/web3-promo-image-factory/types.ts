export type ProjectType =
  | "Meme Coin"
  | "NFT Project"
  | "AI Agent"
  | "Telegram Bot"
  | "DeFi Tool"
  | "Web3 Tool"
  | "Crypto Community";

export type VisualGoal =
  | "Launch Poster"
  | "Meme Image"
  | "X Promo Image"
  | "Telegram Announcement Image"
  | "Community Engagement Image"
  | "Partnership Visual"
  | "Airdrop Campaign Visual";

export type VisualStyle =
  | "Cyberpunk"
  | "Clean Web3"
  | "Meme / Degen"
  | "Futuristic"
  | "Premium Fintech"
  | "Dark Crypto"
  | "Cute Mascot";

export type ToneType = "Serious" | "Funny" | "Degen" | "Professional" | "Community-first";

export type OutputMode = "Prompt Only" | "Visual Brief" | "Image if provider available";

export interface GenerateRequest {
  projectName: string;
  projectType: ProjectType;
  projectDescription: string;
  visualGoal: VisualGoal;
  style: VisualStyle;
  tone: ToneType;
  keyMessage: string;
  brandColors?: string;
  logoDescription?: string;
  outputMode?: OutputMode;
}

export interface GeneratedContent {
  imagePrompt: string;
  negativePrompt: string;
  visualBrief: string;
  headlineText: string;
  captionText: string;
  layoutTips: string[];
  variants: string[];
}

export interface GenerateResponse {
  request: GenerateRequest;
  content: GeneratedContent;
  imageUrl?: string;
  disclaimer: string;
  meta: {
    licenseUsage: number;
    licenseQuota: number;
    promptTokens: number;
    completionTokens: number;
    mode: "license" | "trial";
  };
}
