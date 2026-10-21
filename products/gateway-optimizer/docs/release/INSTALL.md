# Linux / macOS 本地安装、升级和回滚

验证环境：Linux x86_64、Node 24.19.0、npm 11.9.0。其他平台见 Windows 文档并遵循 NOT TESTED 标记。

## 全新演示安装

在 `products/gateway-optimizer` 或解压后的相同项目目录：

```sh
npm ci
npm run build
npm start
```

`.env.example` 是配置说明，不含密钥，不会自动加载。默认 127.0.0.1:4173；端口冲突可设置 `PORT=4174 npm start`。Pro 与 Personal 共用进程、独立入口与演示租户。

## 自己的数据

复制 `.env.example` 到 `.env`，在本地生成两个不同的随机令牌（不把输出发给卖家）：

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

设置 `GATEWAY_MODE=local`；例如 `AUTH_TOKENS_JSON={"YOUR_RANDOM_64_HEX_TOKEN":{"tenant":"owner","role":"admin"}}`（用实际本地值替换），DATA_DIR 设置为专用私有目录。不要使用示例文字当令牌。

```sh
node --env-file=.env dist/apps/core-api/main.js
```

浏览器首次请求将提示输入管理 token。它在当前页面内存中使用；刷新要重输。先调用 `/api/prices` 加入自己的模型价格快照，再导入元数据；API 清单见 `docs/architecture/API.md`。请使用可信本机 HTTP 客户端并从本地环境读取 token，不在截图和 shell history 中粘贴明文 Key。

## 备份与恢复

页面的备份/恢复仅作用于当前租户。CLI：

```sh
npm run backup -- owner /safe/path/owner.backup.json
npm run restore -- owner /safe/path/owner.backup.json
```

如果使用 `.env`，用 `node --env-file=.env --import tsx scripts/maintenance.ts backup owner /safe/path/file.json`，或自行注入 DATA_DIR。

导出为版本1的 JSON，包含不可变价格快照、用量元数据和预算，没有 API Key。恢复采用合并、严格幂等与事务，冲突不会覆盖已有记录。大备份超过页面 body limit 时，使用 CLI；CLI 恢复最多100000条。不要跨租户恢复或手改备份。

## 升级

1. 停止核心服务，保存源码版本/commit；备份每个租户，以及停机后的整个 DATA_DIR（包括 WAL 相关文件）。保留环境文件于安全目录。
2. 在新目录解压新版本，执行 npm ci、npm run build、npm test；不要覆盖旧目录。
3. 将专用数据目录路径指向原路径。当前 schema user_version=1，构造 Store 自动执行幂等建表迁移。未来 user_version>1 必须先跑专门迁移验证。
4. 启动并核对报表覆盖条数、预算与快照。这个版本不要多进程长期运行 Web 服务；测试并发写入通过不代表已完成多节点运维。

## 回滚

停止新服务；切回保留的上一版本目录。若新版本已经变更数据库 schema，先恢复升级前的完整停机数据库副本；或者恢复到兼容的空数据库并导入租户备份。不能只回滚代码却保留不兼容迁移。本次测试覆盖重新打开同版本 schema、备份恢复和清空后重建，**没有跨版本 schema 回滚验证**。

## Docker Compose

```sh
docker compose -f infra/docker/compose.yml up --build
```

默认只启动本地 Beta。Compose 未在当前环境执行（无 Docker），状态 NOT TESTED。可选 LiteLLM 配置见 Personal 教程，不能据此声称已完成 Docker 安装验证。
