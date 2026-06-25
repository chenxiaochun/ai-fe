export type AgentClient = "cursor" | "claude" | "windsurf" | "copilot" | "codex";

export const ALL_AGENT_CLIENTS: AgentClient[] = ["cursor", "claude", "windsurf", "copilot", "codex"];

export const AGENT_CLIENT_LABELS: Record<AgentClient, string> = {
  cursor: "Cursor",
  claude: "Claude Code",
  windsurf: "Windsurf Cascade",
  copilot: "GitHub Copilot",
  codex: "Codex / OpenCode (AGENTS.md)"
};

interface AgentCommandDef {
  id: string;
  description: string;
  lines: string[];
}

export function parseAgentClients(value: string | boolean | undefined): AgentClient[] {
  if (!value || value === true || value === "all") return ALL_AGENT_CLIENTS.slice();

  const raw = String(value)
    .split(",")
    .map(function(part) {
      return part.trim().toLowerCase();
    })
    .filter(Boolean);

  const clients: AgentClient[] = [];
  const unknown: string[] = [];

  raw.forEach(function(name) {
    if (isAgentClient(name)) {
      if (clients.indexOf(name) < 0) clients.push(name);
      return;
    }
    unknown.push(name);
  });

  if (unknown.length > 0) {
    throw new Error(
      "未知 agent 客户端：" +
        unknown.join(", ") +
        "。可选值：cursor, claude, windsurf, copilot, codex, all"
    );
  }

  if (clients.length === 0) {
    throw new Error("请至少指定一个 agent 客户端，或使用 --agents all。");
  }

  return clients;
}

export function agentIntegrationTemplates(clients: AgentClient[]): Array<{ path: string; content: string }> {
  const templates: Array<{ path: string; content: string }> = [];

  clients.forEach(function(client) {
    if (client === "codex") {
      templates.push({ path: "AGENTS.md", content: agentsMdContent() });
      return;
    }

    if (client === "copilot") {
      templates.push({
        path: ".github/copilot-instructions.md",
        content: copilotInstructionsContent()
      });
    }

    agentCommandDefinitions().forEach(function(def) {
      templates.push(formatAgentCommand(client, def));
    });
  });

  return templates;
}

export function agentIntegrationDirs(clients: AgentClient[]): string[] {
  const dirs = new Set<string>();

  clients.forEach(function(client) {
    if (client === "cursor") dirs.add(".cursor/commands");
    if (client === "claude") dirs.add(".claude/commands");
    if (client === "windsurf") dirs.add(".windsurf/workflows");
    if (client === "copilot") {
      dirs.add(".github/prompts");
      dirs.add(".github");
    }
  });

  return Array.from(dirs);
}

function isAgentClient(value: string): value is AgentClient {
  return ALL_AGENT_CLIENTS.indexOf(value as AgentClient) >= 0;
}

