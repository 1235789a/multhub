# 数据契约与费用口径

`packages/schema/index.ts` 是唯一运行时契约，Zod strict 拒绝额外字段。所有请求 ID、模型、渠道使用受限 ASCII 标识符；不要把客户邮箱或秘密写进标识符。

Usage：request_id、source、tenant_id、model_id、provider、channel、timestamp、input_tokens、output_tokens、cache_tokens、usage_quality、latency_ms、ttft_ms、error_type、status、billing_source、actual_cost_nano、revenue_nano、currency、evidence、price_snapshot_id。

- input_tokens 包含 cache_tokens；缓存是输入子集，不能重复加价。公式：`(input-cache)*input_price + output*output_price + cache*cache_price`，除以 1,000,000。每条按原币种纳单位四舍五入，再按该快照 FX 换成纳美元。
- Token 不完整时整条用量标 unknown，三个 Token 字段为 null。上游未提供缓存数量不自动当 0；估算用量必须标 estimated。
- latency_ms、ttft_ms 可 null；未知延迟不伪造为 0。p95 为 nearest rank，展示对应样本总数。健康分是成功率的百分数，不是预测模型。
- 同一行收入与上游费用使用相同币种；混合币种收入须先按自己的账本换算，当前没有独立收入FX字段。Price currency 支持 USD、CNY、EUR；fx_rate 是“每一报价币种单位对应 USD”。fx_timestamp 是来源时间；不自动抓汇率，不声称已核验。USD 汇率必须为 1。报表统一 USD；CSV 同时保留原币金额、USD金额、汇率和时间。
- 每个 tenant + request_id 唯一，跨 source 冲突也拒绝。完全相同的归一化事件重放返回 duplicates；同 ID 内容变化报错，不覆盖历史。需要覆盖不同导出批次的稳定 ID；没有稳定 ID 的行不能随机生成 ID 再导入。供应商重试若为独立真实收费尝试必须有不同 attempt ID；同一计费事件的重复通知复用同 ID。
- snapshot ID 在租户内不可变。费率变化新增快照，新请求显式引用新 ID；旧请求内嵌完整快照，历史账单不重新计价。
- actual_cost 是用户声明来自上游账单的金额。系统不自行核验发票；simulation 中即使字段名为 invoice，依然是合成数字。
- estimated_cost 不是实际账单，不与 actual_cost 累加。revenue 独立。realized_margin 只计算实际费用与收入均已知的配对记录，必须展示 coverage。
- `evidence` 区分 simulation/imported/live/manual；imported 是外部日志导入，真实性需要用户核验。报告包含来源集合。模型成本比较只针对相同实际任务/样本讨论，不能拿 Token 总量直接比较经济性。
- period 为 UTC 日/月，周从 UTC 周一开始。站内预算按当前日/周/月汇总，每条优先实际费用、其次估算；未知费用触发 incomplete。它是监控提醒，不是硬消费上限。

记录不包含 Prompt、响应正文、API Key、账户登录凭据。诊断导出仅聚合统计且渠道改名。普通 CSV 和租户备份包含请求元数据，应由数据所有者自行控制分享范围。
