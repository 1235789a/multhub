# GEO 数据资产构建计划

## 背景分析

当前网站已有完整的 SEO 基础设施：
- ✅ Schema.org 结构化数据（Website、Organization、Product、Article）
- ✅ robots.txt 配置
- ✅ Metadata 配置
- ✅ sitemap.xml 自动生成

**核心问题**：这些基础设施是"壳"，真正给 AI 引用的内容来自数据本身。

用户提出的 GEO（生成式搜索引擎优化）策略需要5个数据资产：
1. 产品数据库
2. 使用场景数据库
3. 案例库
4. 对比数据库
5. 关键词数据库

## 设计原则

- **不破坏现有代码**：所有改动都是扩展，不修改现有接口和数据结构
- **单一数据源**：每个数据文件都是独立的 Single Source of Truth
- **TypeScript 类型安全**：完整的接口定义
- **中英双语支持**：所有文本字段都支持 en/zh
- **SEO 友好**：数据结构支持自动生成 JSON-LD 和 FAQ Schema

## 实施步骤

### 第一步：扩展产品数据库（扩展 products.ts）

**目标**：增强现有 Product 接口，添加 GEO 必需字段

**新增字段**：
```typescript
interface Product {
  // === 现有字段（保持不变）===
  name: { en: string; zh: string };
  slug: string;
  icon: string;
  version: string;
  priceBase: number;
  priceDisplay: string;
  priceUSDT?: number;
  features: { en: string[]; zh: string[] };
  status?: ProductStatus;
  eta?: string;
  progress?: number;
  launchPath?: string;
  trialConfig?: { allowed: boolean; maxUses: number };
  
  // === 新增 GEO 字段（全部可选，保持向后兼容）===
  
  /** 一句话介绍（中英双语） */
  tagline?: { en: string; zh: string };
  
  /** 详细介绍（中英双语） */
  description?: { en: string; zh: string };
  
  /** 目标用户列表（中英双语） */
  targetUsers?: { en: string[]; zh: string[] };
  
  /** 解决什么问题列表（中英双语） */
  painPoints?: { en: string[]; zh: string[] };
  
  /** 关键词列表（用于 GEO） */
  keywords?: string[];
  
  /** 标签列表 */
  tags?: string[];
  
  /** 价格（中英双语） */
  pricing?: {
    amount: number;
    currency: string;
    pricingDetails?: { en: string; zh: string };
  };
  
  /** 支付方式 */
  paymentMethods?: string[];
  
  /** 使用案例列表（中英双语） */
  useCases?: { en: string[]; zh: string[] };
  
  /** 相关产品 slug 列表 */
  relatedProducts?: string[];
}
```

**示例数据**：
```typescript
{
  name: { en: "Tariff Lens", zh: "关税透镜" },
  slug: "tariff-lens",
  tagline: {
    en: "Intelligent cross-border tariff estimation tool",
    zh: "智能跨境关税预估工具"
  },
  targetUsers: {
    en: ["E-commerce sellers", "Freight forwarders", "Small business owners"],
    zh: ["电商卖家", "货运代理", "小型企业主"]
  },
  painPoints: {
    en: [
      "Confused by complex tariff regulations",
      "Hard to calculate import costs accurately",
      "Time-consuming manual research"
    ],
    zh: [
      "复杂的关税法规让人困惑",
      "难以准确计算进口成本",
      "手动调研耗时耗力"
    ]
  },
  keywords: [
    "tariff calculator",
    "import duty estimator",
    "HS code lookup",
    "customs duty calculator"
  ],
  tags: ["tariff", "import", "customs", "e-commerce"],
  pricing: {
    amount: 4,
    currency: "USDT",
    pricingDetails: {
      en: "4 USDT for 100 uses, lifetime access",
      zh: "4 USDT，100次使用，永久有效"
    }
  },
  paymentMethods: ["USDT (TRC20)", "Crypto"],
  useCases: {
    en: [
      "Calculate import costs for cross-border shipping",
      "Determine HS codes for products"
    ],
    zh: [
      "计算跨境运输的进口成本",
      "确定产品的HS编码"
    ]
  },
  relatedProducts: ["resumepro", "markitdown-lite"]
}
```

