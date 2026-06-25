import { AiFeConfig, AiFeState, FeaturePreset, FeatureSpec, PlanSpec, VerificationConfig } from "../types";

export function defaultConfig(mode: "legacy" | "fresh"): AiFeConfig {
  return {
    schema: "ai-fe/config@0.1",
    mode: mode,
    agent: {
      mode: "external",
      taskDir: ".ai/tasks",
      schemaDir: ".ai/schemas",
      tmpDir: ".ai/tmp",
      requireUserApproval: true
    },
    spec: {
      defaultStatus: "draft",
      requireApprovalBeforePlan: true,
      requireApprovalBeforePrompt: true
    },
    project: {
      sourceDir: "src",
      featureDir: "src/features",
      specDir: "specs/features"
    },
    verification: {
      commands: {
        typecheck: "npm run typecheck",
        lint: "npm run lint",
        test: "npm test",
        build: "npm run build"
      }
    },
    safety: {
      protectedFiles: ["src/services/http.ts", "src/stores/auth.ts", "src/config/env.ts"],
      legacyZones: ["src/old-pages/**"]
    }
  };
}

export function defaultState(): AiFeState {
  return {
    schema: "ai-fe/state@0.1",
    activeFeature: null,
    recentFeatures: []
  };
}

export function defaultVerificationConfig(): VerificationConfig {
  return {
    schema: "ai-fe/verification@0.1",
    checks: [
      { name: "typecheck", command: "npm run typecheck", required: true },
      { name: "lint", command: "npm run lint", required: true },
      { name: "test", command: "npm test", required: false },
      { name: "build", command: "npm run build", required: true }
    ],
    architecture: {
      rules: [
        { name: "presentational-components-no-api-import", enabled: true },
        { name: "no-cross-feature-import", enabled: true }
      ]
    }
  };
}

export function defaultFeatureSpec(id: string, preset: FeaturePreset): FeatureSpec {
  const title = toTitle(id);
  const commonStates = ["加载中", "空状态", "错误状态", "就绪"];
  const crudCapabilities = ["列表", "搜索", "分页", "新增", "编辑"];
  const now = new Date().toISOString();

  return {
    schema: "ai-fe/feature@0.1",
    id: id,
    name: id,
    title: title,
    type: preset,
    status: "draft",
    route: "/" + id,
    goal: "待补充",
    users: [],
    capabilities: preset === "crud-page" ? crudCapabilities : presetCapabilities(preset),
    inScope: [],
    outOfScope: [],
    states: preset === "crud-page" ? commonStates.concat(["搜索中", "提交中"]) : commonStates,
    modalStates: [],
    components: [],
    apiDependencies: [],
    dataOwnership: {},
    permissions: [],
    behaviors: [],
    failurePolicy: {
      submitFailed: "保留输入并展示错误"
    },
    acceptanceCriteria: acceptanceForPreset(preset),
    verification: {
      requiredChecks: ["typecheck", "lint", "build"],
      acceptanceTests: [],
      architectureChecks: []
    },
    assumptions: [],
    todos: [],
    risks: [],
    createdAt: now,
    updatedAt: now
  };
}

export function defaultPlanSpec(featureId: string): PlanSpec {
  const now = new Date().toISOString();
  return {
    schema: "ai-fe/plan@0.1",
    featureId: featureId,
    summary: "待补充",
    filesToCreate: [],
    filesToModify: [],
    stateOwnership: [],
    implementationTasks: [],
    risks: [],
    rulesToFollow: [],
    createdAt: now,
    updatedAt: now
  };
}

export function featureSpecJsonSchema(): object {
  return {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    title: "功能规格",
    type: "object",
    required: ["schema", "id", "name", "title", "type", "status", "goal", "createdAt", "updatedAt"],
    properties: {
      schema: { const: "ai-fe/feature@0.1" },
      id: { type: "string", pattern: "^[a-z][a-z0-9-]{1,39}$" },
      name: { type: "string", pattern: "^[a-z][a-z0-9-]{1,39}$" },
      title: { type: "string" },
      type: { enum: ["basic-page", "list-page", "crud-page", "form-page", "modal-form", "detail-page", "settings-page", "dashboard-page", "auth-page", "wizard-flow", "custom"] },
      status: { enum: ["draft", "approved", "planned", "prompted", "implemented", "verified", "learned"] },
      route: { type: "string" },
      goal: { type: "string" },
      users: { type: "array", items: { type: "string" } },
      capabilities: { type: "array", items: { type: "string" } },
      inScope: { type: "array", items: { type: "string" } },
      outOfScope: { type: "array", items: { type: "string" } },
      states: { type: "array", items: { type: "string" } },
      acceptanceCriteria: { type: "array", items: { type: "string" } },
      createdAt: { type: "string" },
      updatedAt: { type: "string" }
    }
  };
}

