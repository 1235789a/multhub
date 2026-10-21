# 教程二：管理自己的 API 预算与模型样本

适用：拥有合法授权 API 的个人。它不是 Token 转售服务，不附赠账号、订阅或 API 额度。

## 零 Key 体验

安装后打开 `/personal/`，96条确定性模拟记录展示模型估算、上游实账、成功率和预算。设置0.01 USD测试预算提醒，页面会显示当前周期状态。用量存在未知费用时 alert 为 incomplete，不能把缺项理解为未消费。

点击“运行 Mock 评测”，3个固定样本覆盖代码、JSON与资料提取。通过率只说明这套合成样本，不是通用模型排名。延迟/Token/费用是明确标为 fixed_simulation_fixture 的数值，不是付费 API 实测。

## 授权 API 接入范围

使用 GATEWAY_MODE=local 和独立管理令牌。供应商 Key 由你自己的服务进程环境注入，不给卖家、不输到网页。

`LITELLM_BASE_URL=https://你的自有网关域名`（精确 origin，无 /v1 后缀）
`ALLOWED_PROVIDER_ORIGINS=https://你的自有网关域名`
`LITELLM_API_KEY=你自己的有限权限密钥`

点击“检查模型清单”会向这个明确授权的 origin 发起一次 `/v1/models` GET。只接受 HTTPS 公共IPv4、禁止重定向。当前不支持私网/localhost LiteLLM 的服务端库存读取；本地 LiteLLM 可以由客户端自己访问，成本数据则经手工导入。连接模型清单不是推理成功证据。本次没有真实配置、没有付费调用，因此真实连接标 NOT TESTED。

## LiteLLM 部署草案

`infra/docker/compose.litellm.yml`、`litellm-config.yaml` 是固定版本部署草案，必须由你自行填入授权供应商 API Key、LiteLLM master key、独立 Postgres 密码。LiteLLM 使用专用 Postgres，不使用核心 SQLite。没有数据库不能声称 LiteLLM 硬预算生效。本套 UI 的预算只提醒，即使你另外启用了 LiteLLM 数据库预算，也要实际核验供应商费用延迟、并发超额和绕过网关的调用。

不会默认使用 Enterprise 的 generic_api 远程回调。官方 Python CustomLogger 是另一条扩展方式，但本次没有交付或验证完整自动用量采集插件。现有 API `/api/usage` 允许你自己的集成发送严格归一化元数据；先在本地用 samples 运行。MVP 不是自动接管所有客户端的工具。

## 评估自己的任务

选择固定的测试集和明确的通过规则；先用 Mock，记录样本量、任务范围、延迟、Token与快照成本。真实 API 评测需先明确 API 权限、消费上限、请求数、最大输出、超时与取消方式，再批准付费。本版 `/api/benchmark/live` 永远拒绝，不能用请求参数 approved=true 绕过。

## 保留与清理数据

不要上传完整 Prompt。页面可下载不含Key的租户备份，删除时输入当前租户名，恢复时选择原租户备份。备份自身未加密，使用自己的加密磁盘/密码管理存储。Windows 安装说明见 WINDOWS.md，尚未完成 Windows 真机验证。

可实现的价值是假设：帮助你看清费用口径、减少手工配置理解成本。当前没有实测节省比例、付费客户验证或长期可靠性结果。
