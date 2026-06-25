import * as path from "path";
import { commandExists } from "../utils/exec";
import { pathExists, readJson } from "../utils/fs";
import { info } from "../utils/logger";

export function runDoctor(cwd: string): void {
  const scripts = loadScripts(cwd);
  const checks = [
    ["已找到 node", commandExists("node")],
    ["已找到 TypeScript 编译器", commandExists("tsc")],
    ["已找到 package.json", pathExists(path.join(cwd, "package.json"))],
    ["已找到 .ai/config.json", pathExists(path.join(cwd, ".ai", "config.json"))],
    ["已找到 .ai/state.json", pathExists(path.join(cwd, ".ai", "state.json"))],
    ["feature-spec.schema.json 已生成", pathExists(path.join(cwd, ".ai", "schemas", "feature-spec.schema.json"))],
    ["plan.schema.json 已生成", pathExists(path.join(cwd, ".ai", "schemas", "plan.schema.json"))],
    ["已找到 specs/features", pathExists(path.join(cwd, "specs", "features"))],
    ["已找到 verification/config.json", pathExists(path.join(cwd, "verification", "config.json"))],
    ["已找到 .cursor/commands/ai-fe.md", pathExists(path.join(cwd, ".cursor", "commands", "ai-fe.md"))],
    ["build 命令已配置", Boolean(scripts.build)],
    ["lint 命令已配置", Boolean(scripts.lint)],
    ["typecheck 命令已配置", Boolean(scripts.typecheck)],
    ["test 命令已配置", Boolean(scripts.test)]
  ];

  info("ai-fe 项目检查\n");
  checks.forEach(function(check) {
    info((check[1] ? "✓ " : "! ") + check[0]);
  });
}

function loadScripts(cwd: string): { [name: string]: string } {
  const packagePath = path.join(cwd, "package.json");
  if (!pathExists(packagePath)) return {};
  const pkg = readJson<{ scripts?: { [name: string]: string } }>(packagePath);
  return pkg.scripts || {};
}
