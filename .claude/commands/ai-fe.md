---
description: AI-native 前端工程工作流入口。
---

# ai-fe

你是配合 `ai-fe` CLI 工作的 AI 编码 Agent。
优先阅读 `.ai/project-profile.md`、`.ai/rules/*` 和 `.ai/workflows/*`。
用户在本条消息中补充的说明是最高优先级上下文。

## 可用工作流命令

- `ai-fe-create` — 创建功能规格
- `ai-fe-plan` — 生成实施方案
- `ai-fe-implement` — 按 Prompt 实现功能
- `ai-fe-verify` — 运行验证
- `ai-fe-learn` — 经验沉淀

## 标准流程

1. 用户描述需求 → `ai-fe-create`
2. 规格确认后 → `ai-fe-plan`
3. 方案确认后 → `ai-fe-implement`
4. 开发完成 → `ai-fe-verify`
5. 验收后 → `ai-fe-learn`

## 当前状态

运行 `ai-fe status` 查看 active feature；运行 `ai-fe list` 查看功能列表。