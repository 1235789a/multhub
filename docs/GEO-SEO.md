# GEO/SEO 增强配置文档

## 概述

本网站已按照 GEO（生成式引擎优化）最佳实践完成 SEO 增强配置。本文档记录所有改动和配置说明。

---

## 1. 核心改动文件清单

| 文件路径 | 功能描述 |
|---------|---------|
| `src/app/sitemap.ts` | 自动生成 `sitemap.xml` |
| `src/app/robots.ts` | 爬虫访问规则配置 |
| `src/app/layout.tsx` | 全站 metadata 和 JSON-LD |
| `src/app/components/seo/OrganizationJsonLd.tsx` | 组织结构化数据 |
| `src/app/components/seo/WebsiteJsonLd.tsx` | 网站结构化数据 |
| `src/app/components/seo/ProductJsonLd.tsx` | 产品结构化数据 |
| `src/app/components/seo/ArticleJsonLd.tsx` | 博客文章结构化数据 |
| `src/app/store/[slug]/page.tsx` | 产品详情页增强 |
| `src/app/log/[slug]/page.tsx` | 博客详情页增强 |
| `docs/GEO-SEO.md` | 本文档 |

---

## 2. sitemap.xml 配置

**文件**：`src/app/sitemap.ts`

### 包含的页面

- **首页** `/` - Priority: 1.0
- **工具超市** `/store` - Priority: 0.9
- **博客列表** `/log` - Priority: 0.8
- **更新日志** `/changelog` - Priority: 0.7
- **所有产品详情页** `/store/[slug]` - Priority: 0.8
- **所有博客文章** `/log/[slug]` - Priority: 0.6
- **应用页** `/apps/tariff-lens` - Priority: 0.7

### 更新频率

| 页面类型 | 更新频率 |
|---------|---------|
| 首页/工具超市 | weekly |
| 产品详情页 | weekly |
| 博客列表 | weekly |
| 博客文章 | monthly |
| 更新日志 | monthly |

---

## 3. robots.txt 配置

**文件**：`src/app/robots.ts`

### 允许/禁止规则

```txt
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /checkout/

User-Agent: GPTBot
Allow: /
Disallow: /api/
Disallow: /checkout/

User-Agent: ChatGPT-User
Allow: /
Disallow: /api/
Disallow: /checkout/

User-Agent: ClaudeBot
Allow: /
Disallow: /api/
Disallow: /checkout/

User-Agent: Google-Extended
Allow: /
Disallow: /api/
Disallow: /checkout/

Sitemap: https://multhub.top/sitemap.xml
```

### AI 爬虫支持

| 爬虫名称 | 说明 | 支持状态 |
|---------|------|---------|
| `GPTBot` | OpenAI 爬虫 | ✅ 支持 |
| `ChatGPT-User` | ChatGPT 用户访问 | ✅ 支持 |
| `ClaudeBot` | Anthropic 爬虫 | ✅ 支持 |
| `Google-Extended` | Google AI 扩展访问 | ✅ 支持 |

---

## 4. Metadata 配置增强

**文件**：`src/app/layout.tsx`

### 核心字段

| 字段 | 值 |
|-----|-----|
| `metadataBase` | `https://multhub.top` |
| `title.template` | `%s \| 蜕羽 / Silent Harvest` |
| `alternates.languages` | `en` / `zh` |
| `openGraph.locale` | `en_US` |
| `openGraph.alternateLocale` | `zh_CN` |
| `openGraph.type` | `website` |
| `twitter.card` | `summary_large_image` |

### 验证 Meta 标签（待配置）

| 搜索引擎 | 标签名 | 占位符 |
|---------|-------|-------|
| Google | `google-site-verification` | `google-site-verification` |
| Yandex | `yandex-verification` | `yandex-verification` |
| Bing | `msvalidate.01` | `msvalidate-token` |

**后续操作**：请替换这些占位符为实际的验证 token。

---

## 5. JSON-LD 结构化数据

### OrganizationJsonLd

位于所有页面，包含：
- 组织名称
- 网址
- Logo
- 描述
- 多语言支持

### WebsiteJsonLd

位于所有页面，包含：
- 网站名称
- 搜索功能入口
- 网址

### ProductJsonLd

位于产品详情页，包含：
- 产品名称（双语）
- 价格（USDT）
- 状态（available/beta/coming soon）
- 功能描述
- 版本号
- URL

### ArticleJsonLd

位于博客详情页，包含：
- 文章标题（双语）
- 发布日期
- 作者
- 标签
- 描述
- URL

---

## 6. GEO 最佳实践实施要点

### ✅ 已完成

1. **语义化内容**：所有页面都有清晰的语义描述
2. **结构化数据**：完整的 JSON-LD 实现
3. **多语言支持**：en/zh 双语配置
4. **AI 爬虫友好**：robots.txt 显式允许 AI 爬虫
5. **sitemap.xml**：自动生成所有有效页面
6. **canonical URLs**：避免重复内容权重分散
7. **清晰的 URL 结构**：`/store/[slug]`、`/log/[slug]`

### 📋 GEO 注意事项

| 方面 | 建议 |
|-----|------|
| **内容质量** | 保持内容真实、有价值，避免生成式 AI 过度使用低质量内容 |
| **事实标注** | 关键事实应结构化，便于 AI 引用 |
| **权威来源** | 构建品牌语义权威，作为内容可信来源 |
| **更新频率** | 定期更新内容，增强 AI 搜索引擎中的权重 |
| **内容实体** | 清晰定义产品、服务等实体 |

---

## 7. 验证工具

| 工具 | 用途 | 链接 |
|-----|------|------|
| Google Rich Results Test | 检查结构化数据 | https://search.google.com/test/rich-results |
| Schema.org Validator | 验证 JSON-LD | https://validator.schema.org/ |
| Twitter Card Validator | 检查社交媒体元数据 | https://cards-dev.twitter.com/validator |
| Google Search Console | 提交 sitemap 和监控 | https://search.google.com/search-console |
| Bing Webmaster Tools | 提交 sitemap 给 Bing | https://www.bing.com/webmasters |

---

## 8. 后续工作

### 🔄 近期（1-2周）

- [ ] 替换各搜索引擎验证 token
- [ ] 添加真实的 OG 图片（非 favicon 占位）
- [ ] 测试实际部署的 sitemap/robots.txt 可访问性

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

## 9. 本地测试

### 本地查看 sitemap 和 robots

```bash
# 启动开发服务器
npm run dev

# 访问
http://localhost:3000/sitemap.xml
http://localhost:3000/robots.txt
```

### 构建测试

```bash
npm run build
```

---

**文档版本**：v1.0  
**最后更新**：2026-05-26
