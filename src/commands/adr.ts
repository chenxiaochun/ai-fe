import * as path from "path";
import { ParsedArgs } from "../types";
import { writeText } from "../utils/fs";
import { question } from "../utils/prompt";
import { info } from "../utils/logger";

export async function runAdr(cwd: string, args: ParsedArgs): Promise<void> {
  if (args.command[1] !== "new") throw new Error("Usage: ai-fe adr new");

  const title = await question("Decision title", "New Architecture Decision");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "decision";
  const fileName = timestamp() + "-" + slug + ".md";
  const filePath = path.join(cwd, "specs", "adr", fileName);

  writeText(
    filePath,
    [
      "# ADR: " + title,
      "",
      "## Status",
      "",
      "Proposed",
      "",
      "## Context",
      "",
      "TODO",
      "",
      "## Decision",
      "",
      "TODO",
      "",
      "## Consequences",
      "",
      "TODO",
      "",
      "## Related Rules",
      "",
      "- TODO",
      "",
      "## Related Skills",
      "",
      "- TODO"
    ].join("\n") + "\n"
  );

  info("Created " + path.relative(cwd, filePath));
}

function timestamp(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join("");
}

function pad(value: number): string {
  return value < 10 ? "0" + value : String(value);
}
