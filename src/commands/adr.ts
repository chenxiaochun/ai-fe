import * as path from "path";
import { ParsedArgs } from "../types";
import { writeText } from "../utils/fs";
import { question } from "../utils/prompt";
import { info } from "../utils/logger";

export async function runAdr(cwd: string, args: ParsedArgs): Promise<void> {
  if (args.command[1] !== "new") throw new Error("用法：ai-fe adr new");

  const title = await question("决策标题", "新的架构决策");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "decision";
  const fileName = timestamp() + "-" + slug + ".md";
  const filePath = path.join(cwd, "specs", "adr", fileName);

  writeText(
    filePath,
    [
      "# ADR：" + title,
      "",
      "## 状态",
      "",
      "提议中",
      "",
      "## 背景",
      "",
      "待补充",
      "",
      "## 决策",
      "",
      "待补充",
      "",
      "## 影响",
      "",
      "待补充",
      "",
      "## 相关规则",
      "",
      "- 待补充",
      "",
      "## 相关技能",
      "",
      "- 待补充"
    ].join("\n") + "\n"
  );

  info("已创建 " + path.relative(cwd, filePath));
}

function timestamp(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join("");
}

function pad(value: number): string {
  return value < 10 ? "0" + value : String(value);
}
