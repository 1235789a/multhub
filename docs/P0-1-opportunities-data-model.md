# P0-1: 创建 Opportunity 数据模型

**日期**: 2026-06-01  
**状态**: ✅ 完成  
**文件**: [`src/intel/data/opportunities.ts`](file:///workspace/src/intel/data/opportunities.ts)

---

## 概述

创建了 Internal Layer 的核心数据模型，用于管理产品机会和评分系统。

---

## 数据模型定义

### 1. OpportunityStatus (机会状态)

```typescript
export type OpportunityStatus =
  | "new"           // 新发现
  | "validating"    // 验证中
  | "building"      // 开发中
  | "shipped"       // 已发布
  | "dead";         // 已放弃
```

### 2. OpportunityScore (评分系统 - 100分)

| 维度 | 权重 | 说明 |
|------|------|------|
| `painFrequency` | 25分 | 痛点频率 - 目标用户中出现的频繁程度 |
| `usdtCompatibility` | 20分 | USDT兼容性 - 用户是否天然接受加密支付 |
| `impulseBuyPotential` | 15分 | 冲动购买潜力 - 适合 $4/$9/$19 冲动消费 |
| `soloBuildability` | 15分 | 独立开发难度 - 1-2周能否完成 MVP |
| `distributionEase` | 15分 | 分发难度 - Reddit/X/PH 能否触达 |
| `geoPotential` | 10分 | GEO潜力 - 有多少长尾问题可扩展 |
| **`total`** | **100分** | 自动计算 |

### 3. 核心接口

```typescript
interface Opportunity {
  id: string;
  title: string;
  pain: string;
  targetNiche: string;
  
  source: OpportunitySource;       // 来源信息
  score: OpportunityScore;         // 评分
  productFit: ProductFit;          // 产品筛选检查
  productIdea: ProductIdea;        // 产品方案
  geoExpansion: GeoExpansionPlan;  // GEO扩展计划
  
  seoKeywords: string[];
  trafficChannels: string[];
  
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
  
  decidedAt?: string;
  decision?: OpportunityDecision;
  decisionNote?: string;
  
  contentGenerated?: boolean;
  generatedContent?: GeneratedContent;
}
```

---

## 示例数据

### opp-001: MarkItDown (已发布)

- **评分**: 93/100
- **状态**: `shipped`
- **产品**: MarkItDown - PDF/PPT 转语义 Markdown
- **GEO 页面**: 16 个 (6 FAQ + 5 UseCase + 3 Comparison + 2 CaseStudy)

### opp-002: ResumePro (新发现)

- **评分**: 90/100
- **状态**: `new`
- **产品**: ResumePro - AI 简历生成器，ATS 优化
- **GEO 页面**: 17 个

### opp-003: Reddit Trend Monitor (新发现)

- **评分**: 85/100
- **状态**: `new`
- **产品**: Reddit 趋势监测器 - 发现产品机会
- **GEO 页面**: 16 个

---

## 完整飞轮流程

```
发现机会 → 评分 ≥ 70分 → 人工决策 → 生成 Product → 生成 GEO内容矩阵
→ 发布到 External Layer → SEO/GEO流量 → 试用 → USDT付款 → 形成案例
```

---

## 文件位置

- 数据文件: [`src/intel/data/opportunities.ts`](file:///workspace/src/intel/data/opportunities.ts)
- Internal Layer: `src/intel/` (完全隐藏，不对外公开)

---

## 下一步

1. ✅ 创建 opportunities.ts (当前)
2. ⏭️ 创建 scoring-rules.ts (评分规则详细定义)
3. ⏭️ 创建 product-creator.ts (产品创建服务)
4. ⏭️ 创建 geo-generator.ts (GEO内容生成服务)
5. ⏭️ 重构首页，聚焦 3秒转化

---
