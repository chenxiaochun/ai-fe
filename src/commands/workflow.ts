import * as path from "path";
import { ParsedArgs, FeatureSpec, PlanSpec } from "../types";
import { resolveFeatureName, setActiveFeature, loadState, saveState } from "../core/config";
import { featureDir, featureSpecPath, loadFeatureSpec, writeFeatureSpecFiles, writePlanFiles } from "../core/feature-files";
import { createFeatureTask, createLearnTask, createPlanTask } from "../core/tasks";
import { validateFeatureName, validateFeatureSpec, validatePlanSpec } from "../core/validation";
import { runVerification } from "../core/verify";
import { pathExists, readJson, readText, writeText } from "../utils/fs";
import { info } from "../utils/logger";

export function runCreate(cwd: string, args: ParsedArgs): void {
  const requirement = args.command.slice(1).concat(args.rest).join(" ").trim();
  if (!requirement) throw new Error("用法：ai-fe create \"需求描述\"");
  const output = typeof args.flags.output === "string" ? path.resolve(cwd, args.flags.output) : undefined;
  const nameHint = typeof args.flags.name === "string" ? args.flags.name : undefined;
  const task = createFeatureTask(cwd, requirement, nameHint, output);
  info([
    "已创建功能规格生成任务：",
    "",
    task,
    "",
    "请让当前 AI Agent 执行该任务。",
    "",
    "Agent 需要：",
    "1. 阅读任务文件",
    "2. 追问用户并生成符合 Schema 的 spec JSON",
    "3. 执行 ai-fe apply <spec-json-file>"
  ].join("\n"));
}

export function runApply(cwd: string, args: ParsedArgs): void {
  const file = args.command[1] || args.rest[0];
  if (!file) throw new Error("用法：ai-fe apply <spec-json-file>");
  const spec = readJson<FeatureSpec>(path.resolve(cwd, file));
  normalizeFeatureSpec(spec);
  const validation = validateFeatureSpec(spec);
  if (!validation.ok) throw new Error("输入的 JSON 不符合功能规格 Schema。\n\n" + validation.errors.join("\n"));
  const nameValidation = validateFeatureName(spec.id);
  if (!nameValidation.ok) throw new Error(nameValidation.errors.join("\n"));
  const target = featureSpecPath(cwd, spec.id);
  if (pathExists(target) && !args.flags.force) {
    throw new Error("功能 " + spec.id + " 已存在。如需覆盖，请加 --force。");
  }
  writeFeatureSpecFiles(cwd, spec);
  setActiveFeature(cwd, spec.id);
  info([
    "已生成功能规格：",
    "",
    "- specs/features/" + spec.id + "/spec.json",
    "- specs/features/" + spec.id + "/feature.spec.md",
    "- specs/features/" + spec.id + "/ui.spec.md",
    "- specs/features/" + spec.id + "/data.spec.md",
    "- specs/features/" + spec.id + "/behavior.spec.md",
    "- specs/features/" + spec.id + "/verify.spec.md",
    "",
    "当前 active feature：" + spec.id,
    "",
    "下一步：",
    "- ai-fe plan"
  ].join("\n"));
}

export function runPlanTask(cwd: string, args: ParsedArgs): void {
  const featureName = resolveFeatureName(cwd, args.command[1]);
  const spec = loadFeatureSpec(cwd, featureName);
  const output = typeof args.flags.output === "string" ? path.resolve(cwd, args.flags.output) : undefined;
  const task = createPlanTask(cwd, spec, output);
  info([
    "已创建实施方案生成任务：",
    "",
    task,
    "",
    "请让当前 AI Agent 执行该任务。",
    "",
    "Agent 需要：",
    "1. 阅读任务文件",
    "2. 生成符合 Schema 的 plan JSON",
    "3. 执行 ai-fe apply-plan <plan-json-file>"
  ].join("\n"));
}

