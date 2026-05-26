# TRC20 支付验证重构 - 防重放攻击计划

## 问题分析
当前实现存在竞态条件漏洞，并发请求可能绕过检查。

## 架构限制
- 在 Edge Runtime 运行，无法使用 Firebase Admin SDK
- 使用 Firestore REST API
- 不能破坏现有架构

## 实施步骤

1. **增强 Firestore 客户端** - 新增条件写入功能，使用 `createIfMissing` 模拟事务锁
2. **新增 processed_transactions 集合** - 用于追踪已处理交易
3. **增强链上验证** - 检查交易状态为 SUCCESS
4. **重构验证流程** - 先尝试写锁，再进行验证
5. **保持兼容性** - 不破坏现有代码

## 核心思路
利用 Firestore REST API 的 `currentDocument.exists: false` 条件，确保原子性。