### 第二步：创建使用场景数据库（新建 usecases.ts）

**文件位置**：`/workspace/src/app/data/usecases.ts`

**接口定义**：
```typescript
export interface UseCase {
  id: string;
  /** 场景名称（中英双语） */
  scenario: { en: string; zh: string };
  /** 用户类型列表 */
  userTypes: { en: string[]; zh: string[] };
  /** 遇到的问题列表 */
  problems: { en: string[]; zh: string[] };
  /** 解决方案描述 */
  solutions: { en: string; zh: string };
  /** 推荐产品 slug 列表 */
  recommendedProducts: string[];
  /** 场景关键词（用于生成 URL） */
  keywords: string[];
  /** 相关场景 id 列表 */
  relatedUseCases?: string[];
}

export const USE_CASES: UseCase[] = [
  {
    id: "student-research",
    scenario: {
      en: "Student Research & Writing",
      zh: "学生研究与写作"
    },
    userTypes: {
      en: ["University students", "Graduate students", "Researchers"],
      zh: ["大学生", "研究生", "研究人员"]
    },
    problems: {
      en: [
        "Struggling to organize research materials",
        "Difficulty in summarizing long papers",
        "Time-consuming literature review"
      ],
      zh: [
        "整理研究资料困难",
        "难以总结长篇论文",
        "文献综述耗时"
      ]
    },
    solutions: {
      en: "Use MarkItDown to convert research papers into clean Markdown for easy note-taking and RAG systems.",
      zh: "使用 MarkItDown 将研究论文转换为干净的 Markdown，方便做笔记和接入 RAG 系统。"
    },
    recommendedProducts: ["markitdown-lite"],
    keywords: [
      "ai research tools for students",
      "paper summarization ai",
      "research workflow automation",
      "literature review tools"
    ]
  },
  {
    id: "job-seeker-resume",
    scenario: {
      en: "Job Seeker Resume Optimization",
      zh: "求职者简历优化"
    },
    userTypes: {
      en: ["Job seekers", "Career changers", "Recent graduates"],
      zh: ["求职者", "职业转换者", "应届毕业生"]
    },
    problems: {
      en: [
        "Unclear how to highlight achievements",
        "ATS systems filter out resumes",
        "Difficulty in quantifying accomplishments"
      ],
      zh: [
        "不知道如何突出成就",
        "ATS 系统过滤掉简历",
        "难以量化工作成就"
      ]
    },
    solutions: {
      en: "Use ResumePro to generate ATS-optimized resumes with professional templates and AI-powered content optimization.",
      zh: "使用 ResumePro 生成 ATS 优化的简历，提供专业模板和 AI 内容优化。"
    },
    recommendedProducts: ["resumepro"],
    keywords: [
      "ai resume builder",
      "ats resume optimization",
      "job application tools",
      "professional resume templates"
    ]
  },
  {
    id: "cross-border-import",
    scenario: {
      en: "Cross-Border E-commerce Import",
      zh: "跨境电商进口"
    },
    userTypes: {
      en: ["E-commerce sellers", "Import businesses", "Dropshippers"],
      zh: ["电商卖家", "进口商家", "一件代发商"]
    },
    problems: {
      en: [
        "Unclear about import tariff calculations",
        "Difficult to determine HS codes",
        "Unexpected additional costs"
      ],
      zh: [
        "进口关税计算不清晰",
        "难以确定 HS 编码",
        "意外的附加成本"
      ]
    },
    solutions: {
      en: "Use Tariff Lens to instantly calculate import duties, VAT, and other taxes for international shipments.",
      zh: "使用 Tariff Lens 即时计算国际运输的进口关税、增值税和其他税费。"
    },
    recommendedProducts: ["tariff-lens"],
    keywords: [
      "import duty calculator",
      "hs code lookup tool",
      "cross-border shipping costs",
      "international trade tools"
    ]
  }
];
```

