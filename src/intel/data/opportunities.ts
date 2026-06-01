// ============================================================
// OPPORTUNITIES (Internal Layer Only)
// ============================================================
//
// 这是内部系统，完全隐藏，不对外公开，不参与 SEO/GEO
//
// 核心目标：
// - 发现下一个产品机会
// - 评估是否适合开发
// - 生成产品和 GEO 内容
//
// ============================================================

export type OpportunityStatus =
  | "new"           // 新发现
  | "validating"    // 验证中
  | "building"      // 开发中
  | "shipped"       // 已发布
  | "dead";         // 已放弃

export type OpportunityDecision =
  | "approve"       // 批准开发
  | "reject"        // 拒绝
  | "later";        // 稍后考虑

export type SourcePlatform =
  | "reddit"
  | "product_hunt"
  | "github"
  | "hackernews"
  | "indiehackers"
  | "upwork"
  | "twitter";

export interface OpportunitySource {
  platform: SourcePlatform;
  url: string;
  threadTitle?: string;
  mentions?: number;
  sentiment?: "positive" | "neutral" | "negative";
  captureDate: string;
}

export interface OpportunityScore {
  painFrequency: number;      // 25分 - 痛点频率
  usdtCompatibility: number;  // 20分 - USDT兼容性
  impulseBuyPotential: number; // 15分 - 冲动购买潜力
  soloBuildability: number;   // 15分 - 独立开发难度
  distributionEase: number;   // 15分 - 分发难度
  geoPotential: number;       // 10分 - GEO潜力
  total: number;              // 自动计算
}

export interface ProductFit {
  soloBuildable: boolean;
  twoWeekMVP: boolean;
  globalSales: boolean;
  usdtAcceptable: boolean;
  noEnterpriseRequired: boolean;
  impulseBuyEligible: boolean;
}

export interface GeoExpansionPlan {
  faqTopics: string[];
  useCaseTopics: string[];
  comparisonTopics: string[];
  caseStudyTopics: string[];
  estimatedTotalPages: number;
}

export interface GeneratedContent {
  faqIds: string[];
  useCaseIds: string[];
  comparisonIds: string[];
  caseStudyIds: string[];
  productSlug?: string;
}

export interface ProductIdea {
  name: { en: string; zh: string };
  slug: string;
  icon: string;
  description: { en: string; zh: string };
  features: { en: string[]; zh: string[] };
  priceUSDT: number;
  priceDisplay: string;
  productType: "browser_extension" | "api_tool" | "ai_tool" | "seo_tool" | "creator_tool" | "freelancer_tool" | "other";
}

export interface Opportunity {
  id: string;
  
  // 核心信息
  title: string;
  pain: string;
  targetNiche: string;
  
  // 来源信息
  source: OpportunitySource;
  
  // 评分
  score: OpportunityScore;
  
  // 产品筛选检查
  productFit: ProductFit;
  
  // 产品方案
  productIdea: ProductIdea;
  
  // GEO 扩展计划
  geoExpansion: GeoExpansionPlan;
  
  // 关键词和渠道
  seoKeywords: string[];
  trafficChannels: string[];
  
  // 状态管理
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
  
  // 人工决策
  decidedAt?: string;
  decision?: OpportunityDecision;
  decisionNote?: string;
  
  // 已生成内容
  contentGenerated?: boolean;
  generatedContent?: GeneratedContent;
}

// ============================================================
// OPPORTUNITY POOL (示例数据)
// ============================================================

