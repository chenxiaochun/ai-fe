import { FeatureSpec, PlanSpec, ValidationResult } from "../types";

export const FEATURE_NAME_RE = /^[a-z][a-z0-9-]{1,39}$/;

export function validateFeatureName(name: string): ValidationResult {
  if (FEATURE_NAME_RE.test(name)) return { ok: true, errors: [] };
  return {
    ok: false,
    errors: [
      "功能名称格式不合法：" + name,
      "只能包含小写字母、数字和短横线，必须以字母开头，长度 2-40。"
    ]
  };
}

export function validateFeatureSpec(value: FeatureSpec): ValidationResult {
  const errors: string[] = [];
  if (!value || typeof value !== "object") errors.push("输入必须是 JSON object。");
  if (value.schema !== "ai-fe/feature@0.1") errors.push("schema 必须是 ai-fe/feature@0.1。");
  if (!value.id) errors.push("缺少 id。");
  if (!value.name) errors.push("缺少 name。");
  if (value.id && !FEATURE_NAME_RE.test(value.id)) errors.push("id 格式不合法。");
  if (value.name && !FEATURE_NAME_RE.test(value.name)) errors.push("name 格式不合法。");
  if (!value.title) errors.push("缺少 title。");
  if (!value.type) errors.push("缺少 type。");
  if (!value.goal) errors.push("缺少 goal。");
  ensureArray(errors, value.capabilities, "capabilities");
  ensureArray(errors, value.inScope, "inScope");
  ensureArray(errors, value.outOfScope, "outOfScope");
  ensureArray(errors, value.states, "states");
  ensureArray(errors, value.acceptanceCriteria, "acceptanceCriteria");
  return { ok: errors.length === 0, errors: errors };
}

export function validatePlanSpec(value: PlanSpec): ValidationResult {
  const errors: string[] = [];
  if (!value || typeof value !== "object") errors.push("输入必须是 JSON object。");
  if (value.schema !== "ai-fe/plan@0.1") errors.push("schema 必须是 ai-fe/plan@0.1。");
  if (!value.featureId) errors.push("缺少 featureId。");
  if (value.featureId && !FEATURE_NAME_RE.test(value.featureId)) errors.push("featureId 格式不合法。");
  if (!value.summary) errors.push("缺少 summary。");
  ensureArray(errors, value.filesToCreate, "filesToCreate");
  ensureArray(errors, value.filesToModify, "filesToModify");
  ensureArray(errors, value.implementationTasks, "implementationTasks");
  return { ok: errors.length === 0, errors: errors };
}

function ensureArray(errors: string[], value: unknown, name: string): void {
  if (!Array.isArray(value)) errors.push(name + " 必须是数组。");
}
