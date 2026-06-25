---
name: ai-fe-learn
description: 沉淀本次功能经验到规则与技能。
agent: agent
---

# ai-fe-learn

先运行 `ai-fe learn [feature-name]` 生成任务文件，或根据用户本条消息直接执行。

**步骤**

1. 阅读 `specs/features/<name>/` 下的 spec、plan、tasks、verify-report。
2. 查看 git diff（如可访问）。
3. 生成或更新 `specs/features/<name>/learn-report.md`。
4. 提出可更新的 rules、skills、ADR 和测试模式建议。

**约束**

- 只沉淀可复用、可审查的经验。
- 用户可见内容使用中文。