---
name: /ai-fe-verify
id: ai-fe-verify
category: AI-FE
description: 运行验证并生成报告。
---

# ai-fe-verify

**步骤**

1. 确认 active feature（`ai-fe status`）。
2. 执行 `ai-fe verify [feature-name]`。
3. 阅读 `specs/features/<name>/verify-report.md` 和 `verification/reports/<name>.md`。
4. 若验证失败，修复问题后重新验证。

**约束**

- 功能标记完成前必须跑通 required checks。
- 不要跳过架构检查和验收测试。