import { AiFeConfig, FeaturePreset, FeatureSpec, VerificationConfig } from "../types";

export function defaultConfig(mode: "legacy" | "fresh"): AiFeConfig {
  return {
    schema: "ai-fe/config@0.1",
    mode: mode,
    spec: {
      defaultStatus: "draft",
      requireApprovalBeforePlan: true,
      requireApprovalBeforePrompt: true
    },
    project: {
      sourceDir: "src",
      featureDir: "src/features",
      specDir: "specs/features"
    },
    verification: {
      commands: {
        typecheck: "npm run typecheck",
        lint: "npm run lint",
        test: "npm test",
        build: "npm run build"
      }
    },
    safety: {
      protectedFiles: ["src/services/http.ts", "src/stores/auth.ts", "src/config/env.ts"],
      legacyZones: ["src/old-pages/**"]
    }
  };
}

export function defaultVerificationConfig(): VerificationConfig {
  return {
    schema: "ai-fe/verification@0.1",
    checks: [
      { name: "typecheck", command: "npm run typecheck", required: true },
      { name: "lint", command: "npm run lint", required: true },
      { name: "test", command: "npm test", required: false },
      { name: "build", command: "npm run build", required: true }
    ],
    architecture: {
      rules: [
        { name: "presentational-components-no-api-import", enabled: true },
        { name: "no-cross-feature-import", enabled: true }
      ]
    }
  };
}

export function defaultFeatureSpec(id: string, preset: FeaturePreset): FeatureSpec {
  const title = toTitle(id);
  const commonStates = ["loading", "empty", "error", "ready"];
  const crudCapabilities = ["list", "search", "pagination", "create", "edit"];

  return {
    schema: "ai-fe/feature@0.1",
    id: id,
    type: preset,
    status: "draft",
    title: title,
    route: "/" + id,
    capabilities: preset === "crud-page" ? crudCapabilities : presetCapabilities(preset),
    states: preset === "crud-page" ? commonStates.concat(["searching", "submitting"]) : commonStates,
    failurePolicy: {
      submitFailed: "preserve-input-and-show-error"
    },
    permissions: [],
    acceptanceCriteria: acceptanceForPreset(preset),
    outOfScope: [],
    notes: []
  };
}

export function ruleTemplates(): Array<{ path: string; content: string }> {
  return [
    {
      path: ".ai/rules/change-safety.md",
      content: "# Change Safety Rules\n\n- Do not refactor unrelated code.\n- Do not modify protected files without explicit approval.\n- Keep changes scoped to the active feature.\n- Prefer small, reviewable diffs.\n"
    },
    {
      path: ".ai/rules/architecture.md",
      content: "# Architecture Rules\n\n- Keep route-level composition near routes/pages.\n- Keep reusable UI in shared components.\n- Avoid cross-feature imports unless the dependency is explicitly shared.\n"
    },
    {
      path: ".ai/rules/component.md",
      content: "# Component Rules\n\n- Presentational components should not call APIs directly.\n- Components must cover loading, empty, error, and ready states when applicable.\n- Keep props explicit and typed.\n"
    },
    {
      path: ".ai/rules/api.md",
      content: "# API Rules\n\n- Use the existing request client.\n- Keep request and response types explicit.\n- Mutation failure must not reset form state.\n- Reset forms only after confirmed success.\n"
    },
    {
      path: ".ai/rules/testing.md",
      content: "# Testing Rules\n\n- Add regression coverage for changed behavior.\n- Prefer user-visible assertions.\n- Verification must run before a feature is marked done.\n"
    }
  ];
}

export function skillTemplates(): Array<{ path: string; content: string }> {
  return [
    skill("build-page", "Use when creating or changing a route-level page.", [
      "Start from the feature spec.",
      "Implement all required UI states.",
      "Keep data loading separate from presentational components."
    ]),
    skill("build-form", "Use when creating create/edit forms.", [
      "Preserve user input on submit failure.",
      "Close and reset only after mutation success.",
      "Show field and form-level errors."
    ]),
    skill("integrate-api", "Use when connecting a feature to API data.", [
      "Use existing request client.",
      "Define typed API functions and hooks.",
      "Invalidate related queries after mutation success."
    ]),
    skill("write-test", "Use when adding feature verification.", [
      "Cover acceptance criteria.",
      "Test error and empty states.",
      "Prefer behavior over implementation details."
    ]),
    skill("refactor-safely", "Use when touching legacy code.", [
      "Preserve behavior unless explicitly required.",
      "Avoid public API renames.",
      "Do not mix broad cleanup with feature work."
    ])
  ];
}

export function workflowTemplates(): Array<{ path: string; content: string }> {
  return ["feature-create", "feature-plan", "feature-prompt", "feature-verify", "feature-learn"].map(function(name) {
    return {
      path: ".ai/workflows/" + name + ".md",
      content: "# Workflow: " + name + "\n\nThis workflow is managed by `ai-fe " + name.replace("-", " ") + "`.\n"
    };
  });
}

function skill(name: string, description: string, rules: string[]): { path: string; content: string } {
  return {
    path: ".ai/skills/" + name + "/SKILL.md",
    content:
      "---\nname: " +
      name +
      "\ndescription: " +
      description +
      "\n---\n\n# Skill: " +
      toTitle(name) +
      "\n\n## Must Follow\n\n" +
      rules.map(function(rule) {
        return "- " + rule;
      }).join("\n") +
      "\n\n## Must Output\n\n- Files changed\n- Verification commands\n- Risks\n"
  };
}

function presetCapabilities(preset: FeaturePreset): string[] {
  if (preset === "list-page") return ["list", "search", "pagination"];
  if (preset === "form-page" || preset === "modal-form") return ["validate", "submit"];
  if (preset === "detail-page") return ["load-detail"];
  if (preset === "dashboard-page") return ["load-widgets", "refresh"];
  if (preset === "auth-page") return ["submit", "validate", "redirect"];
  if (preset === "wizard-flow") return ["step-navigation", "validate", "submit"];
  return ["render"];
}

function acceptanceForPreset(preset: FeaturePreset): string[] {
  if (preset === "crud-page") {
    return [
      "show loading on first load",
      "show empty when no records exist",
      "show error when API fails",
      "reset page to 1 after search",
      "preserve input when create fails",
      "preserve input when edit fails"
    ];
  }
  return ["show loading state", "show error state", "render ready state", "match feature scope"];
}

function toTitle(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(function(part) {
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
