import * as path from "path";
import { scanProject } from "../core/project-scan";
import { pathExists, readJson, writeJson, writeText } from "../utils/fs";
import { info } from "../utils/logger";
import { VerificationConfig } from "../types";

export function runScan(cwd: string): void {
  const profile = scanProject(cwd);
  writeText(path.join(cwd, ".ai", "project-profile.md"), profile + "\n");
  syncVerificationConfig(cwd);
  info("已更新 .ai/project-profile.md");
  info("已同步 verification/config.json");
}

function syncVerificationConfig(cwd: string): void {
  const packagePath = path.join(cwd, "package.json");
  const verifyPath = path.join(cwd, "verification", "config.json");
  if (!pathExists(packagePath) || !pathExists(verifyPath)) return;

  const pkg = readJson<{ scripts?: { [name: string]: string } }>(packagePath);
  const scripts = pkg.scripts || {};
  const config = readJson<VerificationConfig>(verifyPath);
  config.checks = config.checks.map(function(check) {
    if (scripts[check.name]) {
      return {
        name: check.name,
        command: "npm run " + check.name,
        required: check.required
      };
    }
    return check;
  });
  writeJson(verifyPath, config);
}