### 第三步：创建案例库（新建 case-studies.ts）

**文件位置**：`/workspace/src/app/data/case-studies.ts`

**接口定义**：
```typescript
export interface CaseStudy {
  id: string;
  /** 案例标题（中英双语） */
  title: { en: string; zh: string };
  /** 使用的产品 slug 列表 */
  products: string[];
  /** 使用前状态描述 */
  before: { en: string; zh: string };
  /** 使用后状态描述 */
  after: { en: string; zh: string };
  /** 时间成本 */
  timeCost?: {
    amount: number;
    unit: string; // "minutes", "hours", "days"
  };
  /** 金钱成本 */
  moneyCost?: {
    amount: number;
    currency: string;
  };
  /** 结果/收益描述 */
  results: { en: string[]; zh: string[] };
  /** 关键数据指标 */
  metrics?: {
    label: { en: string; zh: string };
    value: string;
  }[];
  /** 案例时间 */
  date?: string;
  /** 作者/来源 */
  author?: string;
  /** 案例关键词（用于生成 URL） */
  keywords: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "ai-children-book",
    title: {
      en: "I Made $18 Selling AI-Generated Children's Books in 20 Minutes",
      zh: "20分钟赚了18 USDT：AI生成儿童绘本案例"
    },
    products: ["markitdown-lite"],
    before: {
      en: "Spent hours creating children's book content manually, high production cost.",
      zh: "手动创作儿童绘本内容，耗时数小时，生产成本高。"
    },
    after: {
      en: "Used AI to generate story content, created illustrated PDF in 20 minutes.",
      zh: "使用 AI 生成故事内容，20分钟内创建了带插图的 PDF。"
    },
    timeCost: {
      amount: 20,
      unit: "minutes"
    },
    moneyCost: {
      amount: 3,
      currency: "USDT"
    },
    results: {
      en: [
        "Sold 2 copies at $9 USDT each",
        "Total revenue: 18 USDT",
        "Profit margin: 83%"
      ],
      zh: [
        "售出2份，每份9 USDT",
        "总收入：18 USDT",
        "利润率：83%"
      ]
    },
    metrics: [
      { label: { en: "Time", zh: "时间" }, value: "20 min" },
      { label: { en: "Cost", zh: "成本" }, value: "3 USDT" },
      { label: { en: "Revenue", zh: "收入" }, value: "18 USDT" },
      { label: { en: "Profit", zh: "利润" }, value: "15 USDT" }
    ],
    date: "2025-04-15",
    author: "Silent Harvest",
    keywords: [
      "ai generated children's books",
      "sell ai content",
      "passive income ai tools",
      "make money with ai"
    ]
  },
  {
    id: "import-cost-savings",
    title: {
      en: "How I Saved $500 on a Single Shipment with Tariff Lens",
      zh: "用关税透镜一单省了500美元"
    },
    products: ["tariff-lens"],
    before: {
      en: "Imported goods without understanding tariff costs, ended up with unexpected expenses.",
      zh: "进口商品时不了解关税成本，最终产生意外费用。"
    },
    after: {
      en: "Used Tariff Lens to calculate all costs upfront, negotiated better shipping terms.",
      zh: "使用关税透镜提前计算所有成本，谈判获得更好的运输条款。"
    },
    moneyCost: {
      amount: 4,
      currency: "USDT"
    },
    results: {
      en: [
        "Avoided $500 in unexpected tariffs",
        "Negotiated 15% lower shipping cost",
        "Total savings: $620"
      ],
      zh: [
        "避免了500美元的意外关税",
        "谈判降低了15%的运输成本",
        "总节省：620美元"
      ]
    },
    metrics: [
      { label: { en: "Cost", zh: "成本" }, value: "4 USDT" },
      { label: { en: "Savings", zh: "节省" }, value: "$620" },
      { label: { en: "ROI", zh: "投资回报率" }, value: "15,500%" }
    ],
    date: "2025-03-20",
    author: "Silent Harvest",
    keywords: [
      "import cost savings",
      "tariff calculation",
      "cross-border ecommerce tips",
      "shipping cost reduction"
    ]
  }
];
```