export function planJsonSchema(): object {
  return {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    title: "实施方案",
    type: "object",
    required: ["schema", "featureId", "summary", "createdAt", "updatedAt"],
    properties: {
      schema: { const: "ai-fe/plan@0.1" },
      featureId: { type: "string", pattern: "^[a-z][a-z0-9-]{1,39}$" },
      summary: { type: "string" },
      filesToCreate: { type: "array", items: { type: "string" } },
      filesToModify: { type: "array", items: { type: "string" } },
      componentTree: { type: "string" },
      dataFlow: { type: "string" },
      stateOwnership: { type: "array", items: { type: "string" } },
      implementationTasks: { type: "array" },
      risks: { type: "array", items: { type: "string" } },
      rulesToFollow: { type: "array", items: { type: "string" } },
      createdAt: { type: "string" },
      updatedAt: { type: "string" }
    }
  };
}

export function ruleTemplates(): Array<{ path: string; content: string }> {
  return [
    {
      path: ".ai/rules/change-safety.md",
      content: "# 变更安全规则\n\n- 不要重构无关代码。\n- 未经明确批准，不要修改受保护文件。\n- 变更范围应限制在当前功能内。\n- 优先提交小而可审查的 diff。\n"
    },
    {
      path: ".ai/rules/architecture.md",
      content: "# 架构规则\n\n- 路由级组合逻辑应靠近 routes/pages。\n- 可复用 UI 应放在 shared components 中。\n- 除非依赖被明确抽为共享模块，否则避免跨 feature import。\n"
    },
    {
      path: ".ai/rules/component.md",
      content: "# 组件规则\n\n- 展示组件不应直接调用 API。\n- 适用时，组件必须覆盖加载、空态、错误态和就绪态。\n- Props 应保持明确且有类型。\n"
    },
    {
      path: ".ai/rules/api.md",
      content: "# API 规则\n\n- 使用项目已有请求客户端。\n- 请求和响应类型必须明确。\n- Mutation 失败不得重置表单状态。\n- 只有确认成功后才重置表单。\n"
    },
    {
      path: ".ai/rules/testing.md",
      content: "# 测试规则\n\n- 对变更行为增加回归覆盖。\n- 优先使用用户可见行为断言。\n- 功能标记完成前必须运行验证。\n"
    }
  ];
}

export function skillTemplates(): Array<{ path: string; content: string }> {
  return [
    skill("build-page", "创建或修改路由级页面时使用。", [
      "从功能规格开始。",
      "实现所有必需 UI 状态。",
      "数据加载逻辑应与展示组件分离。"
    ]),
    skill("build-form", "创建新增/编辑表单时使用。", [
      "提交失败时保留用户输入。",
      "只有 mutation 成功后才关闭和重置。",
      "展示字段级和表单级错误。"
    ]),
    skill("integrate-api", "将功能连接到 API 数据时使用。", [
      "使用已有请求客户端。",
      "定义带类型的 API 函数和 hooks。",
      "mutation 成功后失效相关查询。"
    ]),
    skill("write-test", "增加功能验证时使用。", [
      "覆盖验收标准。",
      "测试错误态和空态。",
      "优先验证行为，而不是实现细节。"
    ]),
    skill("refactor-safely", "触碰遗留代码时使用。", [
      "除非明确要求，否则保持行为不变。",
      "避免重命名公共 API。",
      "不要把大范围清理和功能开发混在一起。"
    ])
  ];
}

