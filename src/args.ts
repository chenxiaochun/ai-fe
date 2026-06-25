import { ParsedArgs } from "./types";

export function parseArgs(argv: string[]): ParsedArgs {
  const command: string[] = [];
  const rest: string[] = [];
  const flags: { [name: string]: string | boolean } = {};
  let readingFlags = true;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--") {
      readingFlags = false;
      continue;
    }

    if (readingFlags && arg.indexOf("--") === 0) {
      const raw = arg.slice(2);
      const eq = raw.indexOf("=");
      if (eq >= 0) {
        flags[raw.slice(0, eq)] = raw.slice(eq + 1);
      } else {
        const next = argv[i + 1];
        if (next && next.indexOf("-") !== 0) {
          flags[raw] = next;
          i += 1;
        } else {
          flags[raw] = true;
        }
      }
      continue;
    }

    if (readingFlags && arg.indexOf("-") === 0) {
      flags[arg.slice(1)] = true;
      continue;
    }

    if (command.length < 3) command.push(arg);
    else rest.push(arg);
  }

  return { command: command, flags: flags, rest: rest };
}
