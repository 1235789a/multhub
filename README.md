# Multhub

> AI Tool Marketplace + Opportunity Engine for Web3 and Beyond

一个基于 Next.js 16 + Cloudflare Workers 的 AI 工具市场平台，集成了工具销售、AI 机会引擎、GEO 内容系统和 USDT 链上支付闭环。

---

## 目录

- [项目定位](#项目定位)
- [核心产品](#核心产品)
- [技术架构](#技术架构)
- [核心模块](#核心模块)
- [支付与授权系统](#支付与授权系统)
- [GEO 内容引擎](#geo-内容引擎)
- [部署](#部署)
- [本地开发](#本地开发)
- [环境变量](#环境变量)
- [项目结构](#项目结构)

---

## 项目定位

**Multhub** 是一个面向 Web3 / 加密社区的 AI 工具市场 + 机会引擎。

### 核心能力

1. **工具销售闭环** — 展示产品 → 免费试用 → USDT 支付 → 自动授权
2. **AI 机会引擎** — 自动发现高价值产品机会，6 维度评分
3. **GEO 内容系统** — 自动生成 SEO 内容矩阵（FAQ / UseCase / Comparison / CaseStudy）
4. **多产品矩阵** — 内容工具、生图工具、运营工具、发布工具

### 设计理念

- **无账号系统** — 基于浏览器指纹 + Firestore 授权，用户零注册成本
- **链上支付** — USDT/TRC20 直接收款，无中间支付平台抽成
- **Workflows 优先** — 每个工具都预设工作流模板，降低用户使用门槛
- **Prompt-only 降级** — 图片类工具无 API Key 时仍可生成 prompt/方案

---

## 核心产品

### 🚀 Web3 Content Factory

> AI content tools for small Web3 projects

为小型 Web3 项目生成可直接发布的内容。

**功能：**
- 7 种内容类型：X 帖子、Telegram 公告、Launch Thread、Meme Prompt、置顶消息、社区互动帖、Threadstorm
- 自动适配平台调性（X / Telegram / Discord）
- 内置合规规则，避免虚假承诺和金融误导
- 一次买断，100 次生成额度

**价格：** 9 USDT / 3 次免费试用

**访问路径：** `/apps/web3-content-factory`

---

### 🎨 Web3 Promo Image Factory

> Workflow-based visual prompt generator for Web3 launches

基于工作流的视觉 prompt 生成器，为 Web3 产品生成宣传视觉方案。

**功能：**
- 5 个工作流模板：
  - **Web3 Launch Poster** — Launch 海报 prompt 和视觉方向
  - **Telegram Bot Promo** — Telegram 机器人宣传视觉方案
  - **AI Agent Launch Visual** — AI Agent 未来感发布视觉
  - **Crypto Dashboard Promo** — 加密仪表盘宣传图
  - **Meme Visual Concept** — Meme 视觉概念（无虚假金融承诺）
- 每次生成包含：Image Prompt、Negative Prompt、Visual Brief、Headline、Caption、Layout Tips、Variants
- 本地保存最近 10 次生成记录
- 可选图片 Provider 支持（OpenAI-compatible API）
- Prompt-only 模式：无图片 API Key 时仍可正常使用

**价格：** 9 USDT / 3 次免费试用

**访问路径：** `/apps/web3-promo-image-factory`

---

### 🤝 Partnership Announcement Generator

> Generate professional Web3 partnership announcements in minutes

几分钟内生成专业的 Web3 合作官宣内容。

**功能：**
- 多平台版本一键生成：X / Telegram / Discord / Medium
- 符合真实 Web3 项目合作公告风格
- 支持自定义项目信息、合作类型、语气
- 自动生成 announcement art prompt

**价格：** 4 USDT / 3 次免费试用

**访问路径：** `/apps/partnership-announcement-generator`

---

### 🛃 Tariff Lens (Roadmap)

> Natural language → HS code tariff estimate

自然语言输入 → HS 编码关税估算。

**功能：**
- 自然语言 → HS Code 推理
- 起征点 · FOB/CIF 自动判断
- 反倾销 · 301 条款标记
- 汇率自动换算

**状态：** Roadmap 中

**访问路径：** `/apps/tariff-lens`

---

## 技术架构

### 技术栈

```
框架层:      Next.js 16.1.1 (App Router)
语言层:      TypeScript 5.x
样式层:      Tailwind CSS 3.4
动画:        Framer Motion
数据库:      Firebase Firestore
认证:        Firebase Auth + jose (JWT)
支付:        USDT / TRC20 (链上验证)
指纹识别:    FingerprintJS
SEO:         Schema.org + JSON-LD
部署平台:    Cloudflare Workers
构建工具:    Turbopack + OpenNext
```

### 架构特点

- **全 Edge 运行** — 部署在 Cloudflare Workers，全球边缘节点加速
- **RSC 优先** — 尽可能使用 React Server Components，减少客户端 JS
- **无服务器** — 无长期运行的服务器，按请求计费
- **Node.js Compat** — 通过 `nodejs_compat` 兼容标志支持部分 Node API

---

## 核心模块

### 文字 AI Provider

**文件：** `src/lib/ai/text-provider.ts`

统一的文字模型配置层，支持 fallback 链：

```
TEXT_API_KEY → PARTNERSHIP_API_KEY → IMAGE_API_KEY
```

**读取优先级：**
1. `TEXT_API_KEY`（推荐）
2. `PARTNERSHIP_API_KEY`（兼容旧配置）
3. `IMAGE_API_KEY`（最后兜底）

**支持的配置：**
- `TEXT_PROVIDER` — Provider 类型（默认 `openai_compatible`）
- `TEXT_API_BASE_URL` — API 地址（默认 `https://api.deepseek.com`）
- `TEXT_MODEL` — 模型名称（默认 `deepseek-chat`）

### 图片 AI Provider

**文件：** `src/lib/ai/image-provider.ts`

独立的图片生成配置，**仅**在 `image-provider.ts` 中使用：

- `IMAGE_PROVIDER` — `prompt_only` / `openai_compatible`
- `IMAGE_API_KEY` — 图片 API Key
- `IMAGE_API_BASE_URL` — 图片 API 地址
- `IMAGE_MODEL` — 图片模型名称

**降级策略：**
- `IMAGE_PROVIDER=prompt_only` → 直接返回，不调用图片 API
- `IMAGE_API_KEY` 未配置 → 降级为 `prompt_only`
- API 调用失败 → 捕获错误，仍返回 prompt/visual brief，不中断主流程

### 试用管理

**文件：** `src/lib/trialManager.ts`

- 基于浏览器指纹（FingerprintJS）识别匿名用户
- 每个产品独立的试用配额
- 试用记录存储在 Firestore
- 购买后自动升级为正式授权

### 授权验证

**文件：** `src/lib/entitlement.ts`

- 验证用户是否有权使用某个产品
- 支持试用配额和正式授权两种模式
- Firebase Auth JWT 校验（`jose` 库，Edge 兼容）

### Firestore 客户端

**文件：** `src/lib/firestore-client.ts`

- 基于 REST API 的 Firestore 客户端
- 兼容 Cloudflare Workers 环境
- 支持文档读写、查询、事务

---

## 支付与授权系统

### USDT / TRC20 支付

**流程：**
1. 用户选择产品 → 进入 `/checkout/[slug]`
2. 生成唯一订单号 → 展示 USDT 收款地址 + 金额
3. 用户转账 → 点击「我已支付」
4. 后端调用 TRC20 区块浏览器 API 验证交易
5. 验证通过 → 写入 Firestore 授权记录 → 解锁功能

**验证接口：** `/api/verify-trc20`

**安全特性：**
- 交易哈希唯一性校验，防止重放攻击
- 金额精确匹配校验（含小数点精度处理）
- 收款地址白名单校验
- 交易确认数检查

### 收款地址配置

- **Web3 Content Factory:** 独立地址
- **Web3 Promo Image Factory:** `TWiDbdetRhXF3cnMHciM1EK8AjTPKHMjJF`
- **Partnership Announcement Generator:** 独立地址
- **Tariff Lens:** 独立地址

统一管理在 `src/app/data/products.ts` 的 `priceUSDT` 字段。

---

## GEO 内容引擎

### GEO (Generative Engine Optimization)

自动生成结构化 SEO 内容矩阵，提升搜索引擎可见度。

### 内容类型

| 类型 | 路径 | 说明 |
|------|------|------|
| UseCase | `/geo/[usecase]` | 使用场景详情页 |
| FAQ | `/geo/faq/[slug]` | 常见问题详情页 |
| Comparison | `/geo/comparison/[slug]` | 产品对比页 |
| CaseStudy | `/geo/case-study/[slug]` | 案例研究页 |

### 结构化数据

每个 GEO 页面自动注入 Schema.org 结构化数据：
- `FAQPage` — FAQ 页面
- `Article` — 案例研究
- `Product` — 产品页面
- `Organization` — 组织信息
- `WebSite` — 站点信息

### 数据文件

- `src/app/data/usecases.ts` — 使用场景数据
- `src/app/data/questions.ts` — FAQ 数据
- `src/app/data/comparisons.ts` — 对比数据
- `src/app/data/case-studies.ts` — 案例数据

---

## 部署

### Cloudflare Workers 部署

项目使用 OpenNext 将 Next.js 构建为 Cloudflare Workers 兼容格式。

```bash
# 构建
npm run cf-build

# 预览
npm run preview

# 部署
npm run deploy
```

### Cloudflare Secrets（敏感信息）

必须通过 `wrangler secret put` 设置，**不要写入 wrangler.jsonc**：

```bash
npx wrangler secret put FIREBASE_PRIVATE_KEY
npx wrangler secret put TEXT_API_KEY
npx wrangler secret put IMAGE_API_KEY
npx wrangler secret put PARTNERSHIP_API_KEY   # 可选，兼容旧配置
```

### Cloudflare Vars（非敏感配置）

在 `wrangler.jsonc` 的 `vars` 中配置：

| 变量 | 说明 |
|------|------|
| `FIREBASE_PROJECT_ID` | Firebase 项目 ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin 客户端邮箱 |
| `TEXT_PROVIDER` | 文字 AI Provider（默认 `openai_compatible`） |
| `TEXT_API_BASE_URL` | 文字 AI API 地址 |
| `TEXT_MODEL` | 文字 AI 模型名称 |
| `IMAGE_PROVIDER` | 图片 AI Provider（默认 `prompt_only`） |
| `IMAGE_API_BASE_URL` | 图片 AI API 地址 |
| `IMAGE_MODEL` | 图片 AI 模型名称 |
| `USDT_RECEIVE_ADDRESS` | 统一收款地址（如有） |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL |

---

## 本地开发

### 前置要求

- Node.js 18+
- npm / pnpm / yarn

### 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量
cp .env.example .env.local

# 3. 编辑 .env.local，填入必要的配置
# （至少需要 FIREBASE_* 和 TEXT_API_KEY）

# 4. 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint 检查
npm run cf-build     # Cloudflare Workers 构建
npm run deploy       # 部署到 Cloudflare
npm run preview      # Cloudflare 预览
```

---

## 环境变量

完整列表见 [`.env.example`](.env.example)。

### 必填

```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
TEXT_API_KEY=
```

### 可选

```
# 文字 AI 配置
TEXT_PROVIDER=openai_compatible
TEXT_API_BASE_URL=https://api.deepseek.com
TEXT_MODEL=deepseek-chat

# 图片 AI 配置（可选，不配置则为 prompt-only 模式）
IMAGE_PROVIDER=prompt_only
IMAGE_API_KEY=
IMAGE_API_BASE_URL=https://api.openai.com/v1
IMAGE_MODEL=

# 旧兼容（不推荐新部署使用）
PARTNERSHIP_API_KEY=

# 站点
NEXT_PUBLIC_SITE_URL=
USDT_RECEIVE_ADDRESS=
```

---

## 项目结构

```
/workspace/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── page.tsx                      # 首页
│   │   ├── layout.tsx                    # 根布局
│   │   ├── globals.css                   # 全局样式
│   │   │
│   │   ├── apps/                         # 工具应用页面
│   │   │   ├── web3-content-factory/     # Web3 内容工厂
│   │   │   ├── web3-promo-image-factory/ # Web3 宣传图工厂
│   │   │   ├── partnership-announcement-generator/ # 合作官宣生成器
│   │   │   └── tariff-lens/              # 关税透镜
│   │   │
│   │   ├── api/                          # API 路由
│   │   │   ├── web3-content-factory/generate/
│   │   │   ├── web3-promo-image-factory/generate/
│   │   │   ├── partnership-announcement-generator/generate/
│   │   │   ├── tariff-lens/estimate/
│   │   │   └── verify-trc20/             # TRC20 支付验证
│   │   │
│   │   ├── checkout/[slug]/              # 结算页面
│   │   ├── store/                        # 工具商店
│   │   │   ├── page.tsx                  # 商店列表
│   │   │   └── [slug]/                   # 产品详情
│   │   │
│   │   ├── geo/                          # GEO 内容页面
│   │   │   ├── [usecase]/
│   │   │   ├── faq/[slug]/
│   │   │   ├── comparison/[slug]/
│   │   │   └── case-study/[slug]/
│   │   │
│   │   ├── log/                          # 博客/更新日志
│   │   ├── changelog/                    # 产品路线图
│   │   │
│   │   ├── components/                   # 共享组件
│   │   │   └── seo/                      # SEO 组件（JSON-LD 等）
│   │   │
│   │   ├── data/                         # 数据文件
│   │   │   ├── products.ts               # 产品数据（Single Source of Truth）
│   │   │   ├── usecases.ts
│   │   │   ├── questions.ts
│   │   │   ├── comparisons.ts
│   │   │   └── case-studies.ts
│   │   │
│   │   ├── i18n/                         # 国际化
│   │   ├── sitemap.ts                    # 站点地图
│   │   └── robots.ts                     # robots.txt
│   │
│   ├── lib/                              # 核心服务层
│   │   ├── ai/
│   │   │   └── text-provider.ts          # 统一文字 AI 配置
│   │   ├── web3-promo-image-factory/
│   │   │   ├── image-provider.ts         # 图片 AI Provider
│   │   │   ├── workflows.ts              # 工作流模板
│   │   │   └── llm.ts                    # LLM 调用
│   │   ├── web3-content-factory/
│   │   │   └── llm.ts
│   │   ├── partnership-announcement/
│   │   │   └── llm.ts
│   │   ├── tariff/
│   │   │   └── llm.ts
│   │   ├── firebase-auth.ts              # Firebase 认证
│   │   ├── firestore-client.ts           # Firestore 客户端
│   │   ├── trialManager.ts               # 试用管理
│   │   └── entitlement.ts                # 授权验证
│   │
│   └── intel/                            # AI 机会引擎（内部）
│       ├── data/
│       │   ├── opportunities.ts          # 机会数据模型
│       │   └── scoring-rules.ts          # 评分规则
│       └── services/
│           ├── product-creator.ts        # 产品创建器
│           └── geo-generator.ts          # GEO 内容生成器
│
├── docs/                                 # 项目文档
├── scripts/                              # 工具脚本
├── public/                               # 静态资源
│
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── open-next.config.ts                   # OpenNext 配置
├── wrangler.jsonc                        # Cloudflare Workers 配置
└── .env.example                          # 环境变量示例
```

---

## 产品数据驱动

全站产品信息由 `src/app/data/products.ts` 统一管理（Single Source of Truth）。

新增一个产品只需往 `PRODUCTS` 数组里加一个对象，以下页面会自动更新：

- 首页「工具超市」
- `/store` — 商店列表
- `/store/[slug]` — 产品详情页
- `/checkout/[slug]` — 结算页
- `/changelog` — 路线图（按 status 分组）
- `sitemap.xml` — 站点地图

---

## 安全与合规

- **无真实 API Key 提交** — 所有敏感密钥通过 Cloudflare Secrets 管理
- **Key Masking** — 错误信息中只展示 key 前 4 位 + 后 4 位
- **Firebase JWT 验证** — 使用 `jose` 库在 Edge 环境验证 token
- **TRC20 重放攻击防护** — 交易哈希唯一索引
- **合规文案** — 所有金融相关工具附带免责声明
- **内容合规** — LLM 系统提示内置合规规则，禁止虚假承诺

---

## License

MIT
