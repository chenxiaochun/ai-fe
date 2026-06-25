---
name: ai-fe-implement
description: 按 Prompt 和 tasks 实现当前功能。
agent: agent
---

# ai-fe-implement

先运行 `ai-fe prompt [feature-name]` 生成开发 Prompt，或读取 `.ai/prompts/<feature-name>.md`。

**步骤**

1. 阅读 `.ai/prompts/<feature-name>.md` 或 `specs/features/<name>/tasks.md`。
2. 按 tasks 顺序实现，保持变更范围最小。
3. 遵守 `.ai/rules/*` 和项目既有模式。
4. 补充验收标准对应的测试。
5. 完成后汇报：变更文件、假设、未解决问题、建议验证命令。

**硬性约束**

- 不要实现范围外功能。
- 不要顺手重构无关文件。
- 展示组件不能直接请求 API。
- 表单提交失败必须保留用户输入。