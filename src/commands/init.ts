import * as path from "path";
import { ParsedArgs, ProjectMode } from "../types";
import { defaultConfig, defaultVerificationConfig, ruleTemplates, skillTemplates, workflowTemplates } from "../core/templates";
import { ensureDir, pathExists, writeJson, writeText } from "../utils/fs";
import { info } from "../utils/logger";

export function runInit(cwd: string, args: ParsedArgs): void {
  const mode = parseMode(args.flags.mode);

  ensureDir(path.join(cwd, ".ai", "memory"));
  ensureDir(path.join(cwd, "specs", "features"));
  ensureDir(path.join(cwd, "specs", "adr"));
  ensureDir(path.join(cwd, "verification", "reports"));

  writeIfMissing(path.join(cwd, ".ai", "config.json"), function() {
    writeJson(path.join(cwd, ".ai", "config.json"), defaultConfig(mode));
  });
  writeIfMissing(path.join(cwd, "verification", "config.json"), function() {
    writeJson(path.join(cwd, "verification", "config.json"), defaultVerificationConfig());
  });
  writeIfMissing(path.join(cwd, ".ai", "project-profile.md"), function() {
    writeText(path.join(cwd, ".ai", "project-profile.md"), "# Project Profile\n\nRun `ai-fe scan` to populate this file.\n");
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

  info("Initialized ai-fe project layer in " + cwd);
}

function parseMode(value: string | boolean | undefined): ProjectMode {
  return value === "fresh" ? "fresh" : "legacy";
}

function writeIfMissing(filePath: string, write: () => void): void {
  if (!pathExists(filePath)) write();
}