export function runApplyPlan(cwd: string, args: ParsedArgs): void {
  const file = args.command[1] || args.rest[0];
  if (!file) throw new Error("用法：ai-fe apply-plan <plan-json-file>");
  const plan = readJson<PlanSpec>(path.resolve(cwd, file));
  normalizePlanSpec(plan);
  const validation = validatePlanSpec(plan);
  if (!validation.ok) throw new Error("输入的 JSON 不符合实施方案 Schema。\n\n" + validation.errors.join("\n"));
  if (!pathExists(featureSpecPath(cwd, plan.featureId))) throw new Error("功能不存在：" + plan.featureId);
  writePlanFiles(cwd, plan);
  const spec = loadFeatureSpec(cwd, plan.featureId);
  spec.status = "planned";
  spec.updatedAt = new Date().toISOString();
  writeFeatureSpecFiles(cwd, spec);
  setActiveFeature(cwd, plan.featureId);
  info([
    "已生成实施方案：",
    "",
    "- specs/features/" + plan.featureId + "/plan.json",
    "- specs/features/" + plan.featureId + "/plan.md",
    "- specs/features/" + plan.featureId + "/tasks.md",
    "",
    "下一步：",
    "- ai-fe prompt"
  ].join("\n"));
}

export function runPromptCommand(cwd: string, args: ParsedArgs): void {
  const featureName = resolveFeatureName(cwd, args.command[1]);
  const output = typeof args.flags.output === "string" ? path.resolve(cwd, args.flags.output) : path.join(cwd, ".ai", "prompts", featureName + ".md");
  const prompt = renderPrompt(cwd, featureName);
  writeText(output, prompt + "\n");
  const spec = loadFeatureSpec(cwd, featureName);
  spec.status = "prompted";
  spec.updatedAt = new Date().toISOString();
  writeFeatureSpecFiles(cwd, spec);
  setActiveFeature(cwd, featureName);
  info("已生成开发 Prompt：" + path.relative(cwd, output));
}

export function runVerifyCommand(cwd: string, args: ParsedArgs): void {
  const featureName = resolveFeatureName(cwd, args.command[1]);
  const skip = typeof args.flags.skip === "string" ? args.flags.skip.split(",") : [];
  const report = runVerification(cwd, featureName, skip);
  const spec = loadFeatureSpec(cwd, featureName);
  spec.status = "verified";
  spec.updatedAt = new Date().toISOString();
  writeFeatureSpecFiles(cwd, spec);
  info("已生成验证报告：" + report);
}

export function runLearnCommand(cwd: string, args: ParsedArgs): void {
  const featureName = resolveFeatureName(cwd, args.command[1]);
  const task = createLearnTask(cwd, featureName);
  const reportPath = path.join(featureDir(cwd, featureName), "learn-report.md");
  if (!pathExists(reportPath)) {
    writeText(reportPath, renderLearnTemplate(featureName) + "\n");
  }
  const spec = loadFeatureSpec(cwd, featureName);
  spec.status = "learned";
  spec.updatedAt = new Date().toISOString();
  writeFeatureSpecFiles(cwd, spec);
  setActiveFeature(cwd, featureName);
  info([
    "已创建经验沉淀任务：",
    "",
    task,
    "",
    "已准备经验沉淀模板：",
    "specs/features/" + featureName + "/learn-report.md"
  ].join("\n"));
}

export function runList(cwd: string): void {
  const state = loadState(cwd);
  if (state.recentFeatures.length === 0) {
    info("暂无功能。");
    return;
  }
  info("功能列表：");
  state.recentFeatures.forEach(function(name) {
    info((state.activeFeature === name ? "* " : "- ") + name);
  });
}

export function runStatus(cwd: string): void {
  const state = loadState(cwd);
  info("当前 active feature：" + (state.activeFeature || "无"));
  if (state.activeFeature) {
    const spec = loadFeatureSpec(cwd, state.activeFeature);
    info("状态：" + spec.status);
    info("标题：" + spec.title);
  }
}

export function runApprove(cwd: string, args: ParsedArgs): void {
  const featureName = resolveFeatureName(cwd, args.command[1]);
  const spec = loadFeatureSpec(cwd, featureName);
  spec.status = "approved";
  spec.updatedAt = new Date().toISOString();
  writeFeatureSpecFiles(cwd, spec);
  setActiveFeature(cwd, featureName);
  info("已批准功能：" + featureName);
}

