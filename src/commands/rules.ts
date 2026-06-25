import * as path from "path";
import { listFiles, pathExists, readText } from "../utils/fs";
import { info } from "../utils/logger";

export function runRulesCheck(cwd: string): void {
  const rulesDir = path.join(cwd, ".ai", "rules");
  if (!pathExists(rulesDir)) throw new Error("缺少 .ai/rules。请先运行 `ai-fe init`。");

  const rules = listFiles(rulesDir, 2).filter(function(file) {
    return file.lastIndexOf(".md") === file.length - 3;
  });

  const empty = rules.filter(function(file) {
    return readText(file).trim().length === 0;
  });

  info("发现规则文件：" + rules.length);
  if (empty.length > 0) {
    throw new Error("存在空规则文件：" + empty.map(function(file) {
      return path.relative(cwd, file);
    }).join(", "));
  }
  info("规则检查通过");
}