### 第四步：创建对比数据库（新建 comparisons.ts）

**文件位置**：`/workspace/src/app/data/comparisons.ts`

**接口定义**：
```typescript
export interface Comparison {
  id: string;
  /** 对比标题 */
  title: { en: string; zh: string };
  /** 产品A slug */
  productA: string;
  /** 产品B slug */
  productB: string;
  /** 价格对比 */
  pricing: {
    productA: string;
    productB: string;
  };
  /** 优点对比 */
  pros: {
    productA: { en: string[]; zh: string[] };
    productB: { en: string[]; zh: string[] };
  };
  /** 缺点对比 */
  cons: {
    productA: { en: string[]; zh: string[] };
    productB: { en: string[]; zh: string[] };
  };
  /** 适合人群 */
  bestFor: {
    productA: { en: string[]; zh: string[] };
    productB: { en: string[]; zh: string[] };
  };
  /** 对比类型 */
  comparisonType: "vs" | "alternative" | "best";
  /** 相关关键词 */
  keywords: string[];
}

export const COMPARISONS: Comparison[] = [
  {
    id: "markitdown-vs-traditional",
    title: {
      en: "MarkItDown vs Traditional PDF Converters",
      zh: "MarkItDown vs 传统 PDF 转换器"
    },
    productA: "markitdown-lite",
    productB: "traditional-converters",
    pricing: {
      productA: "3 USDT (lifetime)",
      productB: "$10-30/month (subscription)"
    },
    pros: {
      productA: {
        en: [
          "One-time payment, lifetime access",
          "Built-in de-identification",
          "RAG-friendly output",
          "Table structure preserved"
        ],
        zh: [
          "一次付款，永久使用",
          "内置脱敏功能",
          "RAG 友好输出",
          "保留表格结构"
        ]
      },
      productB: {
        en: [
          "Wider file format support",
          "More editing features",
          "Cloud storage integration"
        ],
        zh: [
          "支持更多文件格式",
          "更多编辑功能",
          "云存储集成"
        ]
      }
    },
    cons: {
      productA: {
        en: [
          "PDF and PPT only",
          "No real-time collaboration"
        ],
        zh: [
          "仅支持 PDF 和 PPT",
          "无实时协作"
        ]
      },
      productB: {
        en: [
          "Subscription model",
          "May not preserve table structure",
          "No de-identification"
        ],
        zh: [
          "订阅模式",
          "可能不保留表格结构",
          "无脱敏功能"
        ]
      }
    },
    bestFor: {
      productA: {
        en: [
          "Researchers and academics",
          "RAG system builders",
          "Content creators"
        ],
        zh: [
          "研究人员和学者",
          "RAG 系统构建者",
          "内容创作者"
        ]
      },
      productB: {
        en: [
          "Enterprise teams",
          "Users needing editing features",
          "Those with cloud storage needs"
        ],
        zh: [
          "企业团队",
          "需要编辑功能的用户",
          "有云存储需求的用户"
        ]
      }
    },
    comparisonType: "vs",
    keywords: [
      "best pdf to markdown converter",
      "pdf converter comparison",
      "markitdown alternative",
      "document conversion tools"
    ]
  },
  {
    id: "resumepro-vs-free",
    title: {
      en: "ResumePro vs Free Resume Builders",
      zh: "ResumePro vs 免费简历工具"
    },
    productA: "resumepro",
    productB: "free-resume-builders",
    pricing: {
      productA: "0.5 USDT (lifetime)",
      productB: "Free"
    },
    pros: {
      productA: {
        en: [
          "AI-powered content generation",
          "ATS optimization built-in",
          "Professional templates",
          "One-time payment"
        ],
        zh: [
          "AI 驱动的内容生成",
          "内置 ATS 优化",
          "专业模板",
          "一次付款"
        ]
      },
      productB: {
        en: [
          "Completely free",
          "No account required",
          "Basic templates available"
        ],
        zh: [
          "完全免费",
          "无需注册",
          "提供基础模板"
        ]
      }
    },
    cons: {
      productA: {
        en: ["Requires small payment"],
        zh: ["需要小额付款"]
      },
      productB: {
        en: [
          "No AI optimization",
          "Generic templates",
          "May not be ATS-friendly",
          "Ads and watermarks"
        ],
        zh: [
          "无 AI 优化",
          "通用模板",
          "可能不符合 ATS",
          "广告和水印"
        ]
      }
    },
    bestFor: {
      productA: {
        en: [
          "Serious job seekers",
          "Career changers",
          "Those rejected by ATS before"
        ],
        zh: [
          "认真求职的人",
          "职业转换者",
          "之前被 ATS 拒绝的人"
        ]
      },
      productB: {
        en: [
          "Casual job searching",
          "Very tight budget",
          "Simple resume needs"
        ],
        zh: [
          "随意找工作",
          "预算非常紧张",
          "简单的简历需求"
        ]
      }
    },
    comparisonType: "vs",
    keywords: [
      "best ai resume builder",
      "free resume builders",
      "ats resume tools",
      "resume builder comparison"
    ]
  }
];
```

