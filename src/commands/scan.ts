import * as path from "path";
import { scanProject } from "../core/project-scan";
import { writeText } from "../utils/fs";
import { info } from "../utils/logger";

export function runScan(cwd: string): void {
  const profile = scanProject(cwd);
  writeText(path.join(cwd, ".ai", "project-profile.md"), profile + "\n");
  info("Updated .ai/project-profile.md");
}
