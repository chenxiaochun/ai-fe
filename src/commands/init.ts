import * as path from "path";
import { ParsedArgs, ProjectMode } from "../types";
import {
  AGENT_CLIENT_LABELS,
  agentIntegrationDirs,
  agentIntegrationTemplates,
  parseAgentClients
} from "../core/agent-integrations";
import {
  defaultConfig,
  defaultState,
  defaultVerificationConfig,
  featureSpecJsonSchema,
  planJsonSchema,
  ruleTemplates,
  skillTemplates,
  workflowTemplates
} from "../core/templates";
import { ensureDir, pathExists, writeJson, writeText } from "../utils/fs";
import { info } from "../utils/logger";

export function runInit(cwd: string, args: ParsedArgs): void {
  const mode = parseMode(args.flags.mode);
  const agents = parseAgentClients(args.flags.agents || args.flags.agent);

  ensureDir(path.join(cwd, ".ai", "memory"));
  ensureDir(path.join(cwd, ".ai", "schemas"));
  ensureDir(path.join(cwd, ".ai", "tasks"));
  ensureDir(path.join(cwd, ".ai", "tmp"));
  ensureDir(path.join(cwd, ".ai", "prompts"));
  ensureDir(path.join(cwd, "specs", "features"));
  ensureDir(path.join(cwd, "specs", "adr"));
  ensureDir(path.join(cwd, "specs", "product"));
  ensureDir(path.join(cwd, "verification", "reports"));
  ensureDir(path.join(cwd, "verification", "scripts"));

  agentIntegrationDirs(agents).forEach(function(dir) {
    ensureDir(path.join(cwd, dir));
  });

  writeIfMissing(path.join(cwd, ".ai", "config.json"), function() {
    writeJson(path.join(cwd, ".ai", "config.json"), defaultConfig(mode));
  });
  writeIfMissing(path.join(cwd, "verification", "config.json"), function() {
    writeJson(path.join(cwd, "verification", "config.json"), defaultVerificationConfig());
  });
  writeIfMissing(path.join(cwd, ".ai", "state.json"), function() {
    writeJson(path.join(cwd, ".ai", "state.json"), defaultState());
  });
  writeJson(path.join(cwd, ".ai", "schemas", "feature-spec.schema.json"), featureSpecJsonSchema());
  writeJson(path.join(cwd, ".ai", "schemas", "plan.schema.json"), planJsonSchema());
  writeIfMissing(path.join(cwd, ".ai", "project-profile.md"), function() {
    writeText(path.join(cwd, ".ai", "project-profile.md"), "# 项目画像\n\n运行 `ai-fe scan` 填充此文件。\n");
  });
  writeIfMissing(path.join(cwd, ".ai", "memory", "decisions.jsonl"), function() {
    writeText(path.join(cwd, ".ai", "memory", "decisions.jsonl"), "");
  });
  writeIfMissing(path.join(cwd, ".ai", "memory", "patterns.jsonl"), function() {
    writeText(path.join(cwd, ".ai", "memory", "patterns.jsonl"), "");
  });
  writeIfMissing(path.join(cwd, ".ai", "memory", "mistakes.jsonl"), function() {
    writeText(path.join(cwd, ".ai", "memory", "mistakes.jsonl"), "");
  });
  writeText(path.join(cwd, "specs", "features", ".gitkeep"), "");
  writeText(path.join(cwd, "specs", "adr", ".gitkeep"), "");
  writeText(path.join(cwd, "specs", "product", ".gitkeep"), "");

  ruleTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  skillTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  workflowTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  agentIntegrationTemplates(agents).forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  info(
    [
      "ai-fe 初始化完成。",
      "",
      "已创建：",
      "- .ai/config.json",
      "- .ai/state.json",
      "- .ai/schemas/feature-spec.schema.json",
      "- .ai/schemas/plan.schema.json",
      "- specs/",
      "- verification/",
      "",
      "已生成 Agent 集成（" + agents.map(function(agent) { return AGENT_CLIENT_LABELS[agent]; }).join("、") + "）：",
      ...describeAgentOutputs(agents),
      "",
      "下一步：",
      "- ai-fe scan",
      "- 在当前 Agent 客户端中使用 ai-fe 工作流命令",
      "- ai-fe create \"你的功能需求\""
    ].join("\n")
  );
}

function describeAgentOutputs(agents: ReturnType<typeof parseAgentClients>): string[] {
  const lines: string[] = [];

  agents.forEach(function(agent) {
    if (agent === "cursor") lines.push("- .cursor/commands/ai-fe*.md（斜杠命令 /ai-fe*）");
    if (agent === "claude") lines.push("- .claude/commands/ai-fe*.md（斜杠命令 /ai-fe*）");
    if (agent === "windsurf") lines.push("- .windsurf/workflows/ai-fe*.md（斜杠命令 /ai-fe*）");
    if (agent === "copilot") {
      lines.push("- .github/prompts/ai-fe*.prompt.md（斜杠命令 /ai-fe*）");
      lines.push("- .github/copilot-instructions.md");
    }
    if (agent === "codex") lines.push("- AGENTS.md");
  });

  return lines;
}

function parseMode(value: string | boolean | undefined): ProjectMode {
  return value === "fresh" ? "fresh" : "legacy";
}

function writeIfMissing(filePath: string, write: () => void): void {
  if (!pathExists(filePath)) write();
}
