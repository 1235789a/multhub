# P0-2: 创建评分规则定义

**日期**: 2026-06-01  
**状态**: ✅ 完成  
**文件**: [`src/intel/data/scoring-rules.ts`](file:///workspace/src/intel/data/scoring-rules.ts)

---

## 概述

创建了 6 维度评分系统的详细规则定义，包含每个维度的评分标准和证据要求。

---

## 评分系统概览

| 维度 | 权重 | 说明 |
|------|------|------|
| `painFrequency` | 25分 | 痛点频率（最重要） |
| `usdtCompatibility` | 20分 | USDT兼容性 |
| `impulseBuyPotential` | 15分 | 冲动购买潜力 |
| `soloBuildability` | 15分 | 独立开发难度 |
| `distributionEase` | 15分 | 分发难度 |
| `geoPotential` | 10分 | GEO潜力 |
| **总分** | **100分** | |

---

## 详细评分规则

### 1. Pain Frequency (25分) - 痛点频率

| 分数段 | 描述 | 证据要求 |
|--------|------|----------|
| 20-25分 | 每天/每周出现，有强烈情绪表达，大量讨论 | Reddit等平台高频讨论、明确的"我需要这个工具"表达、高赞高回复的讨论串 |
| 14-19分 | 每周出现，影响工作效率，有持续讨论 | 多个独立讨论串、用户分享自己的临时解决方案 |
| 8-13分 | 偶尔出现，但很痛苦，有一定讨论量 | 有一些讨论、用户表示希望有更好的工具 |
| 0-7分 | 低频痛点，竞争激烈，用户付费意愿低 | - |

### 2. USDT Compatibility (20分) - USDT兼容性

| 分数段 | 描述 | 证据要求 |
|--------|------|----------|
| 17-20分 | AI、SEO、Crypto、开发者、Indie Hacker等群体 | 目标用户是技术从业者、活跃在 Reddit/X/Twitter/Indie Hackers、经常使用在线工具和软件 |
| 12-16分 | 内容创作者、自由职业者、小型团队 | 用户需要高效工具、可能使用付费订阅服务 |
| 6-11分 | 普通消费者、非技术用户 | 需要教育用户使用加密支付、可能需要额外的支付选项 |
| 0-5分 | 传统企业、大型组织（不适合） | - |

### 3. Impulse Buy Potential (15分) - 冲动购买潜力

| 分数段 | 描述 | 证据要求 |
|--------|------|----------|
| 12-15分 | 单次付费 < $10，可立即解决明确问题，一次付费永久使用 | 可立即验证价值、问题清晰解决方案明确、用户愿意为节省时间付费 |
| 8-11分 | 单次付费 $10-$30，有明确ROI，一次付费多次使用 | 可以量化节省的时间或金钱、用户会多次使用工具 |
| 4-7分 | 单次付费 $30-$100，需要教育，决策周期较长 | 需要演示或试用、可能需要考虑一段时间 |
| 0-3分 | 需要订阅或复杂定价，企业购买流程 | - |

### 4. Solo Buildability (15分) - 独立开发难度

| 分数段 | 描述 | 证据要求 |
|--------|------|----------|
| 12-15分 | 1周内可完成，有现成API/库，单一核心功能 | 核心功能单一明确、有可复用的API或库、不需要复杂的后端架构 |
| 8-11分 | 1-2周可完成，需要一些集成，MVP范围清晰 | 需要2-3个核心功能、可能需要一些外部集成、范围可控 |
| 4-7分 | 2-4周可完成，需要多个集成，一定复杂度 | 复杂度中等、需要多个外部服务集成 |
| 0-3分 | >1个月，需要后端+前端+运维，复杂度高 | - |

### 5. Distribution Ease (15分) - 分发难度

| 分数段 | 描述 | 证据要求 |
|--------|------|----------|
| 12-15分 | 明确的Subreddit + 明确的X/Twitter社区，天然流量渠道 | 有现成的活跃社区、可以直接在相关subreddit发帖、有明确的X/Twitter话题和KOL |
| 8-11分 | 明确的社区或明确的社交渠道之一 | 至少有一个主要流量渠道、Product Hunt可以获得初期流量 |
| 4-7分 | 主要依靠SEO/GEO自然流量，冷启动较慢 | 有明确的搜索需求、可以通过GEO内容获得流量 |
| 0-3分 | 冷启动困难，需要付费推广，目标用户分散 | - |

### 6. GEO Potential (10分) - GEO潜力

| 分数段 | 描述 | 证据要求 |
|--------|------|----------|
| 8-10分 | >15个长尾问题可以扩展，涵盖FAQ/UseCase/Comparison/CaseStudy | 大量'How to'问题、多个竞品可以比较、有明确的使用场景 |
| 5-7分 | 10-15个内容可扩展 | 有一些FAQ和UseCase可以写、有2-3个竞品可以比较 |
| 2-4分 | 5-10个内容可扩展 | 内容有限，但仍可以写一些 |
| 0-1分 | <5个内容，关键词竞争激烈，红海市场 | - |

---

## 工具函数

### `calculateTotalScore(score)`

计算总分，自动汇总 6 个维度的分数。

### `validateScore(score)`

验证分数是否合法，检查每个维度是否在范围内，以及总分是否正确。

### `getScoreLevel(score)`

将分数转换为等级：

| 分数 | 等级 |
|------|------|
| ≥85 | `excellent`（优秀） |
| ≥70 | `good`（良好） |
| ≥50 | `fair`（一般） |
| <50 | `poor`（较差） |

---

## 示例评分

### MarkItDown (93/100) - excellent

```
painFrequency:        22/25
usdtCompatibility:    20/20
impulseBuyPotential:  14/15
soloBuildability:     15/15
distributionEase:     13/15
geoPotential:         9/10
Total:                93/100
```

### ResumePro (90/100) - excellent

```
painFrequency:        24/25
usdtCompatibility:    18/20
impulseBuyPotential:  13/15
soloBuildability:     14/15
distributionEase:     12/15
geoPotential:         9/10
Total:                90/100
```

### Reddit Trend Monitor (85/100) - excellent

```
painFrequency:        20/25
usdtCompatibility:    18/20
impulseBuyPotential:  12/15
soloBuildability:     13/15
distributionEase:     14/15
geoPotential:         8/10
Total:                85/100
```

---

## 文件位置

- 评分规则: [`src/intel/data/scoring-rules.ts`](file:///workspace/src/intel/data/scoring-rules.ts)
- 数据模型: [`src/intel/data/opportunities.ts`](file:///workspace/src/intel/data/opportunities.ts)

---

## 下一步

1. ✅ 创建 opportunities.ts
2. ✅ 创建 scoring-rules.ts (当前)
3. ⏭️ 创建 product-creator.ts (产品创建服务)
4. ⏭️ 创建 geo-generator.ts (GEO内容生成服务)
5. ⏭️ 重构首页，聚焦 3秒转化

---
