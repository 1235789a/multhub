# GEO/SEO 增强配置文档

## 概述

本网站已按照 GEO（生成式引擎优化）最佳实践完成配置，基于《GEO白皮书》核心框架实施。

---

## 核心框架

### 1. E-E-A-T 原则

| 维度 | 说明 | 实现方式 |
|-----|------|---------|
| **Experience（经验）** | 内容是否基于真实体验 | 所有产品描述基于实际功能 |
| **Expertise（专业性）** | 创作者是否具备专业知识 | 明确作者和发布者身份 |
| **Authoritativeness（权威性）** | 内容或平台是否是权威来源 | Organization JSON-LD |
| **Trustworthiness（可信赖性）** | 内容是否准确可靠 | 结构化数据、交叉验证 |

### 2. E-R-E 框架（Entity, Relationship, Evidence）

| 维度 | 说明 | 实现方式 |
|-----|------|---------|
| **Entity（实体）** | 成为 AI 世界观中的已知项 | Organization/Product JSON-LD |
| **Relationship（关系）** | 编织上下文与权威之网 | hasOfferCatalog, isPartOf |
| **Evidence（证据）** | 构建算法信任的基石 | knowsAbout, about |

### 3. 两大核心 + 四轮驱动

**两大核心：**
- 人性化 GEO：以用户为中心的内容策略
- 内容交叉验证：确保信息准确性和可信赖性

**四轮驱动：**
- E-E-A-T
- 结构化内容
- SEO 关键词
- 精准引用

---

## 核心改动文件清单

| 文件路径 | 功能描述 |
|---------|---------|
| `src/app/sitemap.ts` | 自动生成 `sitemap.xml` |
| `src/app/robots.ts` | 爬虫访问规则配置（含 AI 爬虫） |
| `src/app/llms.txt` | AI 平台内容清单 |
| `src/app/layout.tsx` | 全站 metadata 和 JSON-LD |
| `src/app/components/seo/OrganizationJsonLd.tsx` | 组织结构化数据（E-R-E 框架） |
| `src/app/components/seo/WebsiteJsonLd.tsx` | 网站结构化数据 |
| `src/app/components/seo/ProductJsonLd.tsx` | 产品结构化数据（E-R-E 框架） |
| `src/app/components/seo/ArticleJsonLd.tsx` | 博客文章结构化数据（E-R-E 框架） |
| `src/app/components/seo/AIMetaTags.tsx` | AI 平台特定 meta 标签 |
| `src/app/store/[slug]/page.tsx` | 产品详情页增强 |
| `src/app/log/[slug]/page.tsx` | 博客详情页增强 |
| `docs/GEO-SEO.md` | 本文档 |

---

## 1. sitemap.xml 配置

**文件**：`src/app/sitemap.ts`

### 包含的页面

| 路径 | 类型 | Priority | 更新频率 |
|------|------|----------|----------|
| `/` | 首页 | 1.0 | weekly |
| `/store` | 工具超市 | 0.9 | weekly |
| `/log` | 博客列表 | 0.8 | weekly |
| `/changelog` | 更新日志 | 0.7 | monthly |
| `/store/[slug]` | 产品详情 | 0.8 | weekly |
| `/log/[slug]` | 博客文章 | 0.6 | monthly |
| `/apps/tariff-lens` | Tariff Lens | 0.7 | monthly |

---

## 2. robots.txt 配置

**文件**：`src/app/robots.ts`

### AI 爬虫支持

| 爬虫名称 | 说明 | 支持状态 |
|---------|------|---------|
| `GPTBot` | OpenAI 爬虫 | ✅ 支持 |
| `ChatGPT-User` | ChatGPT 用户访问 | ✅ 支持 |
| `ClaudeBot` | Anthropic 爬虫 | ✅ 支持 |
| `Google-Extended` | Google AI 扩展访问 | ✅ 支持 |

### 禁止爬取

```txt
Disallow: /api/
Disallow: /checkout/
```

---

## 3. llms.txt 配置

**文件**：`src/app/llms.txt`

### 用途

llms.txt 是 AI 平台专用的内容清单文件，帮助 AI 系统：
- 理解网站的核心业务
- 识别品牌和实体
- 获取结构化的内容概览

### 内容结构

- 品牌介绍和价值主张
- 产品/服务列表
- 技术架构说明
- 博客内容分类
- 联系方式

---

## 4. Metadata 配置增强

**文件**：`src/app/layout.tsx`

### E-E-A-T 相关字段

| 字段 | 值 |
|-----|-----|
| `authors` | 蜕羽（包含 url） |
| `creator` | 蜕羽 |
| `publisher` | 蜕羽 |
| `category` | Software |
| `classification` | Business Tools |

### OpenGraph 增强

| 字段 | 值 |
|-----|-----|
| `siteName` | 蜕羽 / Silent Harvest |
| `locale` | en_US |
| `alternateLocale` | zh_CN |
| `email` | contact@multhub.top |
| `seeAlso` | GitHub 仓库链接 |