function agentCommandDefinitions(): AgentCommandDef[] {
  return [
    {
      id: "ai-fe",
      description: "AI-native 前端工程工作流入口。",
      lines: [
        "你是配合 `ai-fe` CLI 工作的 AI 编码 Agent。",
        "优先阅读 `.ai/project-profile.md`、`.ai/rules/*` 和 `.ai/workflows/*`。",
        "用户在本条消息中补充的说明是最高优先级上下文。",
        "",
        "## 可用工作流命令",
        "",
        "- `ai-fe-create` — 创建功能规格",
        "- `ai-fe-plan` — 生成实施方案",
        "- `ai-fe-implement` — 按 Prompt 实现功能",
        "- `ai-fe-verify` — 运行验证",
        "- `ai-fe-learn` — 经验沉淀",
        "",
        "## 标准流程",
        "",
        "1. 用户描述需求 → `ai-fe-create`",
        "2. 规格确认后 → `ai-fe-plan`",
        "3. 方案确认后 → `ai-fe-implement`",
        "4. 开发完成 → `ai-fe-verify`",
        "5. 验收后 → `ai-fe-learn`",
        "",
        "## 当前状态",
        "",
        "运行 `ai-fe status` 查看 active feature；运行 `ai-fe list` 查看功能列表。"
      ]
    },
    {
      id: "ai-fe-create",
      description: "创建功能规格并落盘到 specs/features/。",
      lines: [
        "先运行 `ai-fe create \"<需求描述>\"` 生成任务文件，或根据用户本条消息直接执行。",
        "",
        "**步骤**",
        "",
        "1. 阅读 `.ai/tasks/` 下最新 create 任务（若存在）。",
        "2. 与用户确认功能名称、范围、状态、权限、接口和验收标准。",
        "3. 生成符合 Schema 的 JSON：`.ai/tmp/<feature-name>.spec.json`。",
        "4. 执行 `ai-fe apply .ai/tmp/<feature-name>.spec.json`。",
        "",
        "**约束**",
        "",
        "- 功能名必须符合 `^[a-z][a-z0-9-]{1,39}$`。",
        "- 用户可见内容使用中文；路径和标识使用英文。",
        "- 此阶段不要修改业务代码。",
        "- Schema：`.ai/schemas/feature-spec.schema.json`"
      ]
    },
    {
      id: "ai-fe-plan",
      description: "基于功能规格生成实施方案。",
      lines: [
        "先运行 `ai-fe plan [feature-name]` 生成任务文件，或根据用户本条消息直接执行。",
        "",
        "**步骤**",
        "",
        "1. 阅读 active feature 的 `specs/features/<name>/` 下全部规格文件。",
        "2. 阅读 `.ai/project-profile.md`、`.ai/rules/*`、`.ai/skills/*`。",
        "3. 分析需创建/修改的文件、组件树、数据流和任务拆分。",
        "4. 生成符合 Schema 的 JSON：`.ai/tmp/<feature-name>.plan.json`。",
        "5. 执行 `ai-fe apply-plan .ai/tmp/<feature-name>.plan.json`。",
        "",
        "**约束**",
        "",
        "- 此阶段不要修改业务代码。",
        "- Schema：`.ai/schemas/plan.schema.json`"
      ]
    },
    {
      id: "ai-fe-implement",
      description: "按 Prompt 和 tasks 实现当前功能。",
      lines: [
        "先运行 `ai-fe prompt [feature-name]` 生成开发 Prompt，或读取 `.ai/prompts/<feature-name>.md`。",
        "",
        "**步骤**",
        "",
        "1. 阅读 `.ai/prompts/<feature-name>.md` 或 `specs/features/<name>/tasks.md`。",
        "2. 按 tasks 顺序实现，保持变更范围最小。",
        "3. 遵守 `.ai/rules/*` 和项目既有模式。",
        "4. 补充验收标准对应的测试。",
        "5. 完成后汇报：变更文件、假设、未解决问题、建议验证命令。",
        "",
        "**硬性约束**",
        "",
        "- 不要实现范围外功能。",
        "- 不要顺手重构无关文件。",
        "- 展示组件不能直接请求 API。",
        "- 表单提交失败必须保留用户输入。"
      ]
    },
    {
      id: "ai-fe-verify",
      description: "运行验证并生成报告。",
      lines: [
        "**步骤**",
        "",
        "1. 确认 active feature（`ai-fe status`）。",
        "2. 执行 `ai-fe verify [feature-name]`。",
        "3. 阅读 `specs/features/<name>/verify-report.md` 和 `verification/reports/<name>.md`。",
        "4. 若验证失败，修复问题后重新验证。",
        "",
        "**约束**",
        "",
        "- 功能标记完成前必须跑通 required checks。",
        "- 不要跳过架构检查和验收测试。"
      ]
    },
    {
      id: "ai-fe-learn",
      description: "沉淀本次功能经验到规则与技能。",
      lines: [
        "先运行 `ai-fe learn [feature-name]` 生成任务文件，或根据用户本条消息直接执行。",
        "",
        "**步骤**",
        "",
        "1. 阅读 `specs/features/<name>/` 下的 spec、plan、tasks、verify-report。",
        "2. 查看 git diff（如可访问）。",
        "3. 生成或更新 `specs/features/<name>/learn-report.md`。",
        "4. 提出可更新的 rules、skills、ADR 和测试模式建议。",
        "",
        "**约束**",
        "",
        "- 只沉淀可复用、可审查的经验。",
        "- 用户可见内容使用中文。"
      ]
    }
  ];
}

