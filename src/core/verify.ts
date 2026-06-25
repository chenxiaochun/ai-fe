import * as path from "path";
import { loadVerificationConfig } from "./config";
import { runShell } from "../utils/exec";
import { writeText } from "../utils/fs";
import { featureDir } from "./feature-files";

export function runVerification(cwd: string, featureName: string, skip: string[] = []): string {
  const config = loadVerificationConfig(cwd);
  const results = config.checks.map(function(check) {
    if (skip.indexOf(check.name) >= 0) {
      return {
        name: check.name,
        command: check.command,
        required: check.required,
        status: "skipped",
        exitCode: 0,
        stdout: "",
        stderr: "",
        durationMs: 0
      };
    }
    const started = Date.now();
    const result = runShell(check.command, cwd);
    return {
      name: check.name,
      command: check.command,
      required: check.required,
      status: result.status === 0 ? "passed" : "failed",
      exitCode: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      durationMs: Date.now() - started
    };
  });

  const reportPath = path.join(featureDir(cwd, featureName), "verify-report.md");
  const passed = results.filter(function(result) {
    return result.status === "passed" || result.status === "skipped";
  }).length;

  const markdown = [
    "# 验证报告：" + featureName,
    "",
    "## 总览",
    "",
    "状态：" + (passed === results.length ? "通过" : "未完全通过"),
    "",
    "## 检查结果",
    "",
    "| 检查项 | 是否必需 | 结果 | 耗时 |",
    "|---|---:|---|---:|",
    results
      .map(function(result) {
        return (
          "| " +
          result.name +
          " | " +
          (result.required ? "是" : "否") +
          " | " +
          renderStatus(result.status) +
          " | " +
          renderDuration(result.durationMs) +
          " |"
        );
      })
      .join("\n"),
    "",
    "## 详细输出",
    "",
    results
      .map(function(result) {
        return [
          "### " + result.name,
          "",
          "执行命令：",
          "",
          "```bash",
          result.command,
          "```",
          "",
          "输出：",
          "",
          "```text",
          trimOutput(result.stdout + "\n" + result.stderr),
          "```"
        ].join("\n");
      })
      .join("\n\n")
  ].join("\n");

  writeText(reportPath, markdown + "\n");
  return path.relative(cwd, reportPath);
}

function renderStatus(status: string): string {
  if (status === "passed") return "通过";
  if (status === "skipped") return "跳过";
  return "失败";
}

function renderDuration(durationMs: number): string {
  if (!durationMs) return "0s";
  return (durationMs / 1000).toFixed(1) + "s";
}

function trimOutput(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 4000) return trimmed || "无输出";
  return trimmed.slice(0, 4000) + "\n... 输出已截断 ...";
}