### 第五步：创建关键词/问题数据库（新建 questions.ts）

**文件位置**：`/workspace/src/app/data/questions.ts`

**接口定义**：
```typescript
export interface Question {
  id: string;
  /** 问题（中英双语） */
  question: { en: string; zh: string };
  /** 答案（中英双语） */
  answer: { en: string; zh: string };
  /** 相关产品 slug 列表 */
  relatedProducts: string[];
  /** 相关场景 id 列表 */
  relatedUseCases?: string[];
  /** 相关案例 id 列表 */
  relatedCaseStudies?: string[];
  /** 问题类型 */
  type: "how-to" | "what-is" | "why" | "comparison" | "best";
  /** FAQ Schema 格式 */
  faqSchema?: {
    question: string;
    answer: string;
  };
  /** 问题关键词 */
  keywords: string[];
  /** 相关问题 id 列表 */
  relatedQuestions?: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: "how-calculate-import-tariff",
    question: {
      en: "How to calculate import tariffs for cross-border shipping?",
      zh: "如何计算跨境运输的进口关税？"
    },
    answer: {
      en: "Use Tariff Lens to calculate import tariffs instantly. Simply enter your product description or HS code, and the tool will estimate duties, VAT, and other taxes based on current customs databases. This helps you avoid unexpected costs and plan your pricing strategy.",
      zh: "使用关税透镜即时计算进口关税。只需输入产品描述或 HS 编码，该工具将根据当前海关数据库估算关税、增值税和其他税费。这有助于您避免意外成本并规划定价策略。"
    },
    relatedProducts: ["tariff-lens"],
    type: "how-to",
    keywords: [
      "calculate import tariff",
      "cross border shipping costs",
      "hs code lookup",
      "import duty calculator"
    ]
  },
  {
    id: "what-is-ats-resume",
    question: {
      en: "What is ATS and why does it matter for my resume?",
      zh: "什么是 ATS？为什么它对我的简历很重要？"
    },
    answer: {
      en: "ATS (Applicant Tracking System) is software used by employers to screen resumes before they reach human recruiters. Most large companies use ATS to filter out unqualified candidates. A resume that isn't ATS-optimized might never be seen by a real person. ResumePro helps you create resumes that pass ATS screening.",
      zh: "ATS（申请人跟踪系统）是雇主用来在简历到达人工招聘人员之前筛选简历的软件。大多数大公司使用 ATS 来过滤不合格的候选人。不符合 ATS 优化的简历可能永远不会被真人看到。ResumePro 帮助您创建能通过 ATS 筛选的简历。"
    },
    relatedProducts: ["resumepro"],
    type: "what-is",
    keywords: [
      "what is ats resume",
      "applicant tracking system",
      "resume screening",
      "ats optimization"
    ]
  },
  {
    id: "best-pdf-to-markdown",
    question: {
      en: "What is the best PDF to Markdown converter?",
      zh: "最好的 PDF 转 Markdown 工具是什么？"
    },
    answer: {
      en: "MarkItDown is one of the best PDF to Markdown converters, especially for researchers and content creators. Unlike traditional converters, it preserves table structures, includes built-in de-identification, and outputs RAG-friendly content. One-time payment of 3 USDT for lifetime access.",
      zh: "MarkItDown 是最好的 PDF 转 Markdown 工具之一，特别适合研究人员和内容创作者。与传统转换器不同，它保留表格结构，内置脱敏功能，并输出 RAG 友好的内容。一次付款 3 USDT，永久使用。"
    },
    relatedProducts: ["markitdown-lite"],
    type: "best",
    keywords: [
      "best pdf to markdown",
      "pdf converter",
      "document conversion",
      "markdown generator"
    ]
  },
  {
    id: "why-ai-resume",
    question: {
      en: "Why should I use AI to build my resume?",
      zh: "为什么要用 AI 来制作简历？"
    },
    answer: {
      en: "AI resume builders like ResumePro offer several advantages: 1) ATS optimization ensures your resume passes automated screening, 2) Professional language and formatting, 3) Ability to highlight achievements with quantified metrics, 4) Saves time compared to manual writing, 5) Access to industry-specific templates and keywords.",
      zh: "AI 简历构建器（如 ResumePro）有几个优势：1) ATS 优化确保您的简历通过自动筛选，2) 专业的语言和格式，3) 能够用量化指标突出成就，4) 比手动编写节省时间，5) 访问行业特定的模板和关键词。"
    },
    relatedProducts: ["resumepro"],
    type: "why",
    keywords: [
      "ai resume builder benefits",
      "why use ai for resume",
      "ai resume vs manual"
    ]
  },
  {
    id: "how-build-agents",
    question: {
      en: "How to build AI agents for automation?",
      zh: "如何构建 AI 代理实现自动化？"
    },
    answer: {
      en: "Building AI agents requires: 1) Define clear objectives, 2) Choose the right AI model, 3) Design proper prompts and instructions, 4) Implement feedback loops, 5) Test and iterate. Our tools like Tariff Lens and MarkItDown demonstrate practical AI agent implementations for specific use cases.",
      zh: "构建 AI 代理需要：1) 定义明确的目标，2) 选择合适的 AI 模型，3) 设计正确的提示和指令，4) 实现反馈循环，5) 测试和迭代。我们的工具（如关税透镜和 MarkItDown）展示了针对特定用例的实用 AI 代理实现。"
    },
    relatedProducts: ["tariff-lens", "markitdown-lite"],
    type: "how-to",
    keywords: [
      "how to build ai agents",
      "ai automation guide",
      "ai agent development",
      "prompt engineering"
    ]
  }
];
```

