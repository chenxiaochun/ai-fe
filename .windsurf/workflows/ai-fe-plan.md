---
description: 基于功能规格生成实施方案。
---

# ai-fe-plan

先运行 `ai-fe plan [feature-name]` 生成任务文件，或根据用户本条消息直接执行。

**步骤**

1. 阅读 active feature 的 `specs/features/<name>/` 下全部规格文件。
2. 阅读 `.ai/project-profile.md`、`.ai/rules/*`、`.ai/skills/*`。
3. 分析需创建/修改的文件、组件树、数据流和任务拆分。
4. 生成符合 Schema 的 JSON：`.ai/tmp/<feature-name>.plan.json`。
5. 执行 `ai-fe apply-plan .ai/tmp/<feature-name>.plan.json`。

**约束**

- 此阶段不要修改业务代码。
- Schema：`.ai/schemas/plan.schema.json`