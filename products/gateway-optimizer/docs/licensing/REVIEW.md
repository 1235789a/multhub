# 第三方许可证与商业边界检查

核验日2026-10-22；代码与Release快照详见 UPSTREAM_SNAPSHOTS.json。许可证原文留在 upstream/。本次是工程核查，发行时仍需对实际复制的代码/镜像及其完整传递依赖逐项核查，不能把兼容层等同于取得商标/OEM授权。

| 项目 | 核验许可/边界 | 已有功能/部署 | 本产品决定 |
|---|---|---|---|
| LiteLLM | 根目录明确 enterprise/ 使用独立Enterprise许可，其余MIT；Enterprise生产使用须符合其订阅/其他书面协议。MIT部分允许商业使用，复制须保留许可 | API协议适配、代理、模型成本/路由等；预算/virtual keys需Postgres，生产可配Redis；官方镜像与配置文档 | 独立协议适配和可选Compose；不复制Enterprise；不宣称SSO、enterprise audit或generic_api为免费已有功能 |
| New API | AGPLv3；NOTICE包含Section7附加署名/原项目链接要求。修改/分发/网络交互须按适用AGPL条款提供对应源码与许可；商业/OEM闭源或去除标识须另核授权 | 聚合/分发/计费/渠道/日志；Go+前端，数据库与可选Redis；日志部分接口需要Admin/User权限 | 不fork、不链接其Go库、不改UI、不分发New API镜像；仅用户主动导出的CSV归一化。若未来复制/集成分发，重新审查，不能沿用当前独立层结论 |
| Helicone | 当前根LICENSE为Apache-2.0，允许按条件商业使用、保留license/notices与修改说明；相关独立Helm仓库可能不同许可 | LLM可观测性、费用、延迟、日志与评测；自托管为多服务方案，不适合本地轻量首版 | 本次未复制或打包；不把Helm条款当主仓库条款，亦不把主仓库许可扩展到所有关联服务 |
| CC Switch | 当前根LICENSE MIT，复制需保留署名许可，不等于可冒用官方品牌 | Tauri/Rust桌面客户端配置/提供商管理；平台构建依赖不同，不能直接说本产品有Windows安装器 | 仅研究功能边界；未复制代码、提取登录凭据或复用客户端私有配置 |
| PriceAI（用户仓库） | AGPL-3.0-only；DATA_LICENSE单独限制生产报价库、采集/价格快照与素材 | 市场报价、渠道汇总，非请求成本账本 | 源码与报价库均未复制入本项目 |

## 重点避免的许可混淆

LiteLLM官方 Logging 页将 **Custom Callback APIs [Async] / generic_api** 标Enterprise；Python CustomLogger类是另一条文档路径。本次没有使用generic_api，也没有将全部Enterprise功能写入免费销售清单。SSO当前有特定免费人数条件，不能一概说全部免费或一概收费；本产品没有SSO。

New API不是“AGPL不能商用”。允许的商业使用仍需履行对应开源、通知和署名义务。独立CSV文件交换降低代码派生/耦合，但不是对未来各种OEM集成的总授权。其源码当前HTTP导出为NDJSON，页面CSV与协议接口不是同一种格式。

## 原创部分

本项目原创新增代码采用根 LICENSE（MIT）。可商业使用/分发，但必须保留许可与著作权声明。本次不包含供应商API额度、商标授权、任何用户生产数据或第三方SaaS服务订阅。npm锁文件固定实际解析依赖；完整依赖包名称、版本、license及本地安装notice位置见 DEPENDENCIES.json。正式发行二进制/镜像时应把对应license/NOTICE放进交付，而不是只保留一张表。

## 一手来源

- <https://github.com/BerriAI/litellm/blob/main/LICENSE>
- <https://github.com/BerriAI/litellm/blob/main/enterprise/LICENSE.md>
- <https://docs.litellm.ai/docs/proxy/logging>
- <https://docs.litellm.ai/docs/proxy/users>
- <https://docs.litellm.ai/docs/proxy/docker_quick_start>
- <https://docs.litellm.ai/docs/enterprise>
- <https://github.com/QuantumNous/new-api/blob/7d8b91268dab69d7150f345c448b5e250163146a/LICENSE>
- <https://github.com/QuantumNous/new-api/blob/7d8b91268dab69d7150f345c448b5e250163146a/NOTICE>
- <https://github.com/QuantumNous/new-api/blob/7d8b91268dab69d7150f345c448b5e250163146a/router/api-router.go>
- <https://github.com/QuantumNous/new-api/blob/7d8b91268dab69d7150f345c448b5e250163146a/controller/log.go>
- <https://docs.newapi.pro/zh/docs/guide/wiki/changelog>
- <https://github.com/Helicone/helicone/blob/main/LICENSE>
- <https://docs.helicone.ai/getting-started/self-host/docker>
- <https://github.com/farion1231/cc-switch/blob/main/LICENSE>
