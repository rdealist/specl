export interface ContextExportEnPromptInput {
  sourceContextZh: Record<string, unknown>;
  glossaryHints?: Record<string, unknown>;
}

export function buildContextExportEnPrompt(input: ContextExportEnPromptInput) {
  return {
    user: JSON.stringify({
      task: "context_export_en",
      sourceContextZh: input.sourceContextZh,
      glossaryHints: input.glossaryHints ?? {},
    }),
  };
}
