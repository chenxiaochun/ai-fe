import * as path from "path";
import { listFiles, pathExists, readText } from "../utils/fs";
import { info } from "../utils/logger";

export function runRulesCheck(cwd: string): void {
  const rulesDir = path.join(cwd, ".ai", "rules");
  if (!pathExists(rulesDir)) throw new Error("Missing .ai/rules. Run `ai-fe init` first.");

  const rules = listFiles(rulesDir, 2).filter(function(file) {
    return file.lastIndexOf(".md") === file.length - 3;
  });

  const empty = rules.filter(function(file) {
    return readText(file).trim().length === 0;
  });

  info("Rules found: " + rules.length);
  if (empty.length > 0) {
    throw new Error("Empty rule files: " + empty.map(function(file) {
      return path.relative(cwd, file);
    }).join(", "));
  }
  info("Rules check passed");
}
