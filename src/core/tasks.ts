import * as path from "path";
import { FeatureSpec } from "../types";
import { loadConfig } from "./config";
import { writeText } from "../utils/fs";

export function createFeatureTask(cwd: string, requirement: string, nameHint?: string, output?: string): string {
  const config = loadConfig(cwd);
  const filePath = output || path.join(cwd, config.agent.taskDir, "create-feature-" + timestamp() + ".md");
  const content = [
    "# 创建功能规格任务",
    "",
    "## 用户原始需求",
    "",
    requirement,
    "",
    "## 你的角色",
    "",
    "你是一个资深前端产品工程师和架构师。",
    "",
    "你需要和用户确认关键问题，生成结构化功能规格 JSON。",
    "",
    "## 工作要求",
    "",
    "1. 推断英文功能名称。",
    "2. 如果名称不明确，向用户追问。",
    "3. 判断功能类型。",
    "4. 补齐范围、状态、行为、权限、接口、验收标准。",
    "5. 不要修改业务代码。",
    "6. 最终输出 JSON，且必须符合 schema。",
    "",
    "## 名称提示",
    "",
    nameHint || "无",
    "",
    "## 输出文件",
    "",
    "请生成：",
    "",
    ".ai/tmp/<feature-name>.spec.json",
    "",
    "然后执行：",
    "",
    "```bash",
    "ai-fe apply .ai/tmp/<feature-name>.spec.json",
    "```",
    "",
    "## Schema",
    "",
    "请读取：",
    "",
    ".ai/schemas/feature-spec.schema.json",
    "",
    "## 注意事项",
    "",
    "- 所有用户可见内容必须使用中文。",
    "- 文件路径和代码标识保持英文。",
    "- 功能名称必须符合 `^[a-z][a-z0-9-]{1,39}$`。",
    "- CLI 不会调用模型，智能分析由当前 Agent 完成。"
  ].join("\n");
  writeText(filePath, content + "\n");
  return path.relative(cwd, filePath);
}

export function createPlanTask(cwd: string, spec: FeatureSpec, output?: string): string {
  const config = loadConfig(cwd);
  const filePath = output || path.join(cwd, config.agent.taskDir, "plan-" + spec.id + "-" + timestamp() + ".md");
  const content = [
    "# 生成功能实施方案任务",
    "",
    "## 功能",
    "",
    spec.id,
    "",
    "## 你的角色",
    "",
    "你是一个资深前端架构师。",
    "",
    "你需要基于已有功能规格和项目上下文，生成结构化实施方案。",
    "",
    "## 工作要求",
    "",
    "1. 阅读功能规格。",
    "2. 阅读项目画像。",
    "3. 阅读工程规则和技能。",
    "4. 分析需要创建和修改的文件。",
    "5. 拆分为可执行任务。",
    "6. 不要直接修改业务代码。",
    "7. 最终输出 JSON，且必须符合 schema。",
    "",
    "## 输入文件",
    "",
    "- specs/features/" + spec.id + "/spec.json",
    "- specs/features/" + spec.id + "/feature.spec.md",
    "- specs/features/" + spec.id + "/ui.spec.md",
    "- specs/features/" + spec.id + "/data.spec.md",
    "- specs/features/" + spec.id + "/behavior.spec.md",
    "- specs/features/" + spec.id + "/verify.spec.md",
    "- .ai/project-profile.md",
    "- .ai/rules/*",
    "- .ai/skills/*",
    "",
    "## 输出要求",
    "",
    "请生成：",
    "",
    ".ai/tmp/" + spec.id + ".plan.json",
    "",
    "然后执行：",
    "",
    "```bash",
    "ai-fe apply-plan .ai/tmp/" + spec.id + ".plan.json",
    "```",
    "",
    "## Schema",
    "",
    "请读取：.ai/schemas/plan.schema.json"
  ].join("\n");
  writeText(filePath, content + "\n");
  return path.relative(cwd, filePath);
}

export function createLearnTask(cwd: string, featureName: string, output?: string): string {
  const config = loadConfig(cwd);
  const filePath = output || path.join(cwd, config.agent.taskDir, "learn-" + featureName + "-" + timestamp() + ".md");
  const content = [
    "# 生成功能经验沉淀报告任务",
    "",
    "## 功能",
    "",
    featureName,
    "",
    "## 你的角色",
    "",
    "你是一个资深前端工程负责人。",
    "",
    "你需要分析本次功能实现过程，总结可以沉淀到项目中的规则、技能、测试模式和架构决策。",
    "",
    "## 请读取",
    "",
    "- specs/features/" + featureName + "/spec.json",
    "- specs/features/" + featureName + "/plan.md",
    "- specs/features/" + featureName + "/tasks.md",
    "- specs/features/" + featureName + "/verify-report.md",
    "",
    "如果可以，也请查看当前 git diff。",
    "",
    "## 输出要求",
    "",
    "请生成：",
    "",
    "specs/features/" + featureName + "/learn-report.md",
    "",
    "所有用户可见内容必须使用中文。"
  ].join("\n");
  writeText(filePath, content + "\n");
  return path.relative(cwd, filePath);
}

function timestamp(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join("");
}

function pad(value: number): string {
  return value < 10 ? "0" + value : String(value);
}
