import { mapDocumentToContext } from "./mapper";
import { pruneByProfile, ExportProfile } from "./prune";
import { validateContext } from "./validate";

export interface ExportContextInput {
  documentId: string;
  updatedAt: string;
  fieldsJson: Record<string, any>;
  language: "zh" | "en";
  source: "manual" | "ai_assisted" | "imported";
  profile: ExportProfile;
  includeFlowsInLean?: boolean;
}

export interface ExportContextResult {
  context: Record<string, any>;
  valid: boolean;
  errors: string[];
}

export function buildExportContext(input: ExportContextInput): ExportContextResult {
  const mapped = mapDocumentToContext({
    documentId: input.documentId,
    updatedAt: input.updatedAt,
    fieldsJson: input.fieldsJson,
    language: input.language,
    source: input.source,
  });

  const pruned = pruneByProfile(mapped, {
    profile: input.profile,
    includeFlowsInLean: input.includeFlowsInLean,
  });

  const validation = validateContext(pruned);

  return {
    context: pruned,
    valid: validation.valid,
    errors: validation.errors,
  };
}