### 第六步：创建 SEO 生成组件（新增组件，不修改现有组件）

**文件结构**：
```
src/app/components/seo/
├── GeoContent.tsx          # 新的 GEO 内容组件
├── FaqSchema.tsx          # FAQ Schema 生成器
└── ...existing files...   # 保持不变
```

**FaqSchema.tsx**：
```typescript
import { Question } from "../../data/questions";

interface FaqSchemaProps {
  questions: Question[];
  lang?: "en" | "zh";
}

export default function FaqSchema({ questions, lang = "en" }: FaqSchemaProps) {
  const faqItems = questions.map((q) => ({
    "@type": "Question",
    "name": q.question[lang],
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer[lang],
      "author": {
        "@type": "Organization",
        "name": "蜕羽 / Silent Harvest"
      }
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

**GeoContent.tsx**：
```typescript
import { QUESTIONS } from "../../data/questions";
import { CASE_STUDIES } from "../../data/case-studies";
import { COMPARISONS } from "../../data/comparisons";

interface GeoContentProps {
  type: "faq" | "case-study" | "comparison";
  id?: string;
  lang?: "en" | "zh";
}

export default function GeoContent({ type, id, lang = "en" }: GeoContentProps) {
  if (type === "faq" && id) {
    const question = QUESTIONS.find((q) => q.id === id);
    if (!question) return null;

    return (
      <article className="geo-content geo-faq">
        <h2 className="text-xl font-bold">{question.question[lang]}</h2>
        <div className="mt-4 text-zinc-600">
          <p>{question.answer[lang]}</p>
        </div>
      </article>
    );
  }

  if (type === "case-study" && id) {
    const caseStudy = CASE_STUDIES.find((c) => c.id === id);
    if (!caseStudy) return null;

    return (
      <article className="geo-content geo-case-study">
        <h2 className="text-xl font-bold">{caseStudy.title[lang]}</h2>
        {/* Render case study content */}
      </article>
    );
  }

  if (type === "comparison" && id) {
    const comparison = COMPARISONS.find((c) => c.id === id);
    if (!comparison) return null;

    return (
      <article className="geo-content geo-comparison">
        <h2 className="text-xl font-bold">{comparison.title[lang]}</h2>
        {/* Render comparison content */}
      </article>
    );
  }

  return null;
}
```

### 第七步：创建内容生成页面（新增页面路由，不修改现有页面）

**路由结构**：
```
/geo/
├── /geo/faq/[slug]              # FAQ 详情页
├── /geo/case-study/[slug]       # 案例详情页
├── /geo/comparison/[slug]       # 对比详情页
└── /geo/[usecase]               # 使用场景页
```

**示例页面**：`/workspace/src/app/geo/faq/[slug]/page.tsx`
```typescript
import { notFound } from "next/navigation";
import { QUESTIONS } from "../../../data/questions";
import FaqSchema from "../../../components/seo/FaqSchema";

