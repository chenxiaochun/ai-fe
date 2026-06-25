import * as path from "path";
import { commandExists } from "../utils/exec";
import { pathExists } from "../utils/fs";
import { info } from "../utils/logger";

export function runDoctor(cwd: string): void {
  const checks = [
    ["node", commandExists("node")],
    ["typescript compiler", commandExists("tsc")],
    ["package.json", pathExists(path.join(cwd, "package.json"))],
    [".ai/config.json", pathExists(path.join(cwd, ".ai", "config.json"))],
    ["verification/config.json", pathExists(path.join(cwd, "verification", "config.json"))]
  ];

  checks.forEach(function(check) {
    info((check[1] ? "OK  " : "MISS") + " " + check[0]);
  });
}
