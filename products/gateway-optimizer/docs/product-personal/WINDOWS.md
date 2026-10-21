# Windows 安装与排错（NOT TESTED）

本次环境为 Linux，未接触 Windows 真机、VM、Docker Desktop 或 WSL。以下为待验证操作说明，不是“Windows 一键安装”卖点。PowerShell脚本也未在Windows运行。

1. 从 Node.js 官方安装 Node 24 LTS，在新开的 PowerShell 中运行 `node --version`、`npm --version`，确认 node >=24。
2. 将源码解压到用户自己的普通目录，避开 Program Files、网络共享与自动同步目录。进入包含 package.json 的项目目录。
3. 执行 `npm ci`、`npm run build`、`npm start`。如果 npm.ps1 被系统执行策略阻止，可使用 `npm.cmd`，不要为了安装关闭系统安全策略。
4. 浏览器打开 `http://127.0.0.1:4173/pro/` 或 `/personal/`。端口占用时设置 `$env:PORT='4174'` 后重试。停止服务按 Ctrl+C。
5. 可参考 `scripts/windows-start.ps1`，它检查版本与工作目录，再运行安装/编译/启动；不提权、不下载账号、不更改系统代理和防火墙。该脚本尚未实际验证。
6. 真实数据配置放自己的 `.env`，通过 `node --env-file=.env dist/apps/core-api/main.js` 启动，不将环境文件发给售后。

常见问题：

- 报 node:sqlite 不存在：升级到 Node24，检查 `where.exe node` 是否命中旧安装。
- npm网络失败：保留错误日志的域名与错误码；不要把含 token 的完整日志或 `.npmrc` 发给他人。与供应商 API 的连通是两个不同问题。
- 页面空白：先看启动终端和浏览器控制台，确认4173是本服务。截图中遮挡管理令牌。
- 真实模式401：输入自己配置的管理令牌；供应商API Key与管理token不是同一个东西。
- 数据库权限/锁：停止重复进程，确认 DATA_DIR 是自己的可写本地目录。不要把正在写入的 SQLite 文件放多设备同步盘。
- 安全与备份：chmod 不是 Windows ACL 验证；使用自己的 Windows 用户权限、BitLocker/可信加密备份。Windows备份恢复和升级回滚还需实测。

不保证 Docker Desktop、WSL、本地证书、企业代理、杀毒软件组合兼容。遇到这些问题按具体环境评估支持范围。
