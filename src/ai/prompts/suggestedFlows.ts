export interface SuggestedFlowsPromptInput {
  requirement: Record<string, unknown>;
  ruleFlowSkeleton?: Array<Record<string, unknown>>;
  constraints?: Record<string, unknown>;
}

export function buildSuggestedFlowsPrompt(input: SuggestedFlowsPromptInput) {
  return {
    user: JSON.stringify({
      task: "suggested_flows",
      requirement: input.requirement,
      ruleFlowSkeleton: input.ruleFlowSkeleton ?? [],
      constraints: input.constraints ?? {},
    }),
  };
}
