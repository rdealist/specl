export type IssueSeverity = "error" | "warning" | "info";

export type IssueCode =
  | "REQUIRED_FIELD_MISSING"
  | "REQUIRED_REQ_FIELD_MISSING"
  | "INVALID_ENUM_VALUE"
  | "DUPLICATE_REQUIREMENT_ID"
  | "INVALID_ACCEPTANCE_ITEM"
  | "TOO_MANY_ITEMS"
  | "TEXT_TOO_LONG"
  | "FLOWS_STEP_NOT_CONTIGUOUS"
  | "FLOWS_TOO_LONG"
  | "OPEN_QUESTIONS_EMPTY_BUT_RISKY";

export interface Issue {
  code: IssueCode;
  severity: IssueSeverity;
  fieldPath: string;
  message: string;
  suggestion?: string;
  canAutoFix?: boolean;
  meta?: Record<string, unknown>;
}

export type ActionScope = "single" | "batch";

export type ActionType = "manual" | "ai";

export type AiTaskType = "consistency_check" | "field_patch" | "suggested_flows";

export type ActionId =
  | "FOCUS_FIELD"
  | "AI_FILL_ACCEPTANCE_EDGE_SINGLE"
  | "AI_FILL_ACCEPTANCE_EDGE_BATCH_P0P1"
  | "AI_SUGGEST_FLOWS_SINGLE"
  | "AI_SUGGEST_FLOWS_BATCH_P0"
  | "AI_SUMMARIZE_TRIM_TEXT"
  | "AI_SUGGEST_OPEN_QUESTIONS"
  | "RENUMBER_FLOW_STEPS";

export interface IssueAction {
  actionId: ActionId;
  type: ActionType;
  label: string;
  taskType?: AiTaskType;
  scope: ActionScope;
  targetFieldPath?: string;
  requiresConfirmation?: boolean;
  analyticsEvent: string;
}

export interface IssueActionContext {
  issue: Issue;
  aiMode: "cloud" | "local" | "disabled";
}
