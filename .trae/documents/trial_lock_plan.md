# 设备级免费试用锁实施计划

## 概述
引入开源版 `@fingerprintjs/fingerprintjs` 替代 localStorage，实现设备级免费试用锁，确保用户体验流程为"无登录、零摩擦，用爽后拦截支付"。

## 研究结论
- 当前 TariffLens 工具位于 `/workspace/src/app/apps/tariff-lens/TariffLensClient.tsx`
- 产品数据位于 `/workspace/src/app/data/products.ts`
- 项目已安装 Framer Motion 和 TailwindCSS，可用于打造丝滑的 UI 动画
- 尚未引入 FingerprintJS 库

## 实施步骤

### 第一步：安装依赖
- 执行 `npm install @fingerprintjs/fingerprintjs`
- 确认依赖正确添加到 package.json

### 第二步：数据模型硬化
**文件：** `src/app/data/products.ts`
- 修改 `Product` 接口，添加 `trialConfig` 字段
- 字段结构：`trialConfig: { allowed: boolean; maxUses: number; }`
- 为 `tariff-lens` 产品配置：`allowed: true, maxUses: 3`

### 第三步：创建试用管理工具
**创建文件：** `src/lib/trialManager.ts`
- 封装 FingerprintJS 初始化
- 实现设备指纹获取
- 实现本地存储（结合简单加密思想）
- 实现使用次数管理（读/写/自增）
- 实现状态判断逻辑（是否有有效 license / 是否可试用 / 是否达到上限）

### 第四步：创建试用拦截 Modal 组件
**创建文件：** `src/app/apps/tariff-lens/TrialLimitModal.tsx`
- 极客风格暗黑主题
- 文案："Free trial limit reached (3/3). Unlock life-time access to remove constraints."
- 使用 Framer Motion 实现丝滑的弹窗动画
- 提供唯一按钮："Go to Checkout"，硬跳转至 `/checkout/tariff-lens`
- 禁止任何后门绕过机制

### 第五步：整合到 TariffLensClient
**修改文件：** `src/app/apps/tariff-lens/TariffLensClient.tsx`
- 引入试用管理工具和 Modal
- 在组件挂载时初始化 FingerprintJS
- 维护本地试用状态
- 在用户点击"开始关税估算"时：
  - 检查是否有有效 license：有 → 允许提交
  - 无 → 检查试用状态：
    - 未达上限 → 允许提交，使用次数+1
    - 已达上限 → 拦截，显示 Modal
- 调整 UI，加入试用次数提示（可选）

### 第六步：测试与验证
- 本地开发模式测试
- 构建测试确保无类型错误
- 验证核心流程完整性

## 依赖与风险
- **新增依赖：** `@fingerprintjs/fingerprintjs`
- **风险项：**
  - 设备指纹可能被浏览器限制（提供降级方案）
  - 用户可能通过隐私模式规避（这是可接受的）
- **兼容性：** 仅影响有 trialConfig 的产品

## 文件修改清单
1. `package.json` - 添加依赖
2. `src/app/data/products.ts` - 添加 trialConfig 字段及配置
3. `src/lib/trialManager.ts` - 新建，试用管理核心
4. `src/app/apps/tariff-lens/TrialLimitModal.tsx` - 新建，Modal 组件
5. `src/app/apps/tariff-lens/TariffLensClient.tsx` - 核心修改，整合逻辑

## 分步执行策略
本计划将分步完成，不一次性修改所有文件：
1. 依赖安装与数据模型修改
2. 创建试用管理工具
3. 创建 UI 组件
4. 最后整合并测试
