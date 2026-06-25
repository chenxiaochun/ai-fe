# ai-fe

`ai-fe` 是一个 TypeScript CLI，用于给前端项目接入 AI-native 工程工作流。

它不替代 coding agent，而是生成上下文、规格、规则、计划、提示词、验证报告和经验记录，让 agent 的执行更可控、更可审查。

## 安装

npm 上包名为 `@chenxiaochun/ai-fe`（`ai-fe` 与已有包 `aife` 过于相似，需使用 scoped 名称）。安装后命令仍为 `ai-fe`：

```bash
npm install -g @chenxiaochun/ai-fe
```

本地开发或贡献代码：

```bash
git clone <repo-url>
cd ai-fe
npm install
npm run build
npm link
```

验证安装：

```bash
ai-fe doctor
```

## 快速开始

在目标前端项目根目录执行：

```bash
ai-fe init
ai-fe scan
```

`init` 会生成 `.ai/`、`specs/`、`verification/`，以及主流 Agent 客户端的工作流命令文件（默认全部生成）。

支持的 Agent 客户端：

| 客户端 | 生成路径 | 调用方式 |
|--------|----------|----------|
| Cursor | `.cursor/commands/` | `/ai-fe` |
| Claude Code | `.claude/commands/` | `/ai-fe` |
| Windsurf | `.windsurf/workflows/` | `/ai-fe` |
| GitHub Copilot | `.github/prompts/` | `/ai-fe` |
| Codex / OpenCode | `AGENTS.md` | 自动读取 |

仅生成指定客户端：

```bash
ai-fe init --agents cursor,claude
```

之后按工作流推进：

```bash
# 1. 创建功能规格（CLI 生成 Agent 任务，由当前 Agent 产出 spec JSON）
ai-fe create "创建用户管理页面，支持列表、搜索、新增和编辑"

# 2. Agent 生成 JSON 后落盘
ai-fe apply .ai/tmp/user-management.spec.json

# 3. 生成实施方案
ai-fe plan user-management
ai-fe apply-plan .ai/tmp/user-management.plan.json

# 4. 生成开发 Prompt，交给 Agent 实现
ai-fe prompt user-management

# 5. 验证与经验沉淀
ai-fe verify user-management
ai-fe learn user-management
```

查看当前功能状态：

```bash
ai-fe list
ai-fe status
ai-fe approve user-management   # 规格确认后标记为 approved
```

## 在 Agent 客户端中使用

`ai-fe init` 后，可在当前使用的 Agent 客户端中通过斜杠命令（或 `AGENTS.md`）接入工作流：

| 命令 | 用途 |
|------|------|
| `ai-fe` | 工作流入口与导航 |
| `ai-fe-create` | 创建功能规格 |
| `ai-fe-plan` | 生成实施方案 |
| `ai-fe-implement` | 按 Prompt 实现功能 |
| `ai-fe-verify` | 运行验证 |
| `ai-fe-learn` | 经验沉淀 |

推荐流程：`ai-fe-create` → `ai-fe-plan` → `ai-fe-implement` → `ai-fe-verify` → `ai-fe-learn`。

在 Cursor / Claude Code / Windsurf / Copilot 中输入 `/` 即可看到对应命令；Codex 等客户端会读取根目录 `AGENTS.md`。

## CLI 命令

```text
ai-fe init [--mode legacy|fresh] [--agents cursor,claude,windsurf,copilot,codex|all]
ai-fe scan
ai-fe create "<需求描述>" [--name feature-name]
ai-fe apply <spec-json-file> [--force]
ai-fe plan [feature-name]
ai-fe apply-plan <plan-json-file>
ai-fe prompt [feature-name] [--output .ai/prompts/name.md]
ai-fe verify [feature-name] [--skip test]
ai-fe learn [feature-name]
ai-fe list
ai-fe status
ai-fe approve [feature-name]
ai-fe adr new
ai-fe rules check
ai-fe doctor
```

## 工作流说明

CLI 负责脚手架、Schema 校验、文件落盘和验证执行；**智能分析由当前 Agent 完成**。

典型分工：

1. `create` / `plan` / `learn`：CLI 在 `.ai/tasks/` 生成任务文件，Agent 阅读后产出 JSON 或报告。
2. `apply` / `apply-plan`：CLI 校验 Schema 并写入 `specs/features/<name>/`。
3. `prompt`：CLI 组装开发 Prompt 到 `.ai/prompts/`。
4. `verify`：CLI 运行 `verification/config.json` 中的检查并生成报告。

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
.cursor/
  commands/          # Cursor 斜杠命令（init 时生成）
.claude/
  commands/          # Claude Code 斜杠命令
.windsurf/
  workflows/         # Windsurf Cascade 工作流
.github/
  prompts/           # GitHub Copilot prompt 文件
  copilot-instructions.md
AGENTS.md            # Codex / OpenCode 等客户端
specs/
  features/
  adr/
  product/
verification/
  config.json
  reports/
```

MVP 优先支持 React/TypeScript/Vite 风格项目，但生成文件都是纯文本，可按任意前端技术栈调整。

## 发布到 npm

项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本和 CHANGELOG。

维护者发布流程：

```bash
# 1. 记录本次变更（选择 major / minor / patch）
npm run changeset

# 2. 根据 changeset 更新版本号并生成 CHANGELOG
npm run version

# 3. 登录 npm（token 失效时需重新登录）
npm login
npm whoami

# 4. 构建并发布（会自动执行 prepublishOnly：build + test）
npm run release
```

发布前检查：

- `npm whoami` 能返回用户名（未登录会报 `E401`）
- `~/.npmrc` 中 **不要** 保留无效的 `home=...` 配置（旧 cnpm 残留会导致警告）
- registry 应为 `https://registry.npmjs.org`
- 包名使用 `@chenxiaochun/ai-fe`（npm 不允许发布与 `aife` 过于相似的 `ai-fe`）
- 确认 scoped 包可用：`npm view @chenxiaochun/ai-fe`

若 `npm login` 不方便，可在 [npmjs.com](https://www.npmjs.com/) 创建 Granular Token（Publish 权限），然后：

```bash
npm config set //registry.npmjs.org/:_authToken <你的 token>
```

## 本仓库开发

```bash
npm install
npm run build
npm test          # 运行 doctor
npm run dev -- init
```
