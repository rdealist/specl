export interface FieldPatchPromptInput {
  targetFieldPath: string;
  currentValue: unknown;
  documentSummary: Record<string, unknown>;
  constraints: Record<string, unknown>;
}

export function buildFieldPatchPrompt(input: FieldPatchPromptInput) {
  return {
    user: JSON.stringify({
      task: "field_patch",
      targetFieldPath: input.targetFieldPath,
      currentValue: input.currentValue,
      documentSummary: input.documentSummary,
      constraints: input.constraints,
    }),
  };
}
