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
  agent: {
    mode: "external";
    taskDir: string;
    schemaDir: string;
    tmpDir: string;
    requireUserApproval: boolean;
  };
  spec: {
    defaultStatus: FeatureStatus;
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

export type FeatureStatus = "draft" | "approved" | "planned" | "prompted" | "implemented" | "verified" | "learned";

export interface FeatureSpec {
  schema: "ai-fe/feature@0.1";
  id: string;
  name: string;
  title: string;
  type: FeaturePreset;
  status: FeatureStatus;
  route?: string;
  goal: string;
  users: string[];
  capabilities: string[];
  inScope: string[];
  outOfScope: string[];
  states: string[];
  modalStates: string[];
  components: Array<{
    name: string;
    role: string;
    responsibilities: string[];
    forbidden: string[];
  }>;
  apiDependencies: Array<{
    name: string;
    method: string;
    path: string;
    description?: string;
    confirmed: boolean;
  }>;
  dataOwnership: {
    serverState?: string;
    formState?: string;
    urlState?: string;
    permissionState?: string;
  };
  permissions: Array<{
    key: string;
    description: string;
  }>;
  behaviors: Array<{
    name: string;
    trigger?: string;
    steps: string[];
  }>;
  failurePolicy: { [name: string]: string };
  acceptanceCriteria: string[];
  verification: {
    requiredChecks: string[];
    acceptanceTests: string[];
    architectureChecks: string[];
  };
  assumptions: string[];
  todos: string[];
  risks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AiFeState {
  schema: "ai-fe/state@0.1";
  activeFeature: string | null;
  recentFeatures: string[];
}

export interface PlanSpec {
  schema: "ai-fe/plan@0.1";
  featureId: string;
  summary: string;
  filesToCreate: string[];
  filesToModify: string[];
  componentTree?: string;
  dataFlow?: string;
  stateOwnership: string[];
  implementationTasks: Array<{
    title: string;
    description: string;
    items: string[];
  }>;
  risks: string[];
  rulesToFollow: string[];
  createdAt: string;
  updatedAt: string;
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

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}
