# 官方客户端兼容配置说明（配置草案，未运行客户端）

核验日：2026-10-22。这里的 Base URL 指独立 LiteLLM/授权上游，不是 core-api 的4173端口。core-api不提供模型推理协议。必须先核对自己的模型协议、权限、版本和可用功能，再由本人运行小额测试。

## Codex

官方配置参考：<https://developers.openai.com/codex/config-reference/>（当前跳转至 learn.chatgpt.com）。Codex 自定义提供商需支持 Responses 协议，不能只支持 Chat Completions 却称完全兼容。示例放入用户级 config.toml 中，合并前备份原文件：

```toml
model = "YOUR_AUTHORIZED_MODEL_ID"
model_provider = "authorized_gateway"
[model_providers.authorized_gateway]
name = "My authorized gateway"
base_url = "http://127.0.0.1:4000/v1"
env_key = "MY_GATEWAY_API_KEY"
wire_api = "responses"
```

MY_GATEWAY_API_KEY 由自己在进程环境提供。不提取 ChatGPT 登录token，不复用订阅，不宣称所有模型支持工具、推理、图片与上下文续接。

## Claude Code

官方：<https://code.claude.com/docs/en/llm-gateway>、<https://code.claude.com/docs/en/llm-gateway-connect>。

设置 `ANTHROPIC_BASE_URL=http://127.0.0.1:4000`，以及网关要求的 `ANTHROPIC_AUTH_TOKEN` 或 `ANTHROPIC_API_KEY`，使用你自己合法授权的 API/网关凭据。网关需提供 Anthropic messages 协议和所需头字段，不是随便改URL就兼容。重启客户端并通过 `/status` 核对目标地址与凭据来源；实际请求会产生 API 费用，需本人批准预算。不要读取或复制 `.credentials.json`。

## OpenCode

官方当前同时提供 v1 与 v2 文档，配置不同：

- v1：<https://opencode.ai/docs/providers/>，`provider.<id>.options.baseURL`。
- v2：<https://opencode.ai/v2/docs/providers/>，`providers.<id>.settings.baseURL`。
- 迁移说明：<https://opencode.ai/v2/docs/migrate-v1/>。

先执行你安装版本的帮助/版本命令，然后只采用对应官方文档的格式；凭据使用其官方 provider connect 或环境方式。不自动写入用户配置、不移动其他项目设置。本次未安装这三个客户端、未验证真实消息、流式或工具调用，全部 NOT TESTED。
