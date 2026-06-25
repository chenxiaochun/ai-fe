#!/usr/bin/env node
import { parseArgs } from "./args";
import { runInit } from "./commands/init";
import { runScan } from "./commands/scan";
import { runFeature } from "./commands/feature";
import { runAdr } from "./commands/adr";
import { runRulesCheck } from "./commands/rules";
import { runDoctor } from "./commands/doctor";
import { error, info } from "./utils/logger";
import {
  runApply,
  runApplyPlan,
  runApprove,
  runCreate,
  runLearnCommand,
  runList,
  runPlanTask,
  runPromptCommand,
  runStatus,
  runVerifyCommand
} from "./commands/workflow";

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
  if (root === "create") return runCreate(cwd, args);
  if (root === "apply") return runApply(cwd, args);
  if (root === "plan") return runPlanTask(cwd, args);
  if (root === "apply-plan") return runApplyPlan(cwd, args);
  if (root === "prompt") return runPromptCommand(cwd, args);
  if (root === "verify") return runVerifyCommand(cwd, args);
  if (root === "learn") return runLearnCommand(cwd, args);
  if (root === "list") return runList(cwd);
  if (root === "status") return runStatus(cwd);
  if (root === "approve") return runApprove(cwd, args);
  if (root === "feature") return runFeature(cwd, args);
  if (root === "adr") return runAdr(cwd, args);
  if (root === "rules" && args.command[1] === "check") return runRulesCheck(cwd);
  if (root === "doctor") return runDoctor(cwd);

  throw new Error("未知命令：" + root);
}

function printHelp(): void {
  info(
    [
      "ai-fe",
      "",
      "用法：",
      "  ai-fe init [--mode legacy|fresh] [--agents cursor,claude,windsurf,copilot,codex|all]",
      "  ai-fe scan",
      "  ai-fe create \"<需求描述>\" [--name feature-name]",
      "  ai-fe apply <spec-json-file> [--force]",
      "  ai-fe plan [feature-name]",
      "  ai-fe apply-plan <plan-json-file>",
      "  ai-fe prompt [feature-name] [--output .ai/prompts/name.md]",
      "  ai-fe verify [feature-name] [--skip test]",
      "  ai-fe learn [feature-name]",
      "  ai-fe list",
      "  ai-fe status",
      "  ai-fe approve [feature-name]",
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
