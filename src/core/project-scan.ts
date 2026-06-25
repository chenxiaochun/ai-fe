import * as path from "path";
import { listFiles, pathExists, readJson, relative } from "../utils/fs";

interface PackageJson {
  scripts?: { [name: string]: string };
  dependencies?: { [name: string]: string };
  devDependencies?: { [name: string]: string };
}

export function scanProject(cwd: string): string {
  const packagePath = path.join(cwd, "package.json");
  const hasPackage = pathExists(packagePath);
  const pkg = hasPackage ? readJson<PackageJson>(packagePath) : {};
  const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
  const files = listFiles(cwd, 3).map(function(filePath) {
    return relative(cwd, filePath);
  });

  const stack = detectStack(deps, files);
  const scripts = pkg.scripts || {};

  return [
    "# 项目画像",
    "",
    "由 `ai-fe scan` 生成。",
    "",
    "## 技术栈",
    "",
    list(stack.length > 0 ? stack : ["未知"]),
    "",
    "## 命令",
    "",
    commandLine("dev", scripts.dev),
    commandLine("build", scripts.build),
    commandLine("typecheck", scripts.typecheck),
    commandLine("lint", scripts.lint),
    commandLine("test", scripts.test),
    "",
    "## 目录信号",
    "",
    list(files.filter(interestingFile).slice(0, 80)),
    "",
    "## 当前风险",
    "",
    "- 大范围重构前先确认受保护文件。",
    "- UI 变更需要确认加载、空态、错误态和权限显隐。",
    "- 如果自动识别不完整，请在 `verification/config.json` 中补充缺失脚本。",
    "",
    "## AI 约束",
    "",
    "- 不要重构无关文件。",
    "- 优先沿用本项目已有模式，不要随意引入新架构。",
    "- 汇报完成前必须运行验证。"
  ].join("\n");
}

function detectStack(deps: { [name: string]: string }, files: string[]): string[] {
  const result: string[] = [];
  if (deps.react) result.push("React");
  if (deps.vue) result.push("Vue");
  if (deps.next) result.push("Next.js");
  if (deps.vite || files.some(endsWith("vite.config.ts"))) result.push("Vite");
  if (deps.typescript || files.some(endsWith("tsconfig.json"))) result.push("TypeScript");
  if (deps["@tanstack/react-query"] || deps["react-query"]) result.push("React Query");
  if (deps["react-hook-form"]) result.push("React Hook Form");
  if (deps.zod) result.push("Zod");
  if (deps.vitest) result.push("Vitest");
  if (deps["@testing-library/react"]) result.push("Testing Library");
  return result;
}

function interestingFile(file: string): boolean {
  return (
    file === "package.json" ||
    file === "tsconfig.json" ||
    file.indexOf("src/") === 0 ||
    file.indexOf("pages/") === 0 ||
    file.indexOf("app/") === 0 ||
    file.indexOf("vite.config") === 0
  );
}

function endsWith(suffix: string): (value: string) => boolean {
  return function(value: string): boolean {
    return value.lastIndexOf(suffix) === value.length - suffix.length;
  };
}

function commandLine(name: string, value: string | undefined): string {
  return "- " + name + ": " + (value ? "`" + value + "`" : "未识别");
}

function list(values: string[]): string {
  return values.map(function(value) {
    return "- " + value;
  }).join("\n");
}