export async function generateStaticParams() {
  return QUESTIONS.map((q) => ({
    slug: q.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const question = QUESTIONS.find((q) => q.id === params.slug);
  if (!question) return { title: "Not Found" };

  return {
    title: question.question.en,
    description: question.answer.en,
    keywords: question.keywords,
  };
}

export default function FaqPage({ params }: { params: { slug: string } }) {
  const question = QUESTIONS.find((q) => q.id === params.slug);
  if (!question) notFound();

  return (
    <main className="min-h-screen bg-zinc-50">
      <FaqSchema questions={[question]} />
      {/* Render FAQ content */}
    </main>
  );
}
```

### 第八步：更新 sitemap.ts（添加新路由）

在现有的 sitemap.ts 中添加 GEO 页面：
```typescript
import { QUESTIONS } from "./data/questions";
import { CASE_STUDIES } from "./data/case-studies";
import { COMPARISONS } from "./data/comparisons";
import { USE_CASES } from "./data/usecases";

// 在 sitemap() 函数中添加：
const faqPages: MetadataRoute.Sitemap = QUESTIONS.map((q) => ({
  url: `${BASE_URL}/geo/faq/${q.id}`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.6,
}));

const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
  url: `${BASE_URL}/geo/case-study/${c.id}`,
  lastModified: c.date ? new Date(c.date) : new Date(),
  changeFrequency: "yearly",
  priority: 0.7,
}));

const comparisonPages: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
  url: `${BASE_URL}/geo/comparison/${c.id}`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.7,
}));

const useCasePages: MetadataRoute.Sitemap = USE_CASES.map((u) => ({
  url: `${BASE_URL}/geo/${u.id}`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.6,
}));

return [...staticPages, ...productPages, ...blogPages, ...faqPages, ...caseStudyPages, ...comparisonPages, ...useCasePages];
```

### 第九步：更新 robots.ts

在 robots.ts 中添加 GEO 页面规则：
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout/"],
      },
      // ... existing rules
    ],
    sitemap: "https://multhub.top/sitemap.xml",
  };
}
```

