# 2026-05-24: 产品中英文切换支持

## 变更概述

为产品数据添加了完整的中英文双语支持，所有使用产品数据的页面都已更新为根据语言设置自动显示对应的内容。

## 修改的文件

### 1. `src/app/data/products.ts`
- 将 `name` 字段从 `string` 改为 `{ en: string; zh: string }` 格式
- 将 `features` 字段从 `string[]` 改为 `{ en: string[]; zh: string[] }` 格式
- 为现有 4 个产品添加了完整的英文名称和功能描述
  - Tariff Lens（关税透镜）
  - MarkItDown（单页清洁工）
  - Nano Secure Bridge
  - MCP Universal Adapter Pack（MCP 通用适配器包）

### 2. `src/app/store/page.tsx`
- 更新了 `StoreListPage` 组件，添加 `lang` 状态
- 使用 `product.name[lang]` 和 `product.features[lang]` 显示对应语言的内容

### 3. `src/app/store/[slug]/StoreDetailClient.tsx`
- 更新了组件，添加 `lang` 状态
- 使用 `product.name[lang]` 和 `product.features[lang]`

### 4. `src/app/changelog/page.tsx`
- 更新了 `ChangelogRow` 组件，添加 `lang` 参数
- 更新了 `Section` 组件，添加 `lang` 参数并传递给 `ChangelogRow`
- 更新了 `ChangelogPage`，添加 `lang` 状态

### 5. `src/app/page.tsx`
- 更新了 `ToolCard` 组件，添加 `lang` 参数
- 使用 `product.name[lang]` 和 `product.features[lang][0]` 显示
- 更新了首页的 `ToolCard` 调用，传递 `lang` 参数

### 6. `src/app/checkout/[slug]/CryptoCheckoutClient.tsx`
- 更新了组件，添加 `lang` 状态
- 使用 `product.name[lang]` 显示产品名称

## 测试

运行 `npm run build` 通过了完整的类型检查和编译，生成了所有静态页面。

## 验证

产品数据结构符合要求，没有破坏原有功能，支持中英文切换。
