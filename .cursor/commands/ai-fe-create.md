---
name: /ai-fe-create
id: ai-fe-create
category: AI-FE
description: 创建功能规格并落盘到 specs/features/。
---

# ai-fe-create

先运行 `ai-fe create "<需求描述>"` 生成任务文件，或根据用户本条消息直接执行。

**步骤**

1. 阅读 `.ai/tasks/` 下最新 create 任务（若存在）。
2. 与用户确认功能名称、范围、状态、权限、接口和验收标准。
3. 生成符合 Schema 的 JSON：`.ai/tmp/<feature-name>.spec.json`。
4. 执行 `ai-fe apply .ai/tmp/<feature-name>.spec.json`。

**约束**

- 功能名必须符合 `^[a-z][a-z0-9-]{1,39}$`。
- 用户可见内容使用中文；路径和标识使用英文。
- 此阶段不要修改业务代码。
- Schema：`.ai/schemas/feature-spec.schema.json`