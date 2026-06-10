export type ProjectType =
  | "Meme Coin"
  | "AI Agent"
  | "DeFi"
  | "GameFi"
  | "NFT"
  | "Web3 SaaS";

export type CampaignGoal =
  | "Community Growth"
  | "X Followers"
  | "Telegram Members"
  | "Product Awareness"
  | "Beta User Acquisition"
  | "Engagement Boost";

export type Budget = "100 USDT" | "500 USDT" | "1000 USDT" | "5000+ USDT";

export type CampaignDuration = "3 Days" | "7 Days" | "14 Days" | "30 Days";

export type CommunitySize =
  | "Under 100"
  | "100+"
  | "1000+"
  | "10000+"
  | "50000+";

export type TargetRegion = "Global" | "Asia" | "Europe" | "North America";

export type CampaignStyle =
  | "Aggressive Growth"
  | "Balanced"
  | "Community First"
  | "Premium Brand";

export interface GenerateRequest {
  projectType: ProjectType;
  campaignGoal: CampaignGoal;
  budget: Budget;
  duration: CampaignDuration;
  communitySize: CommunitySize;
  targetRegion: TargetRegion;
  campaignStyle: CampaignStyle;
  projectName: string;
  projectDescription: string;
  additionalNotes: string;
}

export interface CampaignOverview {
  goal: string;
  strategy: string;
  mechanics: string;
}

export interface RewardStructure {
  rewardMechanics: string;
  rewardDistribution: string;
  budgetAllocation: string;
}

export interface TaskDesign {
  recommendedTasks: string;
  participationFlow: string;
  userJourney: string;
}

export interface PromotionPlan {
  twitter: string;
  telegram: string;
  discord: string;
}

export interface CampaignTimeline {
  day1: string;
  day2: string;
  day3: string;
  keyMilestones: string;
}

export interface RiskWarnings {
  sybilAttack: string;
  botWash: string;
  budgetWaste: string;
  complexity: string;
}

export interface OptimizationSuggestions {
  engagement: string;
  conversion: string;
  antiCheat: string;
}

export interface GenerateResponse {
  success: true;
  overview: CampaignOverview;
  rewards: RewardStructure;
  tasks: TaskDesign;
  promotion: PromotionPlan;
  timeline: CampaignTimeline;
  risks: RiskWarnings;
  optimization: OptimizationSuggestions;
  remainingQuota: number;
  meta: {
    licenseUsage: number;
    licenseQuota: number;
    promptTokens?: number;
    completionTokens?: number;
  };
}
