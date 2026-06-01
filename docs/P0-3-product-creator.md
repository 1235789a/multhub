# P0-3: 创建产品创建服务

**日期**: 2026-06-01  
**状态**: ✅ 完成  
**文件**: [`src/intel/services/product-creator.ts`](file:///workspace/src/intel/services/product-creator.ts)

---

## 概述

创建了从 Opportunity 生成 Product 的工具服务，包含代码片段生成、状态管理和验证功能。

---

## 核心功能

### `createProductFromOpportunity(opp)`

将 Opportunity 转换为 Product 对象，自动填充所有字段：

- 基本信息：name, slug, icon, version
- 价格：priceBase, priceDisplay, priceUSDT
- 功能：features
- 状态：status, eta, progress
- 试用：trialConfig
- GEO 字段：tagline, description, targetUsers, painPoints, keywords, tags, useCases, pricingDetails, paymentMethods

### `printProductCode(opp)`

输出可复制的代码片段，方便手动添加到 [`products.ts`](file:///workspace/src/app/data/products.ts) 中。

### `createProductAndUpdateOpportunity(opp, decisionNote?)`

完整流程：
1. 创建 Product
2. 生成代码片段
3. 更新 Opportunity 状态为 "building"
4. 记录决策时间和备注

### `markOpportunityAsShipped(opp, productSlug)`

当产品发布时，更新 Opportunity 状态为 "shipped"。

### `markOpportunityAsDead(opp, reason)`

放弃某个机会，记录原因。

### `validateProductCreation(opp)`

验证是否适合创建产品，检查：
- Opportunity 状态应为 "new" 或 "validating"
- 总分应 ≥70
- 符合 solo-buildable、2-week MVP、USDT acceptable、global sales 等条件

---

## 工作流程

```
发现 Opportunity (new)
    ↓
验证 (score ≥70)
    ↓
人工决策：approve/reject
    ↓ (approve)
createProductAndUpdateOpportunity()
    ↓
Opportunity 状态变为 building
    ↓
开发产品
    ↓
发布产品
    ↓
markOpportunityAsShipped()
    ↓
Opportunity 状态变为 shipped
```

---

## 代码片段示例

使用 ResumePro 机会生成代码片段：

```typescript
{
  name: {
    "en": "ResumePro",
    "zh": "ResumePro - AI 简历生成器"
  },
  slug: "resumepro",
  icon: "📋",
  version: "v0.1",
  priceBase: 4,
  priceDisplay: "4 USDT",
  priceUSDT: 4,
  features: {
    "en": [
      "ATS 优化简历生成",
      "成就量化建议",
      "关键词推荐",
      "专业模板",
      "一次付费，多次使用"
    ],
    "zh": [
      "ATS 优化简历生成",
      "成就量化建议",
      "关键词推荐",
      "专业模板",
      "一次付费，多次使用"
    ]
  },
  status: "available",
  eta: undefined,
  progress: 100,
  launchPath: undefined,
  trialConfig: { "allowed": true, "maxUses": 3 },
  tagline: {
    "en": "AI 简历生成器 - ATS 优化",
    "zh": "AI 简历生成器 - ATS 优化"
  },
  description: {
    "en": "AI 驱动的简历生成器，自动优化 ATS 通过，量化成就",
    "zh": "AI 驱动的简历生成器，自动优化 ATS 通过，量化成就"
  },
  keywords: [
    "ats resume builder",
    "ai resume generator",
    "resume optimization",
    "job search tools"
  ]
}
```

---

## 文件位置

- 产品创建服务: [`src/intel/services/product-creator.ts`](file:///workspace/src/intel/services/product-creator.ts)
- 数据模型: [`src/intel/data/opportunities.ts`](file:///workspace/src/intel/data/opportunities.ts)
- 评分规则: [`src/intel/data/scoring-rules.ts`](file:///workspace/src/intel/data/scoring-rules.ts)
- 产品数据: [`src/app/data/products.ts`](file:///workspace/src/app/data/products.ts)

---

## 下一步

1. ✅ 创建 opportunities.ts
2. ✅ 创建 scoring-rules.ts
3. ✅ 创建 product-creator.ts (当前)
4. ⏭️ 创建 geo-generator.ts (GEO内容生成服务)
5. ⏭️ 重构首页，聚焦 3秒转化

---