export function workflowTemplates(): Array<{ path: string; content: string }> {
  return ["create", "apply", "plan", "prompt", "verify", "learn"].map(function(name) {
    return {
      path: ".ai/workflows/" + name + ".md",
      content: "# 工作流：" + name + "\n\n该工作流由 `ai-fe " + name.replace("-", " ") + "` 管理。\n"
    };
  });
}

export function cursorCommandTemplates(): Array<{ path: string; content: string }> {
  return [
    cursorCommand("ai-fe", "AI-FE", "AI-native 前端工程工作流入口。", [
      "你是配合 `ai-fe` CLI 工作的 AI 编码 Agent。",
      "优先阅读 `.ai/project-profile.md`、`.ai/rules/*` 和 `.ai/workflows/*`。",
      "用户在本条消息中补充的说明是最高优先级上下文。",
      "",
      "## 可用斜杠命令",
      "",
      "- `/ai-fe-create` — 创建功能规格",
      "- `/ai-fe-plan` — 生成实施方案",
      "- `/ai-fe-implement` — 按 Prompt 实现功能",
      "- `/ai-fe-verify` — 运行验证",
      "- `/ai-fe-learn` — 经验沉淀",
      "",
      "## 标准流程",
      "",
      "1. 用户描述需求 → `/ai-fe-create`",
      "2. 规格确认后 → `/ai-fe-plan`",
      "3. 方案确认后 → `/ai-fe-implement`",
      "4. 开发完成 → `/ai-fe-verify`",
      "5. 验收后 → `/ai-fe-learn`",
      "",
      "## 当前状态",
      "",
      "运行 `ai-fe status` 查看 active feature；运行 `ai-fe list` 查看功能列表。"
    ]),
    cursorCommand("ai-fe-create", "AI-FE", "创建功能规格并落盘到 specs/features/。", [
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
    ]),
    cursorCommand("ai-fe-plan", "AI-FE", "基于功能规格生成实施方案。", [
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
    ]),
    cursorCommand("ai-fe-implement", "AI-FE", "按 Prompt 和 tasks 实现当前功能。", [
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
    ]),
    cursorCommand("ai-fe-verify", "AI-FE", "运行验证并生成报告。", [
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
    ]),
    cursorCommand("ai-fe-learn", "AI-FE", "沉淀本次功能经验到规则与技能。", [
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
    ])
  ];
}

function cursorCommand(id: string, category: string, description: string, lines: string[]): { path: string; content: string } {
  return {
    path: ".cursor/commands/" + id + ".md",
    content: [
      "---",
      "name: /" + id,
      "id: " + id,
      "category: " + category,
      "description: " + description,
      "---",
      "",
      "# " + id,
      "",
      lines.join("\n")
    ].join("\n")
  };
}

function skill(name: string, description: string, rules: string[]): { path: string; content: string } {
  return {
    path: ".ai/skills/" + name + "/SKILL.md",
    content:
      "---\nname: " +
      name +
      "\ndescription: " +
      description +
      "\n---\n\n# 技能：" +
      toTitle(name) +
      "\n\n## 必须遵守\n\n" +
      rules.map(function(rule) {
        return "- " + rule;
      }).join("\n") +
      "\n\n## 必须输出\n\n- 变更文件\n- 验证命令\n- 风险\n"
  };
}

function presetCapabilities(preset: FeaturePreset): string[] {
  if (preset === "list-page") return ["列表", "搜索", "分页"];
  if (preset === "form-page" || preset === "modal-form") return ["校验", "提交"];
  if (preset === "detail-page") return ["加载详情"];
  if (preset === "dashboard-page") return ["加载组件", "刷新"];
  if (preset === "auth-page") return ["提交", "校验", "跳转"];
  if (preset === "wizard-flow") return ["步骤导航", "校验", "提交"];
  return ["渲染"];
}

function acceptanceForPreset(preset: FeaturePreset): string[] {
  if (preset === "crud-page") {
    return [
      "首次加载时展示加载状态",
      "无记录时展示空状态",
      "API 失败时展示错误状态",
      "搜索后页码重置为 1",
      "新增失败时保留输入",
      "编辑失败时保留输入"
    ];
  }
  return ["展示加载状态", "展示错误状态", "渲染就绪状态", "符合功能范围"];
}

function toTitle(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(function(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
