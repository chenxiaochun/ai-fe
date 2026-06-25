export type ProjectMode = "legacy" | "fresh";

export type FeaturePreset =
  | "basic-page"
  | "list-page"
  | "crud-page"
  | "form-page"
  | "modal-form"
  | "detail-page"
  | "settings-page"
  | "dashboard-page"
  | "auth-page"
  | "wizard-flow"
  | "custom";

export interface AiFeConfig {
  schema: "ai-fe/config@0.1";
  mode: ProjectMode;
  spec: {
    defaultStatus: "draft" | "approved";
    requireApprovalBeforePlan: boolean;
    requireApprovalBeforePrompt: boolean;
  };
  project: {
    sourceDir: string;
    featureDir: string;
    specDir: string;
  };
  verification: {
    commands: { [name: string]: string };
  };
  safety: {
    protectedFiles: string[];
    legacyZones: string[];
  };
}

export interface FeatureSpec {
  schema: "ai-fe/feature@0.1";
  id: string;
  type: FeaturePreset;
  status: "draft" | "approved";
  title: string;
  route: string;
  capabilities: string[];
  states: string[];
  failurePolicy: { [name: string]: string };
  permissions: string[];
  acceptanceCriteria: string[];
  outOfScope: string[];
  notes: string[];
}

export interface VerifyCheck {
  name: string;
  command: string;
  required: boolean;
}

export interface VerificationConfig {
  schema: "ai-fe/verification@0.1";
  checks: VerifyCheck[];
  architecture: {
    rules: Array<{ name: string; enabled: boolean }>;
  };
}

export interface ParsedArgs {
  command: string[];
  flags: { [name: string]: string | boolean };
  rest: string[];
}
