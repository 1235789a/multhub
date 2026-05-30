// ============================================================
// 🎯 USE CASES — 使用场景数据库（Single Source of Truth）
// ============================================================
//
// 🤖 给"另一个智能体"的填表说明
// ------------------------------------------------------------
// 使用场景数据库用于 GEO（生成式搜索引擎优化），
// 帮助 AI Agent 理解"什么工具适合什么人"。
//
// 字段约束 & 联动效果
// ------------------------------------------------------------
// id              string         必填   场景唯一标识符（小写英文 + 连字符）
// scenario        Object         必填   场景名称（中英双语）
// userTypes       Object         必填   用户类型列表（中英双语）
// problems        Object         必填   遇到的问题列表（中英双语）
// solutions       Object         必填   解决方案描述（中英双语）
// recommendedProducts  string[]  必填   推荐产品 slug 列表
// keywords        string[]       必填   场景关键词（用于生成 URL）
// relatedUseCases string[]       可选   相关场景 id 列表
//
// 自动联动效果
// ------------------------------------------------------------
// • /geo/[id]     ：自动生成使用场景详情页
// • sitemap.xml   ：自动包含所有使用场景页面
// • FAQ Schema    ：自动关联相关问答
//
// 填表示例
// ------------------------------------------------------------
// {
//   id: "student-research",
//   scenario: {
//     en: "Student Research & Writing",
//     zh: "学生研究与写作"
//   },
//   userTypes: {
//     en: ["University students", "Graduate students"],
//     zh: ["大学生", "研究生"]
//   },
//   problems: {
//     en: ["Organizing research materials is difficult"],
//     zh: ["整理研究资料困难"]
//   },
//   solutions: {
//     en: "Use MarkItDown to convert research papers...",
//     zh: "使用 MarkItDown 将研究论文转换为..."
//   },
//   recommendedProducts: ["markitdown-lite"],
//   keywords: ["ai research tools", "paper summarization"]
// }
// ============================================================

