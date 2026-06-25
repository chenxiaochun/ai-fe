# ai-fe Agent 指南

你是配合 `ai-fe` CLI 工作的 AI 编码 Agent。

## 必读上下文

- `.ai/project-profile.md` — 项目画像
- `.ai/rules/*` — 架构与变更规则
- `.ai/workflows/*` — 各阶段工作流说明
- `.ai/skills/*` — 可复用技能

## 标准流程

1. 用户描述需求 → 运行 `ai-fe create "<需求>"`，产出 `.ai/tmp/<feature>.spec.json` 后执行 `ai-fe apply`
2. 规格确认后 → `ai-fe plan`，产出 plan JSON 后执行 `ai-fe apply-plan`
3. 方案确认后 → `ai-fe prompt`，按 `.ai/prompts/<feature>.md` 实现
4. 开发完成 → `ai-fe verify`
5. 验收后 → `ai-fe learn`

## 硬性约束

- 不要实现范围外功能，不要顺手重构无关文件
- 展示组件不能直接请求 API
- 表单提交失败必须保留用户输入
- 用户可见内容使用中文；路径和标识使用英文

## 状态查询

- `ai-fe status` — 当前 active feature
- `ai-fe list` — 功能列表