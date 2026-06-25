import * as path from "path";
import { FeatureSpec, PlanSpec } from "../types";
import { readJson, writeJson, writeText } from "../utils/fs";
import { loadConfig } from "./config";

export function featureDir(cwd: string, featureName: string): string {
  const config = loadConfig(cwd);
  return path.join(cwd, config.project.specDir, featureName);
}

export function featureSpecPath(cwd: string, featureName: string): string {
  return path.join(featureDir(cwd, featureName), "spec.json");
}

export function loadFeatureSpec(cwd: string, featureName: string): FeatureSpec {
  return readJson<FeatureSpec>(featureSpecPath(cwd, featureName));
}

export function writeFeatureSpecFiles(cwd: string, spec: FeatureSpec): void {
  const dir = featureDir(cwd, spec.id);
  writeJson(path.join(dir, "spec.json"), spec);
  writeText(path.join(dir, "feature.spec.md"), renderFeatureSpec(spec));
  writeText(path.join(dir, "ui.spec.md"), renderUiSpec(spec));
  writeText(path.join(dir, "data.spec.md"), renderDataSpec(spec));
  writeText(path.join(dir, "behavior.spec.md"), renderBehaviorSpec(spec));
  writeText(path.join(dir, "verify.spec.md"), renderVerifySpec(spec));
}

export function planSpecPath(cwd: string, featureName: string): string {
  return path.join(featureDir(cwd, featureName), "plan.json");
}

export function loadPlanSpec(cwd: string, featureName: string): PlanSpec {
  return readJson<PlanSpec>(planSpecPath(cwd, featureName));
}

export function writePlanFiles(cwd: string, plan: PlanSpec): void {
  const dir = featureDir(cwd, plan.featureId);
  writeJson(path.join(dir, "plan.json"), plan);
  writeText(path.join(dir, "plan.md"), renderPlan(plan));
  writeText(path.join(dir, "tasks.md"), renderTasks(plan));
}

export function renderFeatureSpec(spec: FeatureSpec): string {
  return [
    "# 功能规格：" + spec.title,
    "",
    "- ID: `" + spec.id + "`",
    "- 功能名称：`" + spec.name + "`",
    "- 类型：`" + spec.type + "`",
    "- 状态：`" + spec.status + "`",
    "- 路由：`" + (spec.route || "待补充") + "`",
    "",
    "## 目标",
    "",
    spec.goal || "待补充",
    "",
    "## 范围",
    "",
    "### 包含",
    "",
    listOrPlaceholder(spec.inScope),
    "",
    "### 不包含",
    "",
    listOrPlaceholder(spec.outOfScope),
    "",
    "## 用户",
    "",
    listOrPlaceholder(spec.users),
    "",
    "## 能力",
    "",
    listOrPlaceholder(spec.capabilities),
    "",
    "## 假设",
    "",
    listOrPlaceholder(spec.assumptions),
    "",
    "## 风险",
    "",
    listOrPlaceholder(spec.risks)
  ].join("\n");
}

function renderUiSpec(spec: FeatureSpec): string {
  return [
    "# UI 规格：" + spec.title,
    "",
    "## 页面状态",
    "",
    listOrPlaceholder(spec.states),
    "",
    "## 弹窗状态",
    "",
    listOrPlaceholder(spec.modalStates),
    "",
    "## 组件",
    "",
    spec.components.length > 0
      ? spec.components
          .map(function(component) {
            return [
              "### " + component.name,
              "",
              "- 角色：" + component.role,
              "- 职责：",
              listOrPlaceholder(component.responsibilities),
              "- 禁止：",
              listOrPlaceholder(component.forbidden)
            ].join("\n");
          })
          .join("\n\n")
      : "待补充"
  ].join("\n");
}