### Apple Web App

```typescript
appleWebApp: {
  capable: true,
  title: "蜕羽 / Silent Harvest",
  statusBarStyle: "black-translucent",
}
```

---

## 5. JSON-LD 结构化数据

### OrganizationJsonLd（E-R-E 框架）

**文件**：`src/app/components/seo/OrganizationJsonLd.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "蜕羽 / Silent Harvest",
  "alternateName": ["蜕羽", "Silent Harvest"],
  "foundingDate": "2025-01-01",
  "knowsAbout": ["Automation Tools", "SaaS", "Monetization", ...],
  "hasOfferCatalog": {...},
  "areaServed": "Worldwide"
}
```

### ProductJsonLd（E-R-E 框架）

**文件**：`src/app/components/seo/ProductJsonLd.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "brand": {...},
  "manufacturer": {...},
  "knowsAbout": [...],
  "isBasedOn": "https://multhub.top"
}
```

### ArticleJsonLd（E-R-E 框架）

**文件**：`src/app/components/seo/ArticleJsonLd.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "about": [...],
  "mainEntityOfPage": {...},
  "isPartOf": {...},
  "inLanguage": "en-US"
}
```

---

## 6. AI 平台特定 Meta 标签

**文件**：`src/app/components/seo/AIMetaTags.tsx`

| Meta 标签 | 平台 | 用途 |
|----------|------|------|
| `ai-content-generation` | 通用 | 内容生成标识 |
| `ai-tool-category` | 通用 | AI 工具分类 |
| `ai-platform-compatible` | 通用 | 兼容的 AI 平台 |
| `perplexity-allow` | Perplexity | 允许 AI 引用并注明来源 |
| `claude-usage` | Claude | 内容可被 Claude 引用 |
| `gemini-disclaimer` | Gemini | 已验证的信息来源 |

---

## 7. GEO 最佳实践检查清单

### ✅ 已完成

| 检查项 | 状态 |
|-------|------|
| 语义化内容 | ✅ |
| 结构化数据（JSON-LD） | ✅ |
| 多语言支持（en/zh） | ✅ |
| AI 爬虫友好（robots.txt） | ✅ |
| llms.txt | ✅ |
| canonical URLs | ✅ |
| E-E-A-T 信号 | ✅ |
| E-R-E 框架 | ✅ |
| AI 平台特定 meta 标签 | ✅ |

### 📋 待完成

| 检查项 | 状态 | 备注 |
|-------|------|------|
| 搜索引擎验证 | ❌ | 需要手动添加 token |
| 真实 OG 图片 | ❌ | 目前使用 favicon 占位 |
| 内容更新频率 | 🔄 | 需建立更新机制 |

---

## 8. 验证工具

| 工具 | 用途 | 链接 |
|-----|------|------|
| Google Rich Results Test | 检查结构化数据 | https://search.google.com/test/rich-results |
| Schema.org Validator | 验证 JSON-LD | https://validator.schema.org/ |
| Twitter Card Validator | 检查社交媒体元数据 | https://cards-dev.twitter.com/validator |
| Google Search Console | 提交 sitemap 和监控 | https://search.google.com/search-console |
| Bing Webmaster Tools | 提交 sitemap 给 Bing | https://www.bing.com/webmasters |

---

## 9. 后续工作

### 🔄 近期（1-2周）

- [ ] 替换各搜索引擎验证 token
- [ ] 添加真实的 OG 图片（非 favicon 占位）
- [ ] 测试实际部署的 sitemap/robots.txt/llms.txt 可访问性

### 📅 中期（1-2月）

- [ ] 配置 Google Search Console
- [ ] 配置 Bing Webmaster Tools
- [ ] 添加更多 SEO 指标监控
- [ ] 优化内容的 AI 可读性

### 🎯 长期

- [ ] 基于真实数据调整 SEO/GEO 策略
- [ ] 建立内容更新和发布规范
- [ ] 跟踪 AI 引用情况

---

## 10. 本地测试

### 查看生成的 sitemap, robots, llms

```bash
# 启动开发服务器
npm run dev

# 访问
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
http://localhost:3000/llms.txt
```

### 构建测试

```bash
npm run build
```

---

## 11. GEO 白皮书核心参考

基于以下 GEO 框架实施：

### E-E-A-T 原则
- **Experience**：真实体验和第一手经验
- **Expertise**：专业知识和技能
- **Authoritativeness**：权威性和影响力
- **Trustworthiness**：可信度和透明度

### E-R-E 框架
- **Entity**：品牌和产品作为 AI 可识别的实体
- **Relationship**：建立实体间的关系网络
- **Evidence**：提供可验证的事实和证据

### 两大核心
- 人性化 GEO
- 内容交叉验证

### 四轮驱动
- E-E-A-T
- 结构化内容
- SEO 关键词
- 精准引用

---

**文档版本**：v1.1
**最后更新**：2026-05-26
**基于**：GEO白皮书核心框架
