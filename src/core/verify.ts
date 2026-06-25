import * as path from "path";
import { loadVerificationConfig } from "./config";
import { runShell } from "../utils/exec";
import { writeText } from "../utils/fs";

export function runVerification(cwd: string, featureName: string): string {
  const config = loadVerificationConfig(cwd);
  const results = config.checks.map(function(check) {
    const result = runShell(check.command, cwd);
    return {
      name: check.name,
      command: check.command,
      required: check.required,
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr
    };
  });

  const reportPath = path.join(cwd, "verification", "reports", featureName + ".md");
  const passed = results.filter(function(result) {
    return result.status === 0;
  }).length;

  const markdown = [
    "# Verify Report: " + featureName,
    "",
    "Status: " + (passed === results.length ? "passed" : "partially passed"),
    "",
    "## Checks",
    "",
    "| Check | Required | Result | Command |",
    "|---|---:|---|---|",
    results
      .map(function(result) {
        return (
          "| " +
          result.name +
          " | " +
          String(result.required) +
          " | " +
          (result.status === 0 ? "passed" : "failed (" + result.status + ")") +
          " | `" +
          result.command.replace(/\|/g, "\\|") +
          "` |"
        );
      })
      .join("\n"),
    "",
    "## Output",
    "",
    results
      .map(function(result) {
        return "### " + result.name + "\n\n```text\n" + trimOutput(result.stdout + "\n" + result.stderr) + "\n```";
      })
      .join("\n\n")
  ].join("\n");

  writeText(reportPath, markdown + "\n");
  return path.relative(cwd, reportPath);
}

function trimOutput(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= 4000) return trimmed || "(no output)";
  return trimmed.slice(0, 4000) + "\n... output truncated ...";
}
