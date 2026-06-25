import * as path from "path";
import { ParsedArgs, ProjectMode } from "../types";
import { cursorCommandTemplates, defaultConfig, defaultState, defaultVerificationConfig, featureSpecJsonSchema, planJsonSchema, ruleTemplates, skillTemplates, workflowTemplates } from "../core/templates";
import { ensureDir, pathExists, writeJson, writeText } from "../utils/fs";
import { info } from "../utils/logger";

export function runInit(cwd: string, args: ParsedArgs): void {
  const mode = parseMode(args.flags.mode);

  ensureDir(path.join(cwd, ".ai", "memory"));
  ensureDir(path.join(cwd, ".ai", "schemas"));
  ensureDir(path.join(cwd, ".ai", "tasks"));
  ensureDir(path.join(cwd, ".ai", "tmp"));
  ensureDir(path.join(cwd, ".ai", "prompts"));
  ensureDir(path.join(cwd, ".cursor", "commands"));
  ensureDir(path.join(cwd, "specs", "features"));
  ensureDir(path.join(cwd, "specs", "adr"));
  ensureDir(path.join(cwd, "specs", "product"));
  ensureDir(path.join(cwd, "verification", "reports"));
  ensureDir(path.join(cwd, "verification", "scripts"));

  writeIfMissing(path.join(cwd, ".ai", "config.json"), function() {
    writeJson(path.join(cwd, ".ai", "config.json"), defaultConfig(mode));
  });
  writeIfMissing(path.join(cwd, "verification", "config.json"), function() {
    writeJson(path.join(cwd, "verification", "config.json"), defaultVerificationConfig());
  });
  writeIfMissing(path.join(cwd, ".ai", "state.json"), function() {
    writeJson(path.join(cwd, ".ai", "state.json"), defaultState());
  });
  writeJson(path.join(cwd, ".ai", "schemas", "feature-spec.schema.json"), featureSpecJsonSchema());
  writeJson(path.join(cwd, ".ai", "schemas", "plan.schema.json"), planJsonSchema());
  writeIfMissing(path.join(cwd, ".ai", "project-profile.md"), function() {
    writeText(path.join(cwd, ".ai", "project-profile.md"), "# 项目画像\n\n运行 `ai-fe scan` 填充此文件。\n");
  });
  writeIfMissing(path.join(cwd, ".ai", "memory", "decisions.jsonl"), function() {
    writeText(path.join(cwd, ".ai", "memory", "decisions.jsonl"), "");
  });
  writeIfMissing(path.join(cwd, ".ai", "memory", "patterns.jsonl"), function() {
    writeText(path.join(cwd, ".ai", "memory", "patterns.jsonl"), "");
  });
  writeIfMissing(path.join(cwd, ".ai", "memory", "mistakes.jsonl"), function() {
    writeText(path.join(cwd, ".ai", "memory", "mistakes.jsonl"), "");
  });
  writeText(path.join(cwd, "specs", "features", ".gitkeep"), "");
  writeText(path.join(cwd, "specs", "adr", ".gitkeep"), "");
  writeText(path.join(cwd, "specs", "product", ".gitkeep"), "");

  ruleTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  skillTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  workflowTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  cursorCommandTemplates().forEach(function(template) {
    writeIfMissing(path.join(cwd, template.path), function() {
      writeText(path.join(cwd, template.path), template.content);
    });
  });

  info([
    "ai-fe 初始化完成。",
    "",
    "已创建：",
    "- .ai/config.json",
    "- .ai/state.json",
    "- .ai/schemas/feature-spec.schema.json",
    "- .ai/schemas/plan.schema.json",
    "- .cursor/commands/ai-fe*.md",
    "- specs/",
    "- verification/",
    "",
    "下一步：",
    "- ai-fe scan",
    "- 在 Cursor Agent 中使用 /ai-fe",
    "- ai-fe create \"你的功能需求\""
  ].join("\n"));
}

function parseMode(value: string | boolean | undefined): ProjectMode {
  return value === "fresh" ? "fresh" : "legacy";
}

function writeIfMissing(filePath: string, write: () => void): void {
  if (!pathExists(filePath)) write();
}
