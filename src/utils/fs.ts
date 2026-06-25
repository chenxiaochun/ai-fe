import * as fs from "fs";
import * as path from "path";

export function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeText(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function writeJson(filePath: string, value: unknown): void {
  writeText(filePath, JSON.stringify(value, null, 2) + "\n");
}

export function readText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(readText(filePath)) as T;
}

export function listFiles(dirPath: string, maxDepth: number): string[] {
  const results: string[] = [];

  function walk(current: string, depth: number): void {
    if (!fs.existsSync(current) || depth > maxDepth) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else {
        results.push(fullPath);
      }
    }
  }

  walk(dirPath, 0);
  return results;
}

export function relative(cwd: string, filePath: string): string {
  return path.relative(cwd, filePath).split(path.sep).join("/");
}
