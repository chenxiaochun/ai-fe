# ai-fe

`ai-fe` is a TypeScript CLI for adding an AI-native engineering workflow to frontend projects.

It does not try to replace coding agents. It creates the context, specs, rules, plans, prompts, verification reports, and learning records that make agents more controlled and reviewable.

## Commands

```bash
pnpm build
node dist/cli.js init --mode legacy
node dist/cli.js scan
node dist/cli.js feature create user-management --preset crud-page --yes
node dist/cli.js feature plan user-management
node dist/cli.js feature prompt user-management
node dist/cli.js feature verify user-management
node dist/cli.js feature learn user-management
node dist/cli.js adr new
node dist/cli.js rules check
node dist/cli.js doctor
```

After publishing or linking the package, the binary is `ai-fe`.

```bash
npm link
ai-fe doctor
```

## Generated Structure

```text
.ai/
  config.json
  project-profile.md
  rules/
  skills/
  workflows/
  memory/
specs/
  features/
  adr/
verification/
  config.json
  reports/
```

The MVP supports React/TypeScript/Vite style projects first, but the generated files are plain text and can be adjusted for any frontend stack.
