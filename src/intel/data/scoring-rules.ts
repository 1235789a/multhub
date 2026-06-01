// ============================================================
// SCORING RULES (Internal Layer Only)
// ============================================================
//
// 评分系统：6维度，100分总分
//
// 核心原则：
// - Pain Frequency: 25分 (最重要)
// - USDT Compatibility: 20分
// - Impulse Buy Potential: 15分
// - Solo Buildability: 15分
// - Distribution Ease: 15分
// - GEO Potential: 10分
//
// ============================================================

import type { OpportunityScore } from "./opportunities";

export interface ScoringCriterion {
  minPoints: number;
  maxPoints: number;
  description: string;
  evidenceRequired?: string[];
}

export interface ScoringRule {
  dimension: Exclude<keyof OpportunityScore, "total">;
  maxPoints: number;
  description: string;
  criteria: ScoringCriterion[];
}

export const SCORING_RULES: Record<Exclude<keyof OpportunityScore, "total">, ScoringRule> = {
  painFrequency: {
    dimension: "painFrequency",
    maxPoints: 25,
    description: "痛点在目标用户中出现的频率和强度",
    criteria: [
      {
        minPoints: 20,
        maxPoints: 25,
        description: "每天/每周出现，有强烈情绪表达，大量讨论",
        evidenceRequired: [
          "Reddit 等平台高频讨论",
          "明确的'我需要这个工具'表达",
          "高赞高回复的讨论串",
        ],
      },
      {
        minPoints: 14,
        maxPoints: 19,
        description: "每周出现，影响工作效率，有持续讨论",
        evidenceRequired: [
          "多个独立讨论串",
          "用户分享自己的临时解决方案",
        ],
      },
      {
        minPoints: 8,
        maxPoints: 13,
        description: "偶尔出现，但很痛苦，有一定讨论量",
        evidenceRequired: [
          "有一些讨论",
          "用户表示希望有更好的工具",
        ],
      },
      {
        minPoints: 0,
        maxPoints: 7,
        description: "低频痛点，竞争激烈，用户付费意愿低",
      },
    ],
  },

  usdtCompatibility: {
    dimension: "usdtCompatibility",
    maxPoints: 20,
    description: "目标用户群体是否天然接受加密货币支付",
    criteria: [
      {
        minPoints: 17,
        maxPoints: 20,
        description: "AI、SEO、Crypto、开发者、Indie Hacker 等群体",
        evidenceRequired: [
          "目标用户是技术从业者",
          "活跃在 Reddit、X/Twitter、Indie Hackers 等平台",
          "经常使用在线工具和软件",
        ],
      },
      {
        minPoints: 12,
        maxPoints: 16,
        description: "内容创作者、自由职业者、小型团队",
        evidenceRequired: [
          "用户需要高效工具",
          "可能使用付费订阅服务",
        ],
      },
      {
        minPoints: 6,
        maxPoints: 11,
        description: "普通消费者、非技术用户",
        evidenceRequired: [
          "需要教育用户使用加密支付",
          "可能需要额外的支付选项",
        ],
      },
      {
        minPoints: 0,
        maxPoints: 5,
        description: "传统企业、大型组织（不适合）",
      },
    ],
  },

  impulseBuyPotential: {
    dimension: "impulseBuyPotential",
    maxPoints: 15,
    description: "是否适合冲动消费定价（$4/$9/$19）",
    criteria: [
      {
        minPoints: 12,
        maxPoints: 15,
        description: "单次付费 < $10，可立即解决明确问题，一次付费永久使用",
        evidenceRequired: [
          "可立即验证价值",
          "问题清晰，解决方案明确",
          "用户愿意为节省时间付费",
        ],
      },
      {
        minPoints: 8,
        maxPoints: 11,
        description: "单次付费 $10-$30，有明确 ROI，一次付费多次使用",
        evidenceRequired: [
          "可以量化节省的时间或金钱",
          "用户会多次使用工具",
        ],
      },
      {
        minPoints: 4,
        maxPoints: 7,
        description: "单次付费 $30-$100，需要教育，决策周期较长",
        evidenceRequired: [
          "需要演示或试用",
          "可能需要考虑一段时间",
        ],
      },
      {
        minPoints: 0,
        maxPoints: 3,
        description: "需要订阅或复杂定价，企业购买流程",
      },
    ],
  },

  soloBuildability: {
    dimension: "soloBuildability",
    maxPoints: 15,
    description: "一人能否在 1-2 周内完成 MVP",
    criteria: [
      {
        minPoints: 12,
        maxPoints: 15,
        description: "1 周内可完成，有现成 API/库，单一核心功能",
        evidenceRequired: [
          "核心功能单一明确",
          "有可复用的 API 或库",
          "不需要复杂的后端架构",
        ],
      },
      {
        minPoints: 8,
        maxPoints: 11,
        description: "1-2 周可完成，需要一些集成，MVP 范围清晰",
        evidenceRequired: [
          "需要 2-3 个核心功能",
          "可能需要一些外部集成",
          "范围可控",
        ],
      },
      {
        minPoints: 4,
        maxPoints: 7,
        description: "2-4 周可完成，需要多个集成，一定复杂度",
        evidenceRequired: [
          "复杂度中等",
          "需要多个外部服务集成",
        ],
      },
      {
        minPoints: 0,
        maxPoints: 3,
        description: ">1 个月，需要后端+前端+运维，复杂度高",
      },
    ],
  },

  distributionEase: {
    dimension: "distributionEase",
    maxPoints: 15,
    description: "能否通过社区/社交媒体触达目标用户",
    criteria: [
      {
        minPoints: 12,
        maxPoints: 15,
        description: "明确的 Subreddit + 明确的 X/Twitter 社区，天然流量渠道",
        evidenceRequired: [
          "有现成的活跃社区",
          "可以直接在相关 subreddit 发帖",
          "有明确的 X/Twitter 话题和 KOL",
        ],
      },
      {
        minPoints: 8,
        maxPoints: 11,
        description: "明确的社区或明确的社交渠道之一",
        evidenceRequired: [
          "至少有一个主要流量渠道",
          "Product Hunt 可以获得初期流量",
        ],
      },
      {
        minPoints: 4,
        maxPoints: 7,
        description: "主要依靠 SEO/GEO 自然流量，冷启动较慢",
        evidenceRequired: [
          "有明确的搜索需求",
          "可以通过 GEO 内容获得流量",
        ],
      },
      {
        minPoints: 0,
        maxPoints: 3,
        description: "冷启动困难，需要付费推广，目标用户分散",
      },
    ],
  },

  geoPotential: {
    dimension: "geoPotential",
    maxPoints: 10,
    description: "有多少长尾问题可以扩展为 GEO 内容",
    criteria: [
      {
        minPoints: 8,
        maxPoints: 10,
        description: ">15 个长尾问题可以扩展，涵盖 FAQ、UseCase、Comparison、CaseStudy",
        evidenceRequired: [
          "大量'How to'问题",
          "多个竞品可以比较",
          "有明确的使用场景",
        ],
      },
      {
        minPoints: 5,
        maxPoints: 7,
        description: "10-15 个内容可扩展",
        evidenceRequired: [
          "有一些 FAQ 和 UseCase 可以写",
          "有 2-3 个竞品可以比较",
        ],
      },
      {
        minPoints: 2,
        maxPoints: 4,
        description: "5-10 个内容可扩展",
        evidenceRequired: [
          "内容有限，但仍可以写一些",
        ],
      },
      {
        minPoints: 0,
        maxPoints: 1,
        description: "<5 个内容，关键词竞争激烈，红海市场",
      },
    ],
  },
};

// ============================================================
// 评分计算工具函数
// ============================================================

export function calculateTotalScore(score: Omit<OpportunityScore, "total">): number {
  return (
    score.painFrequency +
    score.usdtCompatibility +
    score.impulseBuyPotential +
    score.soloBuildability +
    score.distributionEase +
    score.geoPotential
  );
}

export function validateScore(score: OpportunityScore): boolean {
  const {
    painFrequency,
    usdtCompatibility,
    impulseBuyPotential,
    soloBuildability,
    distributionEase,
    geoPotential,
    total,
  } = score;

  const calculatedTotal = calculateTotalScore({
    painFrequency,
    usdtCompatibility,
    impulseBuyPotential,
    soloBuildability,
    distributionEase,
    geoPotential,
  });

  return (
    painFrequency >= 0 && painFrequency <= 25 &&
    usdtCompatibility >= 0 && usdtCompatibility <= 20 &&
    impulseBuyPotential >= 0 && impulseBuyPotential <= 15 &&
    soloBuildability >= 0 && soloBuildability <= 15 &&
    distributionEase >= 0 && distributionEase <= 15 &&
    geoPotential >= 0 && geoPotential <= 10 &&
    total === calculatedTotal
  );
}

export function getScoreLevel(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "poor";
}