export function renderPrompt(cwd: string, featureName: string): string {
  const dir = featureDir(cwd, featureName);
  const files = [
    "feature.spec.md",
    "ui.spec.md",
    "data.spec.md",
    "behavior.spec.md",
    "verify.spec.md",
    "plan.md",
    "tasks.md"
  ];
  return [
    "# AI 编码 Agent 开发任务",
    "",
    "## 角色",
    "",
    "你是一个在现有前端项目中工作的 AI 编码 Agent。",
    "",
    "## 当前功能",
    "",
    featureName,
    "",
    "## 必须阅读",
    "",
    files.map(function(file) {
      return "- specs/features/" + featureName + "/" + file;
    }).join("\n"),
    "- .ai/project-profile.md",
    "- .ai/rules/change-safety.md",
    "- .ai/rules/component.md",
    "- .ai/rules/api.md",
    "",
    "## 硬性约束",
    "",
    "- 按 tasks.md 顺序执行。",
    "- 不要实现不在范围内的功能。",
    "- 不要顺手重构无关文件。",
    "- 不要修改受保护文件。",
    "- 展示组件不能直接请求 API。",
    "- 表单提交失败必须保留用户输入。",
    "- 必须补充验收标准对应的测试。",
    "",
    "## 上下文",
    "",
    readMaybe(path.join(cwd, ".ai", "project-profile.md")),
    "",
    "## 功能资料",
    "",
    files.map(function(file) {
      return "### " + file + "\n\n" + readMaybe(path.join(dir, file));
    }).join("\n\n"),
    "",
    "## 完成后请汇报",
    "",
    "- 创建了哪些文件",
    "- 修改了哪些文件",
    "- 完成了哪些任务",
    "- 做了哪些假设",
    "- 还有哪些未解决问题",
    "- 建议执行哪些验证命令"
  ].join("\n");
}

function normalizeFeatureSpec(spec: FeatureSpec): void {
  spec.name = spec.name || spec.id;
  spec.status = spec.status || "draft";
  spec.users = spec.users || [];
  spec.capabilities = spec.capabilities || [];
  spec.inScope = spec.inScope || [];
  spec.outOfScope = spec.outOfScope || [];
  spec.states = spec.states || [];
  spec.modalStates = spec.modalStates || [];
  spec.components = spec.components || [];
  spec.apiDependencies = spec.apiDependencies || [];
  spec.dataOwnership = spec.dataOwnership || {};
  spec.permissions = spec.permissions || [];
  spec.behaviors = spec.behaviors || [];
  spec.failurePolicy = spec.failurePolicy || { submitFailed: "preserve-input-and-show-error" };
  spec.acceptanceCriteria = spec.acceptanceCriteria || [];
  spec.verification = spec.verification || { requiredChecks: [], acceptanceTests: [], architectureChecks: [] };
  spec.assumptions = spec.assumptions || [];
  spec.todos = spec.todos || [];
  spec.risks = spec.risks || [];
  spec.createdAt = spec.createdAt || new Date().toISOString();
  spec.updatedAt = new Date().toISOString();
}

function normalizePlanSpec(plan: PlanSpec): void {
  plan.filesToCreate = plan.filesToCreate || [];
  plan.filesToModify = plan.filesToModify || [];
  plan.stateOwnership = plan.stateOwnership || [];
  plan.implementationTasks = plan.implementationTasks || [];
  plan.risks = plan.risks || [];
  plan.rulesToFollow = plan.rulesToFollow || [];
  plan.createdAt = plan.createdAt || new Date().toISOString();
  plan.updatedAt = new Date().toISOString();
}

function renderLearnTemplate(featureName: string): string {
  return [
    "# 经验沉淀报告：" + featureName,
    "",
    "## 总结",
    "",
    "待补充",
    "",
    "## 重复出现的问题",
    "",
    "- 待补充",
    "",
    "## 新模式",
    "",
    "- 待补充",
    "",
    "## 建议更新的规则",
    "",
    "- 待补充",
    "",
    "## 建议更新的技能",
    "",
    "- 待补充",
    "",
    "## 建议新增的 ADR",
    "",
    "- 待补充",
    "",
    "## 建议新增的测试工具",
    "",
    "- 待补充",
    "",
    "## 人工评审记录",
    "",
    "- 待补充"
  ].join("\n");
}

function readMaybe(filePath: string): string {
  return pathExists(filePath) ? readText(filePath).trim() : "缺少文件：" + filePath;
}
