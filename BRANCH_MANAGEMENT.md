# 🌳 Git 分支管理规则

> **生效日期**: 2026-05-27  
> **适用范围**: 所有开发者（包括 AI 助手）

---

## 📌 核心规则

### ✅ 唯一主分支：`main`

1. **`main` 分支是唯一的生产就绪分支**
2. **所有代码修改直接在 `main` 分支上进行**
3. **禁止创建长期功能分支**（如 `feature/xxx`、`hotfix/xxx`、`AI-agent/xxx` 等）

### ❌ 禁止的行为

- ❌ 禁止创建新的功能分支（`feature/*`、`new/*`、`add/*`）
- ❌ 禁止创建修复分支（`fix/*`、`hotfix/*`、`bugfix/*`）
- ❌ 禁止创建 AI 分支（`AI-agent/*`、`trae/*`、`gemini/*`）
- ❌ 禁止创建个人分支（`dev/*`、`develop/*`、`user/*`）
- ❌ 禁止使用 PR/Merge Request 来合并分支

---

## 🎯 正确的开发流程

### 单分支工作流

```
main ──────────────────────────────────────────► [Production]
      │
      ├── ✏️ 直接在 main 上修改文件
      ├── 💾 提交 (git commit)
      └── 🚀 推送 (git push)
```

### 步骤说明

#### 1. 每次开发前
```bash
# 确保在 main 分支且是最新的
git checkout main
git pull origin main
```

#### 2. 进行修改
- 直接编辑需要的文件
- 遵循项目的代码规范

#### 3. 提交更改
```bash
# 添加修改的文件
git add .

# 提交（使用清晰的提交信息）
git commit -m "feat: add new feature description"

# 或者使用更详细的格式
git commit -m "feat(module): add detailed description

- Added feature X
- Updated Y
- Fixed Z"
```

#### 4. 推送到远程
```bash
git push origin main
```

---

## 📝 提交信息规范

### 推荐格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(store): add new product card` |
| `fix` | Bug 修复 | `fix(tariff): correct HS code parsing` |
| `docs` | 文档更新 | `docs: update README` |
| `style` | 代码格式 | `style: format code with prettier` |
| `refactor` | 重构 | `refactor: simplify API route` |
| `perf` | 性能优化 | `perf: improve build speed` |
| `test` | 测试 | `test: add unit tests for auth` |
| `chore` | 维护 | `chore: update dependencies` |

### 示例

```bash
# 好的提交信息
git commit -m "feat(products): add FloorPlan AI to product list

- Added FloorPlan AI with status: forging
- Updated homepage to display all products
- Fixed grid layout for mobile devices"

# 简单的提交信息
git commit -m "fix: correct product display on homepage"

# 文档提交
git commit -m "docs: add branch management guidelines"
```

---

## 🔄 为什么选择单分支？

### 单分支的优势

1. **简单直观**
   - 无需管理复杂的分支策略
   - 减少 merge 冲突
   - 降低学习成本

2. **快速迭代**
   - 代码修改后立即可见
   - 无需等待 PR 审核
   - 适合小团队和个人项目

3. **适合 AI 协作**
   - AI 可以直接修改和提交
   - 无需人工干预分支管理
   - 提高开发效率

4. **部署简化**
   - Cloudflare Pages 直接监听 `main` 分支
   - 推送即部署
   - 无需手动选择分支

### 潜在风险及缓解

| 风险 | 缓解措施 |
|------|---------|
| 错误代码进入生产 | ⚠️ 使用本地测试后再推送 |
| 难以追踪历史 | ✅ 使用清晰的 commit message |
| 无法并行开发 | ✅ Git 可以处理并发修改 |

---

## ⚠️ 紧急修复流程

如果生产环境出现严重 Bug：

1. **不要创建新分支**
2. **直接在 main 上修复**
3. **提交并立即推送**
4. **部署会自动触发**

```bash
# 紧急修复示例
git checkout main
git pull origin main

# 快速修复
vim critical-file.ts
git add critical-file.ts
git commit -m "fix(critical): hotfix for production error"
git push origin main
```

---

## 🧹 清理旧分支

定期清理已合并的临时分支：

```bash
# 查看所有分支
git branch -a

# 删除本地分支
git branch -d old-feature-branch

# 删除远程分支
git push origin --delete old-feature-branch
```

---

## 📚 相关文档

- [ARCHITECTURE_GUIDE.md](file:///workspace/ARCHITECTURE_GUIDE.md) - 代码架构指南
- [ARCHITECTURE_AUDIT.md](file:///workspace/ARCHITECTURE_AUDIT.md) - 架构审计报告

---

## 🎯 快速参考卡

```bash
# ✅ 正确的开发流程
git checkout main
git pull origin main
# ... 修改文件 ...
git add .
git commit -m "描述你的修改"
git push origin main

# ❌ 错误的做法
git checkout -b feature/my-feature  # 不要创建新分支！
# ... 修改文件 ...
git checkout main
git merge feature/my-feature  # 不要合并分支！
```

---

## 🚨 违规处理

如果发现有人创建了违规分支：

1. **不要合并该分支到 main**
2. **告知创建者遵循本规则**
3. **直接在该分支上完成修改并提交到 main**
4. **删除违规分支**

---

**最后更新**: 2026-05-27  
**维护者**: 开发团队  
**版本**: 1.0
