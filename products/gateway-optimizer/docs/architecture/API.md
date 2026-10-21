# 本地 API 清单

所有 `/api/*` 路径在 local 模式需要 Authorization: Bearer 管理令牌；tenant 由令牌决定，客户端传入 tenant 查询不能覆盖。POST/PUT/DELETE限admin，备份GET也限admin。不是生产网关 API。

| Method | Path | 输入/用途 |
|---|---|---|
| GET | /api/status | 模式、角色、租户、存储、安全范围 |
| GET | /api/report?period=day/week/month | 聚合数字、coverage、预算与健康 |
| GET | /api/events | 当前租户最多500条记录与快照 |
| GET/POST | /api/prices | 读取/增加不可变priceSchema快照 |
| POST | /api/usage | usageSchema数组，最多10000条；事务幂等 |
| POST | /api/import/csv | {csv,mapping}；显式字段映射 |
| PUT | /api/budget | {limit_nano,period}；仅站内提醒 |
| POST | /api/policy/simulate | {capability,budget_nano,stream_started} |
| POST | /api/benchmark/mock | 三种Mock任务、两模型固定样本 |
| POST | /api/benchmark/live | 固定403；未实现付费执行通道 |
| GET | /api/provider/status | 是否存在服务端LiteLLM环境配置，不返回凭据 |
| POST | /api/provider/models | 当前配置LiteLLM清单，demo返回模拟 |
| GET | /api/export.csv | 原币金额、USD估算、快照/FX溯源 |
| GET | /api/diagnostic | 无请求ID、租户ID与渠道原名的聚合诊断 |
| GET | /api/backup | 当前租户version1备份，仅admin |
| POST | /api/restore | 仅同租户、原子合并、冲突拒绝 |
| DELETE | /api/data | x-confirm-delete须精确当前tenant |
| GET | /api/mock/stream?scenario=normal | 仅demo；normal/429/5xx/timeout/network/interrupt |

Price样例与Usage样例见 samples。真实记录必须自行建立正确模型/价格，不能用Mock价格算真实费用。没有在线 New API connector endpoint，没有余额/订单/路由写API。报错采用通用invalid_schema/invalid_or_conflicting_data，不返回上游错误体或凭据。
