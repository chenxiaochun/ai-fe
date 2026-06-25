# Agent 提示词：User Management

你正在这个前端项目中实现功能 `user-management`。

## 功能规格

# 功能规格：User Management

- ID: `user-management`
- 类型：`crud-page`
- 状态：`draft`
- 路由：`/user-management`

## 范围

能力：
- 列表
- 搜索
- 分页
- 新增
- 编辑

不在范围内：
- 待补充

## 备注

- 待补充

## UI 规格

# UI 规格：User Management

## 必需状态

- 加载中
- 空状态
- 错误状态
- 就绪
- 搜索中
- 提交中

## 行为规格

# 行为规格：User Management

## 验收标准

- 首次加载时展示加载状态
- 无记录时展示空状态
- API 失败时展示错误状态
- 搜索后页码重置为 1
- 新增失败时保留输入
- 编辑失败时保留输入

## 实现计划

# 实现计划：User Management

## 实现策略

- 确认现有路由和功能边界。
- 按当前项目已有模式实现功能。
- 覆盖必需 UI 状态：加载中、空状态、错误状态、就绪、搜索中、提交中。
- API 集成保持类型明确，并放在展示组件之外。
- 运行验证并更新报告。

## 需要查看的文件

- `.ai/project-profile.md`
- `.ai/rules/*`
- `.ai/skills/*`
- 现有路由和功能目录

## 项目画像

# 项目画像

由 `ai-fe scan` 生成。

## 技术栈

- Vite
- TypeScript

## 命令

- dev: `tsc -p tsconfig.json && node dist/cli.js`
- build: `tsc -p tsconfig.json`
- typecheck: `tsc -p tsconfig.json --noEmit`
- lint: `tsc -p tsconfig.json --noEmit`
- test: `node dist/cli.js doctor`

## 目录信号

- package.json
- src/args.ts
- src/cli.ts
- src/commands/adr.ts
- src/commands/doctor.ts
- src/commands/feature.ts
- src/commands/init.ts
- src/commands/rules.ts
- src/commands/scan.ts
- src/core/config.ts
- src/core/feature-files.ts
- src/core/project-scan.ts
- src/core/templates.ts
- src/core/verify.ts
- src/node-shims.d.ts
- src/types.ts
- src/utils/exec.ts
- src/utils/fs.ts
- src/utils/logger.ts
- src/utils/prompt.ts
- tsconfig.json

## 当前风险

- 大范围重构前先确认受保护文件。
- UI 变更需要确认加载、空态、错误态和权限显隐。
- 如果自动识别不完整，请在 `verification/config.json` 中补充缺失脚本。

## AI 约束

- 不要重构无关文件。
- 优先沿用本项目已有模式，不要随意引入新架构。
- 汇报完成前必须运行验证。

## 约束

- 不要重构无关文件。
- 提交失败时必须保留用户输入。
- 汇报完成前必须运行验证。
