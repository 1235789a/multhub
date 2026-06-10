export type PartnershipType =
  | "Strategic Partnership"
  | "Ecosystem Partnership"
  | "Technology Integration"
  | "Marketing Collaboration"
  | "Community Partnership";

export type ToneType =
  | "Professional"
  | "Exciting"
  | "Community-first"
  | "Investor-focused";

export type LengthType = "Short" | "Medium" | "Long";

export interface GenerateRequest {
  projectAName: string;
  projectBName: string;
  projectADescription: string;
  projectBDescription: string;
  partnershipType: PartnershipType;
  mainBenefits: string;
  websiteLinks: string;
  tone: ToneType;
  length: LengthType;
}

export interface GeneratedContent {
  twitter: string;
  telegram: string;
  discord: string;
  medium: string;
}

export interface GenerateResponse {
  request: GenerateRequest;
  content: GeneratedContent;
  disclaimer: string;
  meta: {
    licenseUsage: number;
    licenseQuota: number;
    promptTokens?: number;
    completionTokens?: number;
  };
}
