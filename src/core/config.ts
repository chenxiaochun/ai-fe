import * as path from "path";
import { AiFeConfig, AiFeState, VerificationConfig } from "../types";
import { pathExists, readJson, writeJson } from "../utils/fs";
import { defaultConfig } from "./templates";

export function configPath(cwd: string): string {
  return path.join(cwd, ".ai", "config.json");
}

export function verificationConfigPath(cwd: string): string {
  return path.join(cwd, "verification", "config.json");
}

export function statePath(cwd: string): string {
  return path.join(cwd, ".ai", "state.json");
}

export function loadConfig(cwd: string): AiFeConfig {
  const filePath = configPath(cwd);
  if (!pathExists(filePath)) {
    throw new Error("缺少 .ai/config.json。请先运行 `ai-fe init`。");
  }
  const loaded = readJson<AiFeConfig>(filePath);
  const defaults = defaultConfig(loaded.mode || "legacy");
  return {
    ...defaults,
    ...loaded,
    agent: {
      ...defaults.agent,
      ...(loaded.agent || {})
    },
    spec: {
      ...defaults.spec,
      ...(loaded.spec || {})
    },
    project: {
      ...defaults.project,
      ...(loaded.project || {})
    },
    verification: {
      ...defaults.verification,
      ...(loaded.verification || {})
    },
    safety: {
      ...defaults.safety,
      ...(loaded.safety || {})
    }
  };
}

export function loadVerificationConfig(cwd: string): VerificationConfig {
  const filePath = verificationConfigPath(cwd);
  if (!pathExists(filePath)) {
    throw new Error("缺少 verification/config.json。请先运行 `ai-fe init`。");
  }
  return readJson<VerificationConfig>(filePath);
}

export function loadState(cwd: string): AiFeState {
  const filePath = statePath(cwd);
  if (!pathExists(filePath)) {
    throw new Error("缺少 .ai/state.json。请先运行 `ai-fe init`。");
  }
  return readJson<AiFeState>(filePath);
}

export function saveState(cwd: string, state: AiFeState): void {
  writeJson(statePath(cwd), state);
}

export function setActiveFeature(cwd: string, featureName: string): void {
  const state = loadState(cwd);
  state.activeFeature = featureName;
  state.recentFeatures = [featureName].concat(state.recentFeatures.filter(function(name) {
    return name !== featureName;
  })).slice(0, 20);
  saveState(cwd, state);
}

export function resolveFeatureName(cwd: string, maybeName?: string): string {
  if (maybeName) return maybeName;
  const state = loadState(cwd);
  if (!state.activeFeature) {
    throw new Error("当前没有 active feature。请指定 feature name，或先执行 `ai-fe apply <spec-json-file>`。");
  }
  return state.activeFeature;
}
