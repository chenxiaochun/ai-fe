import * as readline from "readline";

export function isYes(value: string | boolean | undefined): boolean {
  return value === true || value === "true" || value === "yes" || value === "1";
}

export function question(label: string, defaultValue: string): Promise<string> {
  if (!process.stdin.isTTY) return Promise.resolve(defaultValue);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const suffix = defaultValue ? " (" + defaultValue + ")" : "";
  return new Promise(function(resolve) {
    rl.question(label + suffix + ": ", function(answer: string) {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

export function choice(value: string | boolean | undefined, fallback: string): string {
  if (typeof value === "string" && value.length > 0) return value;
  return fallback;
}