export interface UseCase {
  /** 场景唯一标识符 */
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
      en: [
        "University students",
        "Graduate students",
        "Academic researchers",
        "PhD candidates"
      ],
      zh: [
        "大学生",
        "研究生",
        "学术研究人员",
        "博士候选人"
      ]
    },
    problems: {
      en: [
        "Struggling to organize large amounts of research materials",
        "Difficulty in summarizing long academic papers",
        "Time-consuming literature review process",
        "Hard to extract key information from PDFs",
        "Challenge in creating citations and references"
      ],
      zh: [
        "整理大量研究资料困难",
        "难以总结长篇学术论文",
        "文献综述过程耗时",
        "从 PDF 中提取关键信息困难",
        "创建引用和参考文献困难"
      ]
    },
    solutions: {
      en: "Use MarkItDown to convert research papers into clean, semantic Markdown format. This makes it easy to take notes, create summaries, and build a knowledge base for your research. The de-identification feature also helps protect sensitive research data.",
      zh: "使用 MarkItDown 将研究论文转换为干净、语义化的 Markdown 格式。这使得做笔记、创建摘要和建立知识库变得容易。脱敏功能还可以帮助保护敏感的研究数据。"
    },
    recommendedProducts: ["markitdown-lite"],
    keywords: [
      "ai research tools for students",
      "paper summarization ai",
      "research workflow automation",
      "literature review tools",
      "academic paper converter",
      "best ai tools for graduate students"
    ],
    relatedUseCases: ["job-seeker-resume", "content-creation"]
  },
  {
    id: "job-seeker-resume",
    scenario: {
      en: "Job Seeker Resume Optimization",
      zh: "求职者简历优化"
    },
    userTypes: {
      en: [
        "Job seekers",
        "Career changers",
        "Recent graduates",
        "Professionals seeking promotion",
        "Remote workers"
      ],
      zh: [
        "求职者",
        "职业转换者",
        "应届毕业生",
        "寻求晋升的专业人士",
        "远程工作者"
      ]
    },
    problems: {
      en: [
        "Unclear how to highlight achievements effectively",
        "ATS (Applicant Tracking Systems) filter out resumes automatically",
        "Difficulty in quantifying accomplishments with metrics",
        "Using generic templates that don't stand out",
        "Not knowing what keywords to include for specific jobs"
      ],
      zh: [
        "不知道如何有效突出成就",
        "ATS（申请人跟踪系统）自动过滤简历",
        "难以用指标量化成就",
        "使用不突出的通用模板",
        "不知道为特定职位包含哪些关键词"
      ]
    },
    solutions: {
      en: "Use ResumePro to generate ATS-optimized resumes with AI-powered content optimization. The tool helps you highlight achievements with quantified metrics, choose professional templates, and ensure your resume passes automated screening while impressing human recruiters.",
      zh: "使用 ResumePro 生成带 AI 内容优化的 ATS 优化简历。该工具帮助您用量化指标突出成就，选择专业模板，并确保您的简历通过自动筛选，同时给人工招聘人员留下深刻印象。"
    },
    recommendedProducts: ["resumepro"],
    keywords: [
      "ai resume builder",
      "ats resume optimization",
      "job application tools",
      "professional resume templates",
      "best resume builder ai",
      "resume keywords for ats"
    ],
    relatedUseCases: ["student-research"]
  },
  {
    id: "cross-border-import",
    scenario: {
      en: "Cross-Border E-commerce Import",
      zh: "跨境电商进口"
    },
    userTypes: {
      en: [
        "E-commerce sellers",
        "Import businesses",
        "Dropshippers",
        "Small business owners",
        "Individual importers"
      ],
      zh: [
        "电商卖家",
        "进口商家",
        "一件代发商",
        "小型企业主",
        "个人进口商"
      ]
    },
    problems: {
      en: [
        "Unclear about complex import tariff calculations",
        "Difficult to determine correct HS codes for products",
        "Unexpected additional costs and fees",
        "Time-consuming manual research on customs regulations",
        "Challenge in pricing products competitively"
      ],
      zh: [
        "对复杂的进口关税计算不清晰",
        "难以确定产品的正确 HS 编码",
        "意外的附加成本和费用",
        "手动调研海关法规耗时",
        "难以有竞争力地定价产品"
      ]
    },
    solutions: {
      en: "Use Tariff Lens to instantly calculate import duties, VAT, anti-dumping fees, and other taxes for international shipments. Simply enter your product description or HS code, and get accurate cost estimates based on current customs databases. This helps you price products competitively and avoid surprises.",
      zh: "使用关税透镜即时计算国际运输的进口关税、增值税、反倾销税和其他税费。只需输入产品描述或 HS 编码，即可根据当前海关数据库获得准确的成本估算。这帮助您有竞争力地定价产品并避免意外。"
    },
    recommendedProducts: ["tariff-lens"],
    keywords: [
      "import duty calculator",
      "hs code lookup tool",
      "cross-border shipping costs",
      "international trade tools",
      "customs duty estimation",
      "import tax calculator"
    ],
    relatedUseCases: ["freelance-productivity"]
  },
  {
    id: "content-creation",
    scenario: {
      en: "Content Creation & Publishing",
      zh: "内容创作与发布"
    },
    userTypes: {
      en: [
        "Content creators",
        "Bloggers",
        "YouTubers",
        "Social media managers",
        "Digital marketers"
      ],
      zh: [
        "内容创作者",
        "博主",
        "YouTuber",
        "社交媒体经理",
        "数字营销人员"
      ]
    },
    problems: {
      en: [
        "Time-consuming content creation process",
        "Difficulty in converting presentations to blog posts",
        "Challenge in repurposing content across platforms",
        "Managing large volumes of documents and assets",
        "Maintaining consistency in content quality"
      ],
      zh: [
        "内容创作过程耗时",
        "难以将演示文稿转换为博客文章",
        "难以跨平台重新利用内容",
        "管理大量文档和资产",
        "保持内容质量的一致性"
      ]
    },
    solutions: {
      en: "Use MarkItDown to quickly convert PDF presentations and documents into clean Markdown that can be easily repurposed for blogs, social media, or newsletters. This saves hours of manual work and ensures your content reaches wider audiences across multiple platforms.",
      zh: "使用 MarkItDown 快速将 PDF 演示文稿和文档转换为干净的 Markdown，可以轻松重新用于博客、社交媒体或新闻简报。这节省了数小时的手动工作，并确保您的内容通过多个平台触达更广泛的受众。"
    },
    recommendedProducts: ["markitdown-lite"],
    keywords: [
      "content creation tools",
      "document to blog converter",
      "repurpose content ai",
      "presentation to article",
      "best ai tools for content creators"
    ]
  },
  {
    id: "freelance-productivity",
    scenario: {
      en: "Freelance & Remote Work Productivity",
      zh: "自由职业与远程工作效率"
    },
    userTypes: {
      en: [
        "Freelancers",
        "Remote workers",
        "Digital nomads",
        "Gig economy workers",
        "Consultants"
      ],
      zh: [
        "自由职业者",
        "远程工作者",
        "数字游民",
        "零工经济工作者",
        "顾问"
      ]
    },
    problems: {
      en: [
        "Managing multiple clients and projects efficiently",
        "Creating professional documents quickly",
        "Calculating international project costs",
        "Difficulty in demonstrating value to clients",
        "Time tracking and billing complexity"
      ],
      zh: [
        "有效地管理多个客户和项目",
        "快速创建专业文档",
        "计算国际项目成本",
        "难以向客户展示价值",
        "时间跟踪和计费复杂性"
      ]
    },
    solutions: {
      en: "Leverage AI tools to automate document creation, calculate cross-border service costs, and create impressive client presentations. Tools like Tariff Lens help freelancers price international services accurately, while MarkItDown enables quick document conversion for proposals and reports.",
      zh: "利用 AI 工具自动创建文档、计算跨境服务成本，并创建令人印象深刻的客户演示。关税透镜等工具帮助自由职业者准确地为国际服务定价，而 MarkItDown 可以快速转换提案和报告的文档。"
    },
    recommendedProducts: ["tariff-lens", "markitdown-lite", "resumepro"],
    keywords: [
      "freelance productivity tools",
      "remote work automation",
      "ai tools for freelancers",
      "international project pricing",
      "client document templates"
    ]
  }
];
