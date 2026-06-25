import { spawnSync } from "child_process";

export interface ExecResult {
  command: string;
  status: number;
  stdout: string;
  stderr: string;
}

export function runShell(command: string, cwd: string): ExecResult {
  const result = spawnSync(command, {
    cwd: cwd,
    shell: true,
    encoding: "utf8"
  });

  return {
    command: command,
    status: typeof result.status === "number" ? result.status : 1,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

export function commandExists(command: string): boolean {
  const result = spawnSync(command, ["--version"], {
    shell: process.platform === "win32",
    encoding: "utf8"
  });
  return result.status === 0;
}