function formatAgentCommand(client: AgentClient, def: AgentCommandDef): { path: string; content: string } {
  const body = ["# " + def.id, "", def.lines.join("\n")].join("\n");

  if (client === "cursor") {
    return {
      path: ".cursor/commands/" + def.id + ".md",
      content: [
        "---",
        "name: /" + def.id,
        "id: " + def.id,
        "category: AI-FE",
        "description: " + def.description,
        "---",
        "",
        body
      ].join("\n")
    };
  }

  if (client === "claude") {
    return {
      path: ".claude/commands/" + def.id + ".md",
      content: ["---", "description: " + def.description, "---", "", body].join("\n")
    };
  }

  if (client === "windsurf") {
    return {
      path: ".windsurf/workflows/" + def.id + ".md",
      content: ["---", "description: " + def.description, "---", "", body].join("\n")
    };
  }

  return {
    path: ".github/prompts/" + def.id + ".prompt.md",
    content: [
      "---",
      "name: " + def.id,
      "description: " + def.description,
      "agent: agent",
      "---",
      "",
      body
    ].join("\n")
  };
}

function copilotInstructionsContent(): string {
  return [
    "# ai-fe 工作流",
    "",
    "本项目使用 `ai-fe` CLI 管理 AI-native 前端工程工作流。",
    "",
    "## 开始前先读",
    "",
    "- `.ai/project-profile.md`",
    "- `.ai/rules/*`",
    "- `.ai/workflows/*`",
    "",
    "## 推荐流程",
    "",
    "1. `ai-fe create \"<需求>\"` → Agent 产出 spec JSON → `ai-fe apply`",
    "2. `ai-fe plan` → Agent 产出 plan JSON → `ai-fe apply-plan`",
    "3. `ai-fe prompt` → Agent 按 tasks 实现",
    "4. `ai-fe verify`",
    "5. `ai-fe learn`",
    "",
    "在 Copilot Chat 中可使用 `/ai-fe`、`/ai-fe-create` 等工作流 prompt。",
    "用户可见内容使用中文；路径、标识和命令使用英文。"
  ].join("\n");
}

function agentsMdContent(): string {
  return [
    "# ai-fe Agent 指南",
    "",
    "你是配合 `ai-fe` CLI 工作的 AI 编码 Agent。",
    "",
    "## 必读上下文",
    "",
    "- `.ai/project-profile.md` — 项目画像",
    "- `.ai/rules/*` — 架构与变更规则",
    "- `.ai/workflows/*` — 各阶段工作流说明",
    "- `.ai/skills/*` — 可复用技能",
    "",
    "## 标准流程",
    "",
    "1. 用户描述需求 → 运行 `ai-fe create \"<需求>\"`，产出 `.ai/tmp/<feature>.spec.json` 后执行 `ai-fe apply`",
    "2. 规格确认后 → `ai-fe plan`，产出 plan JSON 后执行 `ai-fe apply-plan`",
    "3. 方案确认后 → `ai-fe prompt`，按 `.ai/prompts/<feature>.md` 实现",
    "4. 开发完成 → `ai-fe verify`",
    "5. 验收后 → `ai-fe learn`",
    "",
    "## 硬性约束",
    "",
    "- 不要实现范围外功能，不要顺手重构无关文件",
    "- 展示组件不能直接请求 API",
    "- 表单提交失败必须保留用户输入",
    "- 用户可见内容使用中文；路径和标识使用英文",
    "",
    "## 状态查询",
    "",
    "- `ai-fe status` — 当前 active feature",
    "- `ai-fe list` — 功能列表"
  ].join("\n");
}

// Backward-compatible export for existing imports.
export function cursorCommandTemplates(): Array<{ path: string; content: string }> {
  return agentIntegrationTemplates(["cursor"]);
}
