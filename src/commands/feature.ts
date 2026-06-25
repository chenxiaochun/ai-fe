import { ParsedArgs } from "../types";
import {
  runApply,
  runApplyPlan,
  runCreate,
  runLearnCommand,
  runPlanTask,
  runPromptCommand,
  runVerifyCommand
} from "./workflow";

export async function runFeature(cwd: string, args: ParsedArgs): Promise<void> {
  const sub = args.command[1];
  const name = args.command[2];
  if (!sub) throw new Error("用法：ai-fe feature <create|plan|prompt|verify|learn|apply|apply-plan> [name]");

  if (sub === "create") {
    const requirement = name || (typeof args.flags.requirement === "string" ? args.flags.requirement : "创建功能 " + String(args.flags.name || ""));
    return runCreate(cwd, { command: ["create", requirement], flags: args.flags, rest: args.rest });
  }
  if (sub === "apply") return runApply(cwd, { command: ["apply", name || ""], flags: args.flags, rest: args.rest });
  if (sub === "plan") return runPlanTask(cwd, { command: ["plan", name || ""], flags: args.flags, rest: args.rest });
  if (sub === "apply-plan") return runApplyPlan(cwd, { command: ["apply-plan", name || ""], flags: args.flags, rest: args.rest });
  if (sub === "prompt") return runPromptCommand(cwd, { command: ["prompt", name || ""], flags: args.flags, rest: args.rest });
  if (sub === "verify") return runVerifyCommand(cwd, { command: ["verify", name || ""], flags: args.flags, rest: args.rest });
  if (sub === "learn") return runLearnCommand(cwd, { command: ["learn", name || ""], flags: args.flags, rest: args.rest });

  throw new Error("未知 feature 子命令：" + sub);
}
