#!/usr/bin/env node
import { parseArgs } from "./args";
import { runInit } from "./commands/init";
import { runScan } from "./commands/scan";
import { runFeature } from "./commands/feature";
import { runAdr } from "./commands/adr";
import { runRulesCheck } from "./commands/rules";
import { runDoctor } from "./commands/doctor";
import { error, info } from "./utils/logger";

async function main(): Promise<void> {
  const cwd = process.cwd();
  const args = parseArgs(process.argv.slice(2));
  const root = args.command[0];

  if (!root || args.flags.help || args.flags.h) {
    printHelp();
    return;
  }

  if (root === "init") return runInit(cwd, args);
  if (root === "scan") return runScan(cwd);
  if (root === "feature") return runFeature(cwd, args);
  if (root === "adr") return runAdr(cwd, args);
  if (root === "rules" && args.command[1] === "check") return runRulesCheck(cwd);
  if (root === "doctor") return runDoctor(cwd);

  throw new Error("Unknown command: " + root);
}

function printHelp(): void {
  info(
    [
      "ai-fe",
      "",
      "Usage:",
      "  ai-fe init [--mode legacy|fresh]",
      "  ai-fe scan",
      "  ai-fe feature create <name> [--preset crud-page] [--yes]",
      "  ai-fe feature plan <name>",
      "  ai-fe feature prompt <name>",
      "  ai-fe feature verify <name>",
      "  ai-fe feature learn <name>",
      "  ai-fe adr new",
      "  ai-fe rules check",
      "  ai-fe doctor"
    ].join("\n")
  );
}

main().catch(function(err: Error) {
  error(err.message);
  process.exit(1);
});
