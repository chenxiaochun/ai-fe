import * as path from "path";
import { AiFeConfig, VerificationConfig } from "../types";
import { pathExists, readJson } from "../utils/fs";

export function configPath(cwd: string): string {
  return path.join(cwd, ".ai", "config.json");
}

export function verificationConfigPath(cwd: string): string {
  return path.join(cwd, "verification", "config.json");
}

export function loadConfig(cwd: string): AiFeConfig {
  const filePath = configPath(cwd);
  if (!pathExists(filePath)) {
    throw new Error("Missing .ai/config.json. Run `ai-fe init` first.");
  }
  return readJson<AiFeConfig>(filePath);
}

export function loadVerificationConfig(cwd: string): VerificationConfig {
  const filePath = verificationConfigPath(cwd);
  if (!pathExists(filePath)) {
    throw new Error("Missing verification/config.json. Run `ai-fe init` first.");
  }
  return readJson<VerificationConfig>(filePath);
}
