export type PosterType = "Partnership" | "AMA" | "Airdrop" | "Launch";

export type VisualStyle =
  | "Professional"
  | "Minimal"
  | "Premium"
  | "Cyberpunk"
  | "Meme";

export type ColorTheme = "Blue" | "Purple" | "Green" | "Black Gold" | "Red";

export interface GenerateRequest {
  posterType: PosterType;
  projectName: string;
  ticker: string;
  subtitle: string;
  visualStyle: VisualStyle;
  colorTheme: ColorTheme;
  
  partnerName?: string;
  guestName?: string;
  amaDate?: string;
  rewardAmount?: string;
  campaignName?: string;
  launchDate?: string;
  network?: string;
}

export interface GenerateResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  remainingQuota?: number;
  error?: string;
}