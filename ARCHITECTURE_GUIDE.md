# 🏗️ 蜕羽代码架构与更新指南

> **给后续 AI 开发者的指南**：如何安全、规范地更新博客、产品和前端代码

---

## 📋 目录

1. [项目架构概述](#项目架构概述)
2. [核心原则](#核心原则)
3. [如何更新博客](#如何更新博客)
4. [如何更新产品](#如何更新产品)
5. [如何健康更新前端](#如何健康更新前端)
6. [错误示例与纠正](#错误示例与纠正)
7. [发布检查清单](#发布检查清单)

---

## 🏢 项目架构概述

### 项目结构

```
/workspace/
├── src/
│   ├── app/
│   │   ├── api/                    # API 路由
│   │   │   ├── tariff-lens/estimate/route.ts
│   │   │   └── verify-trc20/route.ts
│   │   ├── apps/                  # 实际应用（工具）
│   │   │   └── tariff-lens/       # 关税透镜应用
│   │   ├── changelog/             # 变更日志
│   │   ├── checkout/[slug]/       # 结账页
│   │   ├── components/            # 可复用组件
│   │   │   └── seo/               # SEO 组件
│   │   ├── data/                  # 数据源（核心！）
│   │   │   ├── products.ts        # 产品数据（单一真相源）
│   │   │   └── blog.ts            # 博客数据
│   │   ├── log/                   # 博客/日志
│   │   │   └── [slug]/
│   │   ├── store/                 # 产品商店
│   │   │   └── [slug]/            # 产品详情（自动路由）
│   │   ├── layout.tsx             # 根布局
│   │   ├── page.tsx               # 首页
│   │   ├── robots.ts              # SEO 配置
│   │   └── sitemap.ts             # SEO 配置
│   └── lib/                       # 工具库
│       ├── firestore-client.ts    # Firestore 封装
│       ├── trialManager.ts        # 试用系统
│       └── firebase-auth.ts
├── docs/                          # 文档
├── package.json
└── tailwind.config.ts
```

### 关键架构文件

| 文件 | 重要性 | 说明 |
|------|--------|------|
| [src/app/data/products.ts](file:///workspace/src/app/data/products.ts) | 🔴 **极高** | 产品唯一真相源，不要改其他地方！ |
| [src/app/layout.tsx](file:///workspace/src/app/layout.tsx) | 🟡 高 | 根布局，谨慎修改 |
| [tailwind.config.ts](file:///workspace/tailwind.config.ts) | 🟡 中 | Tailwind 配置 |
| [src/app/store/[slug]/page.tsx](file:///workspace/src/app/store/[slug]/page.tsx) | 🟢 低 | 自动生成，无需修改 |

---

## 🎯 核心原则（不可违反！）

### 1. 单一数据源原则（Single Source of Truth）

**❌ 错误做法**：
- 在多个文件中定义产品信息
- 创建独立的产品文件夹（如 `src/app/floorplan-ai/`）
- 修改自动生成的路由

**✅ 正确做法**：
- 所有产品数据只在 `src/app/data/products.ts` 中定义
- 所有博客数据只在 `src/app/data/blog.ts` 中定义
- 其他文件从这些数据源读取，不重复定义

### 2. 自动路由原则

**❌ 错误做法**：
- 手动创建 `/store/my-product/page.tsx`
- 手动创建 `/log/my-post/page.tsx`

**✅ 正确做法**：
- 在数据源中添加内容
- 路由由 Next.js 自动生成（`generateStaticParams`）

### 3. 模块化原则

**❌ 错误做法**：
- 在页面组件中写所有逻辑
- 组件超过 300 行不拆分

**✅ 正确做法**：
- 逻辑抽离到 `lib/`
- UI 组件抽离到 `components/`
- 保持单一职责

---

## 📝 如何更新博客

### 步骤 1：了解博客数据结构

查看 [src/app/data/blog.ts](file:///workspace/src/app/data/blog.ts)（如果存在）

```typescript
// 博客文章数据结构示例
interface BlogPost {
  slug: string;              // URL 路径，必填
  title: { en: string; zh: string };  // 标题（双语）
  date: string;              // 日期 YYYY-MM-DD
  excerpt: { en: string; zh: string }; // 摘要
  content: { en: string; zh: string }; // 内容（支持 Markdown）
  tags?: string[];           // 标签
}
```

### 步骤 2：添加新博客文章

```typescript
// 在 src/app/data/blog.ts 中添加新文章
export const BLOG_POSTS: BlogPost[] = [
  // ... 现有文章
  {
    slug: "my-new-post",
    title: {
      en: "My New Blog Post",
      zh: "我的新博客文章"
    },
    date: "2026-05-24",
    excerpt: {
      en: "This is an excerpt...",
      zh: "这是摘要..."
    },
    content: {
      en: "# My New Blog Post\n\nThis is the content...",
      zh: "# 我的新博客文章\n\n这是内容..."
    },
    tags: ["update", "tutorial"]
  }
];
```

### 步骤 3：验证

1. 访问 `/log/` 查看文章列表
2. 访问 `/log/my-new-post` 查看详情
3. 检查双语切换是否正常

### 博客更新检查清单

- [ ] 只修改了 `src/app/data/blog.ts`
- [ ] `slug` 唯一且使用 kebab-case
- [ ] 包含双语内容
- [ ] 日期格式正确（YYYY-MM-DD）
- [ ] 链接可正常访问
- [ ] Markdown 渲染正常

---

## 📦 如何更新产品

### 步骤 1：了解产品数据结构

查看 [src/app/data/products.ts](file:///workspace/src/app/data/products.ts)

```typescript
export interface Product {
  name: { en: string; zh: string };  // 产品名称（双语）
  slug: string;                      // URL 路径，必填，唯一
  icon: string;                      // Emoji 图标
  version: string;                   // 版本号（v0.1, v1.0）
  priceBase: number;                 // 价格（内部用）
  priceDisplay: string;              // 显示价格（"4 USDT" 或 "待定"）
  priceUSDT?: number;                // USDT 价格（可选）
  features: { en: string[]; zh: string[] };  // 功能列表
  status?: ProductStatus;            // 状态：available|beta|forging|roadmap
  eta?: string;                      // 预计上线时间（"Q4 2026"）
  progress?: number;                 // 完成度 0-100
  launchPath?: string;               // 实际应用路径（"/apps/tariff-lens"）
  trialConfig?: { allowed: boolean; maxUses: number };  // 试用配置
}
```

### 步骤 2：添加新产品

**唯一需要修改的文件**: [src/app/data/products.ts](file:///workspace/src/app/data/products.ts)

```typescript
export const PRODUCTS: Product[] = [
  // ... 现有产品

  // 新产品
  {
    name: {
      en: "My Awesome Tool",
      zh: "我的超棒工具"
    },
    slug: "my-awesome-tool",           // 唯一，kebab-case
    icon: "🚀",
    version: "v0.1",
    priceBase: 0,                      // 未定价填 0
    priceDisplay: "待定",
    features: {
      en: [
        "Feature 1",
        "Feature 2",
        "Feature 3"
      ],
      zh: [
        "功能 1",
        "功能 2",
        "功能 3"
      ]
    },
    status: "roadmap",                 // 或 available|beta|forging
    eta: "Q3 2026",
    progress: 10
  }
];
```

### 步骤 3：状态说明

| 状态 | 显示位置 | 说明 |
|------|---------|------|
| `available` | 首页、商店、changelog | 完整功能，可购买 |
| `beta` | 首页、商店、changelog | 测试中，可能有试用 |
| `forging` | 商店、changelog | 开发中，可候补 |
| `roadmap` | changelog | 计划中 |

### 步骤 4：添加实际应用（如需要）

如果产品是可交互的工具（类似 Tariff Lens）：

```
src/app/apps/my-awesome-tool/
├── page.tsx              # 入口
├── MyAwesomeToolClient.tsx  # 客户端组件
└── components/           # 相关组件
```

然后在产品数据中添加：
```typescript
{
  // ...
  launchPath: "/apps/my-awesome-tool",
  trialConfig: { allowed: true, maxUses: 3 }
}
```

### 产品更新检查清单

- [ ] **只修改了** `src/app/data/products.ts`
- [ ] `slug` 唯一且使用 kebab-case
- [ ] 包含双语内容
- [ ] `status` 设置正确
- [ ] 如果是可用工具，创建了 `src/app/apps/[slug]/`
- [ ] 验证 `/store/[slug]` 可正常访问
- [ ] 验证首页/商店/changelog 显示正确

---

## 🎨 如何健康更新前端

### 可安全修改的文件

| 文件/文件夹 | 说明 | 注意事项 |
|------------|------|---------|
| `src/app/apps/[slug]/` | 应用代码 | 完全可修改，独立模块 |
| `src/app/components/` | 可复用组件 | 不破坏现有 API |
| `src/lib/` | 工具库 | 保持函数签名兼容 |
| `tailwind.config.ts` | 样式配置 | 增量添加，不删除已有配置 |

### 谨慎修改的文件

| 文件 | 注意事项 |
|------|---------|
| `src/app/layout.tsx` | 可能影响所有页面，增量修改 |
| `src/app/page.tsx` | 首页，注意布局不破坏 |
| `next.config.*` | 构建配置，小心改动 |

### 禁止修改的文件

| 文件 | 原因 |
|------|------|
| `src/app/store/[slug]/page.tsx` | 自动路由，改数据源 |
| `src/app/log/[slug]/page.tsx` | 自动路由，改数据源 |
| `src/app/sitemap.ts` | 自动生成，不要改 |
| `src/app/robots.ts` | 配置文件，小心修改 |

### 修改现有页面的正确方式

**❌ 错误**：
```typescript
// 直接在页面组件中写大量代码
export default function Page() {
  // 500 行代码...
}
```

**✅ 正确**：
```typescript
// 拆分组件和逻辑
import { MyFeature } from './components/MyFeature';
import { useMyHook } from './hooks/useMyHook';

export default function Page() {
  const { data } = useMyHook();
  return <MyFeature data={data} />;
}
```

### 添加新组件的规范

```
src/app/components/
└── my-new-component/
    ├── index.tsx           # 主组件
    ├── MyNewComponent.tsx   # 组件实现
    └── hooks/               # 相关 hooks
        └── useMyNewComponent.ts
```

组件文件最大 300 行，超过就拆分！

### 前端更新检查清单

- [ ] 没有修改自动路由页面
- [ ] 组件有明确的单一职责
- [ ] 使用 TypeScript 类型
- [ ] 添加了必要的注释
- [ ] 没有破坏现有功能
- [ ] Lint 通过（`npm run lint`）
- [ ] 可以正常构建（`npm run build`）

---

## ❌ 错误示例与纠正

### 错误示例 1：创建独立产品文件夹

**❌ 错误**：
```
src/app/floorplan-ai/
├── page.tsx
├── layout.tsx
└── components/
    └── Hero.tsx
```

**问题**：
- 违反单一数据源原则
- 不会自动集成到 `/store/`
- 不会自动出现在 `/changelog/`
- 与现有架构冲突

**✅ 纠正**：
```bash
# 删除错误创建的文件夹
git rm -r src/app/floorplan-ai/

# 只在 products.ts 中添加产品
# 如需要实际应用，创建 src/app/apps/floorplan-ai/
```

### 错误示例 2：重复产品定义

**❌ 错误**：
```typescript
// page.tsx 中
const product = { name: "My Product", ... };

// another-file.ts 中
const product = { name: "My Product", ... };
```

**✅ 纠正**：
```typescript
// 只在 src/app/data/products.ts 中定义一次
// 其他地方导入使用
import { PRODUCTS } from '@/app/data/products';
const product = PRODUCTS.find(p => p.slug === 'my-product');
```

### 错误示例 3：组件过大不拆分

**❌ 错误**：
```typescript
// src/app/apps/my-tool/page.tsx - 800 行！
export default function MyTool() {
  // 所有逻辑都在这里...
}
```

**✅ 纠正**：
```typescript
// src/app/apps/my-tool/page.tsx - 简洁
import { MyToolClient } from './MyToolClient';

export default function MyTool() {
  return <MyToolClient />;
}

// src/app/apps/my-tool/MyToolClient.tsx - 主要 UI
// src/app/apps/my-tool/components/Feature1.tsx
// src/app/apps/my-tool/hooks/useFeature1.ts
```

---

## ✅ 发布检查清单

在提交任何更改前，完成以下检查：

### 代码检查
- [ ] `npm run lint` 通过
- [ ] `npm run build` 成功
- [ ] 没有 TypeScript 错误
- [ ] 没有未使用的导入

### 功能检查
- [ ] 首页正常显示
- [ ] 商店页面正常
- [ ] 变更日志正常
- [ ] 现有产品/博客可访问
- [ ] 新内容可访问
- [ ] 双语切换正常

### Git 检查
- [ ] Commit 信息清晰（`feat: add xxx` 或 `fix: xxx`）
- [ ] 没有提交敏感文件（.env）
- [ ] 没有提交构建产物（node_modules, .next）
- [ ] 分支是最新的（git pull --rebase）

---

## 📚 相关文件参考

### 核心文件
- [src/app/data/products.ts](file:///workspace/src/app/data/products.ts) - 产品数据
- [src/app/layout.tsx](file:///workspace/src/app/layout.tsx) - 根布局
- [ARCHITECTURE_AUDIT.md](file:///workspace/ARCHITECTURE_AUDIT.md) - 架构审计报告

### 示例参考
- [src/app/apps/tariff-lens/](file:///workspace/src/app/apps/tariff-lens/) - 应用示例
- [src/app/store/[slug]/page.tsx](file:///workspace/src/app/store/[slug]/page.tsx) - 自动路由示例

---

## 🎓 学习路径

1. **新手**：先看这个文档，不要改代码
2. **添加内容**：只修改 `data/` 文件夹
3. **开发功能**：在 `apps/` 下创建应用
4. **优化架构**：理解原则后再考虑重构

---

## 🆘 求助

如果不确定：
1. 先看这个文档
2. 看 [ARCHITECTURE_AUDIT.md](file:///workspace/ARCHITECTURE_AUDIT.md)
3. 看 git 历史（`git log --stat`）
4. 遵循现有模式，不要创新架构

---

**最后更新**: 2026-05-24  
**维护者**: AI Assistant Team  
**版本**: 1.0