function renderDataSpec(spec: FeatureSpec): string {
  return [
    "# 数据规格：" + spec.title,
    "",
    "## API 依赖",
    "",
    spec.apiDependencies.length > 0
      ? spec.apiDependencies
          .map(function(api) {
            return "- `" + api.method + " " + api.path + "`：" + api.name + (api.confirmed ? "（已确认）" : "（待确认）");
          })
          .join("\n")
      : "- 待补充",
    "",
    "## 状态归属",
    "",
    "- 服务端状态：" + (spec.dataOwnership.serverState || "待补充"),
    "- 表单状态：" + (spec.dataOwnership.formState || "待补充"),
    "- URL 状态：" + (spec.dataOwnership.urlState || "待补充"),
    "- 权限状态：" + (spec.dataOwnership.permissionState || "待补充"),
    "",
    "## 权限",
    "",
    spec.permissions.length > 0
      ? spec.permissions.map(function(permission) {
          return "- `" + permission.key + "`：" + permission.description;
        }).join("\n")
      : "- 待补充",
    "",
    "## 失败策略",
    "",
    Object.keys(spec.failurePolicy)
      .map(function(key) {
        return "- " + key + ": " + spec.failurePolicy[key];
      })
      .join("\n")
  ].join("\n");
}

function renderBehaviorSpec(spec: FeatureSpec): string {
  return [
    "# 行为规格：" + spec.title,
    "",
    "## 用户行为",
    "",
    spec.behaviors.length > 0
      ? spec.behaviors
          .map(function(behavior) {
            return [
              "### " + behavior.name,
              "",
              "触发：" + (behavior.trigger || "待补充"),
              "",
              "步骤：",
              listOrPlaceholder(behavior.steps)
            ].join("\n");
          })
          .join("\n\n")
      : "待补充",
    "",
    "## 验收标准",
    "",
    listOrPlaceholder(spec.acceptanceCriteria)
  ].join("\n");
}

function renderVerifySpec(spec: FeatureSpec): string {
  return [
    "# 验证规格：" + spec.title,
    "",
    "## 必需检查",
    "",
    listOrPlaceholder(spec.verification.requiredChecks),
    "",
    "## 验收测试",
    "",
    listOrPlaceholder(spec.verification.acceptanceTests),
    "",
    "## 架构检查",
    "",
    listOrPlaceholder(spec.verification.architectureChecks)
  ].join("\n");
}

function renderPlan(plan: PlanSpec): string {
  return [
    "# 实施方案：" + plan.featureId,
    "",
    "## 摘要",
    "",
    plan.summary,
    "",
    "## 创建文件",
    "",
    listOrPlaceholder(plan.filesToCreate),
    "",
    "## 修改文件",
    "",
    listOrPlaceholder(plan.filesToModify),
    "",
    "## 组件树",
    "",
    plan.componentTree || "待补充",
    "",
    "## 数据流",
    "",
    plan.dataFlow || "待补充",
    "",
    "## 状态归属",
    "",
    listOrPlaceholder(plan.stateOwnership),
    "",
    "## 风险",
    "",
    listOrPlaceholder(plan.risks),
    "",
    "## 必须遵守的规则",
    "",
    listOrPlaceholder(plan.rulesToFollow)
  ].join("\n");
}

function renderTasks(plan: PlanSpec): string {
  return [
    "# 任务清单：" + plan.featureId,
    "",
    plan.implementationTasks.length > 0
      ? plan.implementationTasks
          .map(function(task, index) {
            return [
              "## " + String(index + 1) + ". " + task.title,
              "",
              task.description,
              "",
              task.items
                .map(function(item) {
                  return "- [ ] " + item;
                })
                .join("\n")
            ].join("\n");
          })
          .join("\n\n")
      : "- [ ] 待补充实施任务"
  ].join("\n");
}

function list(values: string[]): string {
  return values.map(function(value) {
    return "- " + value;
  }).join("\n");
}

function listOrPlaceholder(values: string[]): string {
  return values.length > 0 ? list(values) : "- 待补充";
}
