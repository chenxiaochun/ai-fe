import * as path from "path";
import { ALL_AGENT_CLIENTS } from "../core/agent-integrations";
import { commandExists } from "../utils/exec";
import { pathExists, readJson } from "../utils/fs";
import { info } from "../utils/logger";

export function runDoctor(cwd: string): void {
  const scripts = loadScripts(cwd);
  const agentChecks = ALL_AGENT_CLIENTS.map(function(agent) {
    return [describeAgentCheck(agent, cwd), hasAgentIntegration(agent, cwd)] as const;
  });

  const checks: Array<[string, boolean]> = [
    ["已找到 node", commandExists("node")],
    ["已找到 TypeScript 编译器", commandExists("tsc")],
    ["已找到 package.json", pathExists(path.join(cwd, "package.json"))],
    ["已找到 .ai/config.json", pathExists(path.join(cwd, ".ai", "config.json"))],
    ["已找到 .ai/state.json", pathExists(path.join(cwd, ".ai", "state.json"))],
    ["feature-spec.schema.json 已生成", pathExists(path.join(cwd, ".ai", "schemas", "feature-spec.schema.json"))],
    ["plan.schema.json 已生成", pathExists(path.join(cwd, ".ai", "schemas", "plan.schema.json"))],
    ["已找到 specs/features", pathExists(path.join(cwd, "specs", "features"))],
    ["已找到 verification/config.json", pathExists(path.join(cwd, "verification", "config.json"))],
    ["已找到至少一种 Agent 集成", agentChecks.some(function(check) { return check[1]; })],
    ["build 命令已配置", Boolean(scripts.build)],
    ["lint 命令已配置", Boolean(scripts.lint)],
    ["typecheck 命令已配置", Boolean(scripts.typecheck)],
    ["test 命令已配置", Boolean(scripts.test)]
  ];

  info("ai-fe 项目检查\n");
  checks.forEach(function(check) {
    info((check[1] ? "✓ " : "! ") + check[0]);
  });

  info("\nAgent 集成：");
  agentChecks.forEach(function(check) {
    info((check[1] ? "✓ " : "- ") + check[0]);
  });
}

function describeAgentCheck(agent: (typeof ALL_AGENT_CLIENTS)[number], cwd: string): string {
  if (agent === "cursor") return "Cursor（.cursor/commands/ai-fe.md）";
  if (agent === "claude") return "Claude Code（.claude/commands/ai-fe.md）";
  if (agent === "windsurf") return "Windsurf（.windsurf/workflows/ai-fe.md）";
  if (agent === "copilot") return "GitHub Copilot（.github/prompts/ai-fe.prompt.md）";
  return "Codex / AGENTS.md";
}

function hasAgentIntegration(agent: (typeof ALL_AGENT_CLIENTS)[number], cwd: string): boolean {
  if (agent === "cursor") return pathExists(path.join(cwd, ".cursor", "commands", "ai-fe.md"));
  if (agent === "claude") return pathExists(path.join(cwd, ".claude", "commands", "ai-fe.md"));
  if (agent === "windsurf") return pathExists(path.join(cwd, ".windsurf", "workflows", "ai-fe.md"));
  if (agent === "copilot") return pathExists(path.join(cwd, ".github", "prompts", "ai-fe.prompt.md"));
  return pathExists(path.join(cwd, "AGENTS.md"));
}

function loadScripts(cwd: string): { [name: string]: string } {
  const packagePath = path.join(cwd, "package.json");
  if (!pathExists(packagePath)) return {};
  const pkg = readJson<{ scripts?: { [name: string]: string } }>(packagePath);
  return pkg.scripts || {};
}
