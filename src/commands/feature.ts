import * as path from "path";
import { ParsedArgs, FeaturePreset } from "../types";
import { loadConfig } from "../core/config";
import { defaultFeatureSpec } from "../core/templates";
import { featureDir, loadFeatureSpec, writeFeatureSpecFiles } from "../core/feature-files";
import { pathExists, readText, writeText } from "../utils/fs";
import { choice, isYes, question } from "../utils/prompt";
import { info } from "../utils/logger";
import { runVerification } from "../core/verify";

export async function runFeature(cwd: string, args: ParsedArgs): Promise<void> {
  const sub = args.command[1];
  const name = args.command[2] || args.rest[0];
  if (!sub || !name) throw new Error("Usage: ai-fe feature <create|plan|prompt|verify|learn> <name>");

  if (sub === "create") return runCreate(cwd, name, args);
  if (sub === "plan") return runPlan(cwd, name);
  if (sub === "prompt") return runPrompt(cwd, name);
  if (sub === "verify") return runVerify(cwd, name);
  if (sub === "learn") return runLearn(cwd, name);

  throw new Error("Unknown feature command: " + sub);
}

async function runCreate(cwd: string, name: string, args: ParsedArgs): Promise<void> {
  loadConfig(cwd);
  const preset = parsePreset(choice(args.flags.preset, "crud-page"));
  const spec = defaultFeatureSpec(name, preset);

  if (!isYes(args.flags.yes)) {
    spec.title = await question("Feature title", spec.title);
    spec.route = await question("Route", spec.route);
    const capabilities = await question("Capabilities, comma separated", spec.capabilities.join(", "));
    spec.capabilities = splitCsv(capabilities);
    const outOfScope = await question("Out of scope, comma separated", "");
    spec.outOfScope = splitCsv(outOfScope);
  }

  writeFeatureSpecFiles(cwd, spec);
  info("Created feature spec: " + path.relative(cwd, featureDir(cwd, name)));
}

function runPlan(cwd: string, name: string): void {
  const spec = loadFeatureSpec(cwd, name);
  const dir = featureDir(cwd, name);
  const plan = [
    "# Plan: " + spec.title,
    "",
    "## Implementation Strategy",
    "",
    "- Confirm existing route and feature boundaries.",
    "- Implement the feature using local project patterns.",
    "- Cover required UI states: " + spec.states.join(", ") + ".",
    "- Keep API integration typed and outside presentational components.",
    "- Run verification and update the report.",
    "",
    "## Files To Inspect",
    "",
    "- `.ai/project-profile.md`",
    "- `.ai/rules/*`",
    "- `.ai/skills/*`",
    "- Existing route and feature directories"
  ].join("\n");

  const tasks = [
    "# Tasks: " + spec.title,
    "",
    "- [ ] Review feature spec and project profile",
    "- [ ] Locate route and ownership boundary",
    "- [ ] Implement data/API layer if needed",
    "- [ ] Implement UI states",
    "- [ ] Add or update tests",
    "- [ ] Run `ai-fe feature verify " + spec.id + "`",
    "- [ ] Record learnings"
  ].join("\n");

  writeText(path.join(dir, "plan.md"), plan + "\n");
  writeText(path.join(dir, "tasks.md"), tasks + "\n");
  info("Generated plan.md and tasks.md");
}

function runPrompt(cwd: string, name: string): void {
  const dir = featureDir(cwd, name);
  const spec = loadFeatureSpec(cwd, name);
  const profilePath = path.join(cwd, ".ai", "project-profile.md");
  const prompt = [
    "# Agent Prompt: " + spec.title,
    "",
    "You are implementing feature `" + spec.id + "` in this frontend project.",
    "",
    "## Feature Spec",
    "",
    readMaybe(path.join(dir, "feature.spec.md")),
    "",
    "## UI Spec",
    "",
    readMaybe(path.join(dir, "ui.spec.md")),
    "",
    "## Behavior Spec",
    "",
    readMaybe(path.join(dir, "behavior.spec.md")),
    "",
    "## Plan",
    "",
    readMaybe(path.join(dir, "plan.md")),
    "",
    "## Project Profile",
    "",
    readMaybe(profilePath),
    "",
    "## Constraints",
    "",
    "- Do not refactor unrelated files.",
    "- Preserve user input on failed mutations.",
    "- Run verification before reporting completion."
  ].join("\n");

  writeText(path.join(dir, "agent-prompt.md"), prompt + "\n");
  info("Generated agent-prompt.md");
}

function runVerify(cwd: string, name: string): void {
  const report = runVerification(cwd, name);
  info("Generated " + report);
}

function runLearn(cwd: string, name: string): void {
  const spec = loadFeatureSpec(cwd, name);
  const dir = featureDir(cwd, name);
  const report = [
    "# Learn Report: " + spec.title,
    "",
    "## Summary",
    "",
    "- TODO: Record what changed and what was learned.",
    "",
    "## Suggested Rule Updates",
    "",
    "- TODO",
    "",
    "## Suggested Skill Updates",
    "",
    "- TODO",
    "",
    "## Suggested ADR",
    "",
    "- TODO"
  ].join("\n");
  writeText(path.join(dir, "learn-report.md"), report + "\n");
  info("Generated learn-report.md");
}

function parsePreset(value: string): FeaturePreset {
  const allowed = [
    "basic-page",
    "list-page",
    "crud-page",
    "form-page",
    "modal-form",
    "detail-page",
    "settings-page",
    "dashboard-page",
    "auth-page",
    "wizard-flow",
    "custom"
  ];
  return allowed.indexOf(value) >= 0 ? (value as FeaturePreset) : "custom";
}

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map(function(item) {
      return item.trim();
    })
    .filter(Boolean);
}

function readMaybe(filePath: string): string {
  return pathExists(filePath) ? readText(filePath).trim() : "_Missing: `" + filePath + "`_";
}
