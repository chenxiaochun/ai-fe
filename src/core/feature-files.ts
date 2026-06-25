import * as path from "path";
import { FeatureSpec } from "../types";
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

export function renderFeatureSpec(spec: FeatureSpec): string {
  return [
    "# Feature Spec: " + spec.title,
    "",
    "- ID: `" + spec.id + "`",
    "- Type: `" + spec.type + "`",
    "- Status: `" + spec.status + "`",
    "- Route: `" + spec.route + "`",
    "",
    "## Scope",
    "",
    "Capabilities:",
    list(spec.capabilities),
    "",
    "Out of scope:",
    listOrPlaceholder(spec.outOfScope),
    "",
    "## Notes",
    "",
    listOrPlaceholder(spec.notes)
  ].join("\n");
}

function renderUiSpec(spec: FeatureSpec): string {
  return ["# UI Spec: " + spec.title, "", "## Required States", "", list(spec.states)].join("\n");
}

function renderDataSpec(spec: FeatureSpec): string {
  return [
    "# Data Spec: " + spec.title,
    "",
    "## Permissions",
    "",
    listOrPlaceholder(spec.permissions),
    "",
    "## Failure Policy",
    "",
    Object.keys(spec.failurePolicy)
      .map(function(key) {
        return "- " + key + ": " + spec.failurePolicy[key];
      })
      .join("\n")
  ].join("\n");
}

function renderBehaviorSpec(spec: FeatureSpec): string {
  return ["# Behavior Spec: " + spec.title, "", "## Acceptance Criteria", "", list(spec.acceptanceCriteria)].join("\n");
}

function renderVerifySpec(spec: FeatureSpec): string {
  return [
    "# Verify Spec: " + spec.title,
    "",
    "## Checks",
    "",
    "- TypeScript",
    "- Lint",
    "- Build",
    "- Tests where available",
    "- Acceptance criteria coverage"
  ].join("\n");
}

function list(values: string[]): string {
  return values.map(function(value) {
    return "- " + value;
  }).join("\n");
}

function listOrPlaceholder(values: string[]): string {
  return values.length > 0 ? list(values) : "- TODO";
}
