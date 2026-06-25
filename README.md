# ai-fe

`ai-fe` 是一个 TypeScript CLI，用于给前端项目接入 AI-native 工程工作流。

它不试图替代 coding agent，而是生成上下文、规格、规则、计划、提示词、验证报告和经验记录，让 agent 的执行更可控、更可审查。

## 命令

```bash
pnpm build
node dist/cli.js init --mode legacy
node dist/cli.js scan
node dist/cli.js create "创建用户管理页面，支持列表、搜索、新增和编辑"
node dist/cli.js apply .ai/tmp/user-management.spec.json
node dist/cli.js plan user-management
node dist/cli.js apply-plan .ai/tmp/user-management.plan.json
node dist/cli.js prompt user-management
node dist/cli.js verify user-management
node dist/cli.js learn user-management
node dist/cli.js adr new
node dist/cli.js rules check
node dist/cli.js doctor
```

发布或本地 link 之后，命令名是 `ai-fe`。

```bash
npm link
ai-fe doctor
```

## 发布到 npm

项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本和 CHANGELOG。

```bash
# 1. 记录本次变更（选择 major / minor / patch）
npm run changeset

# 2. 根据 changeset 更新版本号并生成 CHANGELOG
npm run version

# 3. 登录 npm（首次发布需要）
npm login

# 4. 构建并发布
npm run release
```

首次发布前请确认 npm 包名 `ai-fe` 可用：`npm view ai-fe`。

## 生成结构

```text
.ai/
  config.json
  state.json
  project-profile.md
  schemas/
  tasks/
  tmp/
  prompts/
  rules/
  skills/
  workflows/
  memory/
specs/
  features/
  adr/
verification/
  config.json
  reports/
```

MVP 优先支持 React/TypeScript/Vite 风格项目，但生成文件都是纯文本，可以按任意前端技术栈调整。
