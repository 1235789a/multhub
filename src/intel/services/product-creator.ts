// ============================================================
// PRODUCT CREATOR (Internal Layer Only)
// ============================================================
//
// 从 Opportunity 创建 Product 的工具函数
//
// 核心功能：
// - createProductFromOpportunity(opp): 将 Opportunity 转换为 Product
// - printProductCode(opp): 输出可复制的代码片段，方便手动添加到 products.ts
// - createProductAndUpdateOpportunity(opp): 创建 Product 并更新 Opportunity 状态
//
// ============================================================

import type { Product } from "../../app/data/products";
import type { Opportunity } from "../data/opportunities";

export interface ProductCreationResult {
  product: Product;
  codeSnippet: string;
  updatedOpportunity: Opportunity;
}

export function createProductFromOpportunity(opp: Opportunity): Product {
  const product: Product = {
    name: opp.productIdea.name,
    slug: opp.productIdea.slug,
    icon: opp.productIdea.icon,
    version: "v0.1",
    priceBase: opp.productIdea.priceUSDT, // 使用 USDT 价格作为基础价格
    priceDisplay: opp.productIdea.priceDisplay,
    priceUSDT: opp.productIdea.priceUSDT,
    features: opp.productIdea.features,
    status: "available", // 默认设为可用状态
    eta: undefined,
    progress: 100,
    launchPath: undefined,
    trialConfig: { allowed: true, maxUses: 3 },
    
    // GEO 相关字段（新增字段）
    tagline: {
      en: opp.title,
      zh: opp.title
    },
    description: opp.productIdea.description,
    targetUsers: {
      en: [opp.targetNiche],
      zh: [opp.targetNiche]
    },
    painPoints: {
      en: [opp.pain],
      zh: [opp.pain]
    },
    keywords: opp.seoKeywords,
    tags: [
      opp.productIdea.productType,
      "ai-tool",
      "productivity"
    ],
    pricingDetails: {
      amount: opp.productIdea.priceUSDT,
      currency: "USDT",
      description: {
        en: "One-time payment, lifetime access",
        zh: "一次付费，永久使用"
      }
    },
    paymentMethods: ["USDT", "Crypto"],
    useCases: {
      en: opp.geoExpansion.useCaseTopics.slice(0, 3),
      zh: opp.geoExpansion.useCaseTopics.slice(0, 3)
    },
    relatedProducts: []
  };

  return product;
}

export function printProductCode(opp: Opportunity): string {
  const product = createProductFromOpportunity(opp);

  const nameStr = JSON.stringify(product.name, null, 2);
  const featuresStr = JSON.stringify(product.features, null, 2);
  const taglineStr = product.tagline ? JSON.stringify(product.tagline, null, 2) : undefined;
  const descriptionStr = product.description ? JSON.stringify(product.description, null, 2) : undefined;
  const keywordsStr = product.keywords ? JSON.stringify(product.keywords, null, 2) : undefined;

  const code = `
  {
    name: ${nameStr},
    slug: "${product.slug}",
    icon: "${product.icon}",
    version: "${product.version}",
    priceBase: ${product.priceBase},
    priceDisplay: "${product.priceDisplay}",
    priceUSDT: ${product.priceUSDT},
    features: ${featuresStr},
    status: "${product.status}",
    eta: ${product.eta ? `"${product.eta}"` : "undefined"},
    progress: ${product.progress},
    launchPath: ${product.launchPath ? `"${product.launchPath}"` : "undefined"},
    trialConfig: ${JSON.stringify(product.trialConfig, null, 2)},
    ${taglineStr ? `tagline: ${taglineStr},` : ""}
    ${descriptionStr ? `description: ${descriptionStr},` : ""}
    ${keywordsStr ? `keywords: ${keywordsStr},` : ""}
  }`;

  return code;
}

export function createProductAndUpdateOpportunity(
  opp: Opportunity,
  decisionNote?: string
): ProductCreationResult {
  const product = createProductFromOpportunity(opp);
  const codeSnippet = printProductCode(opp);

  const updatedOpportunity: Opportunity = {
    ...opp,
    status: "building",
    decidedAt: new Date().toISOString(),
    decision: "approve",
    decisionNote: decisionNote || "Approved for development",
    contentGenerated: false,
    updatedAt: new Date().toISOString(),
    generatedContent: opp.generatedContent || {
      faqIds: [],
      useCaseIds: [],
      comparisonIds: [],
      caseStudyIds: [],
      productSlug: product.slug
    }
  };

  return {
    product,
    codeSnippet,
    updatedOpportunity
  };
}

export function markOpportunityAsShipped(opp: Opportunity, productSlug: string): Opportunity {
  return {
    ...opp,
    status: "shipped",
    updatedAt: new Date().toISOString(),
    generatedContent: {
      ...(opp.generatedContent || {
        faqIds: [],
        useCaseIds: [],
        comparisonIds: [],
        caseStudyIds: []
      }),
      productSlug
    }
  };
}

export function markOpportunityAsDead(opp: Opportunity, reason: string): Opportunity {
  return {
    ...opp,
    status: "dead",
    decidedAt: new Date().toISOString(),
    decision: "reject",
    decisionNote: reason,
    updatedAt: new Date().toISOString()
  };
}

export function validateProductCreation(opp: Opportunity): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (opp.status !== "new" && opp.status !== "validating") {
    issues.push(`Opportunity status should be 'new' or 'validating', current: '${opp.status}'`);
  }

  if (opp.score.total < 70) {
    issues.push(`Score should be >= 70, current: ${opp.score.total}`);
  }

  if (!opp.productFit.soloBuildable) {
    issues.push("Product should be solo-buildable");
  }

  if (!opp.productFit.twoWeekMVP) {
    issues.push("Product should be buildable in 2 weeks");
  }

  if (!opp.productFit.usdtAcceptable) {
    issues.push("Product should accept USDT payment");
  }

  if (!opp.productFit.globalSales) {
    issues.push("Product should be sellable globally");
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
