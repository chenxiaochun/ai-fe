# ai-fe 工作流

本项目使用 `ai-fe` CLI 管理 AI-native 前端工程工作流。

## 开始前先读

- `.ai/project-profile.md`
- `.ai/rules/*`
- `.ai/workflows/*`

## 推荐流程

1. `ai-fe create "<需求>"` → Agent 产出 spec JSON → `ai-fe apply`
2. `ai-fe plan` → Agent 产出 plan JSON → `ai-fe apply-plan`
3. `ai-fe prompt` → Agent 按 tasks 实现
4. `ai-fe verify`
5. `ai-fe learn`

在 Copilot Chat 中可使用 `/ai-fe`、`/ai-fe-create` 等工作流 prompt。
用户可见内容使用中文；路径、标识和命令使用英文。