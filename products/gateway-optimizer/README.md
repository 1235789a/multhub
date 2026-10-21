# MultiHub Gateway Optimizer v1.0 Beta

一个原创、可本地运行的 API 费用与运行分析集成层。两个入口共用 TypeScript 统计核心：

- **Gateway Optimizer Pro**：`http://127.0.0.1:4173/pro/`
- **Token Optimizer Personal**：`http://127.0.0.1:4173/personal/`

> 当前是本地 Beta，不是生产网关。默认展示可追溯的模拟数据。无自动生产路由、付费推理和硬预算拦截。真实供应商连通性、Docker、Windows 尚未验证。

## 5 分钟演示

安装 Node.js 24 LTS（至少 24.0.0）与 npm。在本项目目录执行：

```sh
npm ci
npm run build
npm start
```

打开上面的两个入口。无需 API Key、Docker 或外部数据库。Pro 240 条、Personal 96 条模拟记录自动生成。每条标为 `simulation`，模型名、价格、上游实账及收入均为合成测试样本，不能当作市场报价或成本收益证据。模拟日期相对首次启动当天的 UTC 日期生成。

`npm run dev` 使用 TypeScript；正式本地启动用编译后的 `npm start`。项目没有默认全网监听；如在容器内使用，显式设置 HOST=0.0.0.0，端口仍只映射到宿主机 127.0.0.1。

## 已实现

统一请求元数据、未知/估算标记、事务导入、幂等冲突检查；不可变价格/FX 快照；USD/CNY/EUR 报价换算为 USD；成功率、429/5xx/超时/网络错误与 p95 延迟；UTC 日/周/月报表；CSV、脱敏诊断、租户备份恢复与删除；预算站内提醒；能力/预算/健康约束的路由模拟；确定性 Mock 评测；New API CSV 显式映射导入；LiteLLM 模型清单适配器与部署配置。

## 使用真实数据

阅读 [安装与升级](docs/release/INSTALL.md)、[Pro 教程](docs/product-pro/TUTORIAL.md)、[Personal 教程](docs/product-personal/TUTORIAL.md)。**不要把演示模式用于私人数据**。本地模式必须提供至少 32 字符的访问令牌与租户角色；环境变量不会被自动从 `.env` 读取，使用 `node --env-file=.env dist/apps/core-api/main.js` 或由进程环境注入。

先通过 `/api/prices` 建立手工核验的真实模型价格快照，再导入自己的归一化记录。第三方原始导出格式可能变化，不能直接把 quota 当美元费用。模型清单读取不等于推理、用量自动同步或已验证客户端兼容。

## 验证

```sh
npm run typecheck
npm test
npm run test:load
node --import tsx scripts/concurrency.ts
npx playwright install chromium
npm run test:e2e
```

本次浏览器测试在 Linux 的 Chromium 153 headless 上通过。由于默认浏览器 CDN 下载受限，实际通过 npm 获取 `@sparticuz/chromium` 测试依赖并使用 BROWSER_EXECUTABLE 指定解压后的路径。普通安装可使用 Playwright 标准 Chromium。该测试依赖不进入生产镜像。

证据在 [evidence](evidence/)，验收与缺口见 [状态报告](docs/testing/STATUS.md)。

## 范围

本次选择 Fastify + TypeScript + 原生 SQLite WAL + HTML/CSS/JS，省去双 Next.js 服务、Redis 和 Prisma。模块没有复制 New API、PriceAI、Helicone 或 CC Switch 源码。PostgreSQL 用于可选 LiteLLM 方案，核心产品本次没有 PostgreSQL 驱动实现；不要把 Compose 中的 Postgres 当成核心已完成迁移。

源码仅为 `products/gateway-optimizer/` 独立子项目；不会改变 MultiHub 主站入口、构建脚本和生产部署。不要在主站根目录执行本项目的安装命令。
