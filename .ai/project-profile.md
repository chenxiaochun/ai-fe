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
- src/commands/workflow.ts
- src/core/config.ts
- src/core/feature-files.ts
- src/core/project-scan.ts
- src/core/tasks.ts
- src/core/templates.ts
- src/core/validation.ts
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