## 数据维护策略

### JSON 文件结构

每个数据文件都包含：
1. **TypeScript 接口定义** - 类型安全
2. **常量数据数组** - Single Source of Truth
3. **导出语句** - 供其他组件使用

### 数据更新流程

1. 编辑数据文件（`products.ts`, `usecases.ts` 等）
2. 运行 `npm run build` 验证类型安全
3. 提交并推送到 GitHub
4. Cloudflare Pages 自动部署
5. 新的 GEO 内容页面自动生成

### 自动化内容生成

未来可以添加脚本：
```bash
npm run generate:geo  # 从数据自动生成内容页面
```

## 文件清单

### 新建文件

1. `/workspace/src/app/data/usecases.ts` - 使用场景数据库
2. `/workspace/src/app/data/case-studies.ts` - 案例库
3. `/workspace/src/app/data/comparisons.ts` - 对比数据库
4. `/workspace/src/app/data/questions.ts` - 关键词/问题数据库
5. `/workspace/src/app/components/seo/FaqSchema.tsx` - FAQ Schema 组件
6. `/workspace/src/app/components/seo/GeoContent.tsx` - GEO 内容组件
7. `/workspace/src/app/geo/faq/[slug]/page.tsx` - FAQ 详情页
8. `/workspace/src/app/geo/case-study/[slug]/page.tsx` - 案例详情页
9. `/workspace/src/app/geo/comparison/[slug]/page.tsx` - 对比详情页
10. `/workspace/src/app/geo/[usecase]/page.tsx` - 使用场景页

### 修改文件

1. `/workspace/src/app/data/products.ts` - 添加 GEO 字段
2. `/workspace/src/app/sitemap.ts` - 添加 GEO 页面到 sitemap
3. `/workspace/src/app/robots.ts` - 确保 GEO 页面可被抓取

## 风险评估

### 高风险（需谨慎）

- **sitemap.ts** - 需要添加新路由但不能删除现有路由
- **products.ts** - 添加可选字段，保持向后兼容

### 中风险（需要测试）

- **新页面路由** - 需要确保 generateStaticParams 正确生成
- **SEO 组件** - 确保 JSON-LD 格式正确

### 低风险（容易回滚）

- **新数据文件** - 完全新增，不影响现有功能
- **新组件** - 独立组件，不修改现有组件

## 测试计划

1. **类型检查**：`npm run typecheck`
2. **构建测试**：`npm run build`
3. **功能测试**：
   - 访问 `/geo/faq/how-calculate-import-tariff`
   - 访问 `/geo/case-study/ai-children-book`
   - 访问 `/geo/comparison/markitdown-vs-traditional`
4. **SEO 验证**：
   - 检查 sitemap.xml 包含新页面
   - 验证 FAQPage Schema 正确生成
   - 使用 Google Rich Results Test 验证

## 时间估算

- 第一步（扩展 products.ts）：10 分钟
- 第二步（创建 usecases.ts）：15 分钟
- 第三步（创建 case-studies.ts）：15 分钟
- 第四步（创建 comparisons.ts）：15 分钟
- 第五步（创建 questions.ts）：15 分钟
- 第六步（创建 SEO 组件）：20 分钟
- 第七步（创建页面路由）：30 分钟
- 第八步（更新 sitemap/robots）：10 分钟
- 第九步（测试和验证）：20 分钟

**总计**：约 2.5 小时

## 后续优化

1. **自动内容生成脚本**：根据数据自动生成 Markdown 内容
2. **批量导入工具**：支持从 CSV/JSON 批量导入数据
3. **A/B 测试**：测试不同 GEO 内容的效果
4. **分析集成**：添加 GEO 流量分析

## 成功标准

- ✅ 所有新页面能正常访问
- ✅ FAQ Schema 通过 Google 验证
- ✅ sitemap.xml 包含所有新页面
- ✅ robots.txt 允许爬取 GEO 页面
- ✅ 数据结构支持 AI Agent 引用
- ✅ 不破坏现有功能