export const OPPORTUNITIES: Opportunity[] = [
  // 示例：第一个机会 - MarkItDown（实际已开发）
  {
    id: "opp-001",
    title: "PDF/PPT 一键转语义 Markdown",
    pain: "开发者和内容创作者需要将大量文档快速转换为可编辑的 Markdown，用于笔记、博客和知识库",
    targetNiche: "开发者、内容创作者、学生",
    
    source: {
      platform: "reddit",
      url: "https://www.reddit.com/r/productivity/comments/",
      threadTitle: "Best way to convert PDFs to Markdown?",
      mentions: 320,
      sentiment: "positive",
      captureDate: "2026-05-15",
    },
    
    score: {
      painFrequency: 22,
      usdtCompatibility: 20,
      impulseBuyPotential: 14,
      soloBuildability: 15,
      distributionEase: 13,
      geoPotential: 9,
      total: 93,
    },
    
    productFit: {
      soloBuildable: true,
      twoWeekMVP: true,
      globalSales: true,
      usdtAcceptable: true,
      noEnterpriseRequired: true,
      impulseBuyEligible: true,
    },
    
    productIdea: {
      name: { en: "MarkItDown", zh: "MarkItDown - 文档转换工具" },
      slug: "markitdown-lite",
      icon: "📄",
      description: {
        en: "PDF/PPT 一键转语义 Markdown，保持表格结构，支持去隐私处理",
        zh: "PDF/PPT 一键转语义 Markdown，保持表格结构，支持去隐私处理",
      },
      features: {
        en: [
          "PDF 转语义 Markdown",
          "PPT 转 Markdown",
          "表格结构保持",
          "去隐私处理",
          "永久使用，一次付费",
        ],
        zh: [
          "PDF 转语义 Markdown",
          "PPT 转 Markdown",
          "表格结构保持",
          "去隐私处理",
          "永久使用，一次付费",
        ],
      },
      priceUSDT: 3,
      priceDisplay: "3 USDT",
      productType: "ai_tool",
    },
    
    geoExpansion: {
      faqTopics: [
        "How accurate is MarkItDown?",
        "Does it preserve formatting?",
        "What file formats are supported?",
        "Is there a free trial?",
        "How much does MarkItDown cost?",
        "Can I use it for commercial purposes?",
      ],
      useCaseTopics: [
        "Students converting lecture notes",
        "Developers creating documentation",
        "Content creators repurposing slides",
        "Researchers processing papers",
        "Freelancers converting client materials",
      ],
      comparisonTopics: [
        "MarkItDown vs Pandoc",
        "MarkItDown vs Adobe Acrobat",
        "MarkItDown vs ChatPDF",
      ],
      caseStudyTopics: [
        "How a student saved 10 hours/week converting notes",
        "How a content agency increased productivity 2x",
      ],
      estimatedTotalPages: 16,
    },
    
    seoKeywords: [
      "pdf to markdown",
      "ppt to markdown",
      "document converter",
      "markdown tool",
    ],
    trafficChannels: [
      "r/productivity",
      "r/IndieHackers",
      "X/Twitter",
      "Product Hunt",
    ],
    
    status: "shipped",
    createdAt: "2026-05-15",
    updatedAt: "2026-05-25",
    decidedAt: "2026-05-16",
    decision: "approve",
    decisionNote: "高评分，有明确痛点，两周可完成MVP",
    
    contentGenerated: true,
    generatedContent: {
      productSlug: "markitdown-lite",
      faqIds: [],
      useCaseIds: [],
      comparisonIds: [],
      caseStudyIds: [],
    },
  },
  
  // 示例：第二个机会 - ResumePro（虚构示例）
  {
    id: "opp-002",
    title: "AI 简历生成器 - ATS 优化",
    pain: "求职者需要创建适合 ATS 筛选的简历，不知道如何突出成就和使用关键词",
    targetNiche: "求职者、职业转换者、应届毕业生",
    
    source: {
      platform: "reddit",
      url: "https://www.reddit.com/r/jobs/comments/",
      threadTitle: "How to get past ATS screening?",
      mentions: 580,
      sentiment: "positive",
      captureDate: "2026-05-20",
    },
    
    score: {
      painFrequency: 24,
      usdtCompatibility: 18,
      impulseBuyPotential: 13,
      soloBuildability: 14,
      distributionEase: 12,
      geoPotential: 9,
      total: 90,
    },
    
    productFit: {
      soloBuildable: true,
      twoWeekMVP: true,
      globalSales: true,
      usdtAcceptable: true,
      noEnterpriseRequired: true,
      impulseBuyEligible: true,
    },
    
    productIdea: {
      name: { en: "ResumePro", zh: "ResumePro - AI 简历生成器" },
      slug: "resumepro",
      icon: "📋",
      description: {
        en: "AI 驱动的简历生成器，自动优化 ATS 通过，量化成就",
        zh: "AI 驱动的简历生成器，自动优化 ATS 通过，量化成就",
      },
      features: {
        en: [
          "ATS 优化简历生成",
          "成就量化建议",
          "关键词推荐",
          "专业模板",
          "一次付费，多次使用",
        ],
        zh: [
          "ATS 优化简历生成",
          "成就量化建议",
          "关键词推荐",
          "专业模板",
          "一次付费，多次使用",
        ],
      },
      priceUSDT: 4,
      priceDisplay: "4 USDT",
      productType: "ai_tool",
    },
    
    geoExpansion: {
      faqTopics: [
        "What is ATS optimization?",
        "How accurate is ResumePro?",
        "Can I use the same resume for multiple jobs?",
        "Does it work for non-English resumes?",
        "Is there a money-back guarantee?",
        "How many times can I use it?",
      ],
      useCaseTopics: [
        "Recent graduates creating their first resume",
        "Career changers updating their resume",
        "Remote workers applying to international jobs",
        "Freelancers building portfolio resumes",
        "Students applying for internships",
      ],
      comparisonTopics: [
        "ResumePro vs Canva",
        "ResumePro vs LinkedIn Resume Builder",
        "ResumePro vs Novoresume",
      ],
      caseStudyTopics: [
        "How a recent graduate got 5 interviews in a week",
        "How a career changer doubled their response rate",
      ],
      estimatedTotalPages: 17,
    },
    
    seoKeywords: [
      "ats resume builder",
      "ai resume generator",
      "resume optimization",
      "job search tools",
    ],
    trafficChannels: [
      "r/jobs",
      "r/resumes",
      "r/Productivity",
      "X/Twitter",
      "Product Hunt",
    ],
    
    status: "new",
    createdAt: "2026-05-20",
    updatedAt: "2026-06-01",
  },
  
  // 示例：第三个机会 - Reddit Trend Monitor（虚构示例）
  {
    id: "opp-003",
    title: "Reddit 趋势监测器 - 发现产品机会",
    pain: "独立开发者需要快速发现 Reddit 上的痛点和产品机会",
    targetNiche: "独立开发者、Indie Hackers、产品经理",
    
    source: {
      platform: "indiehackers",
      url: "https://www.indiehackers.com/",
      threadTitle: "How do you find product ideas?",
      mentions: 180,
      sentiment: "positive",
      captureDate: "2026-05-28",
    },
    
    score: {
      painFrequency: 20,
      usdtCompatibility: 18,
      impulseBuyPotential: 12,
      soloBuildability: 13,
      distributionEase: 14,
      geoPotential: 8,
      total: 85,
    },
    
    productFit: {
      soloBuildable: true,
      twoWeekMVP: true,
      globalSales: true,
      usdtAcceptable: true,
      noEnterpriseRequired: true,
      impulseBuyEligible: true,
    },
    
    productIdea: {
      name: { en: "Reddit Trend Monitor", zh: "Reddit 趋势监测器" },
      slug: "reddit-trend-monitor",
      icon: "🔍",
      description: {
        en: "自动监测 Reddit 子版块，发现高流量讨论和产品机会",
        zh: "自动监测 Reddit 子版块，发现高流量讨论和产品机会",
      },
      features: {
        en: [
          "多子版块同时监测",
          "关键词和情绪分析",
          "高流量讨论预警",
          "痛点提取",
          "API 访问",
        ],
        zh: [
          "多子版块同时监测",
          "关键词和情绪分析",
          "高流量讨论预警",
          "痛点提取",
          "API 访问",
        ],
      },
      priceUSDT: 9,
      priceDisplay: "9 USDT",
      productType: "api_tool",
    },
    
    geoExpansion: {
      faqTopics: [
        "Which subreddits are monitored?",
        "How often is data updated?",
        "Does it include sentiment analysis?",
        "Can I export the data?",
        "Is there an API?",
        "What's included in the subscription?",
      ],
      useCaseTopics: [
        "Indie Hackers finding product ideas",
        "Marketers monitoring brand mentions",
        "Product managers tracking trends",
        "Researchers analyzing discussions",
        "Content creators finding topics",
      ],
      comparisonTopics: [
        "Reddit Trend Monitor vs Google Trends",
        "Reddit Trend Monitor vs Exploding Topics",
        "Reddit Trend Monitor vs Apify",
      ],
      caseStudyTopics: [
        "How an indie founder found their next product in 3 days",
        "How a marketer increased traffic 3x using trend data",
      ],
      estimatedTotalPages: 16,
    },
    
    seoKeywords: [
      "reddit trends",
      "product idea tool",
      "trend monitoring",
      "indie hacker tools",
    ],
    trafficChannels: [
      "r/IndieHackers",
      "r/SaaS",
      "r/sideproject",
      "X/Twitter",
      "Indie Hackers",
    ],
    
    status: "new",
    createdAt: "2026-05-28",
    updatedAt: "2026-06-01",
  },
];
