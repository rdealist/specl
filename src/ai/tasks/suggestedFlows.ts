import { runAnthropic } from "../providers/anthropic";
import { SYSTEM_PROMPT } from "../prompts/system";
import { buildSuggestedFlowsPrompt, SuggestedFlowsPromptInput } from "../prompts/suggestedFlows";
import { AiJsonResponse, AiTaskOptions } from "./types";
import { parseJsonResponse } from "../utils";

export interface SuggestedFlowsPayload {
  requirementId?: string;
  flows: {
    main: Array<{ step: number; action: string; system: string }>;
  };
}

export async function runSuggestedFlowsTask(
  input: SuggestedFlowsPromptInput,
  options: AiTaskOptions
): Promise<AiJsonResponse<SuggestedFlowsPayload>> {
  const prompt = buildSuggestedFlowsPrompt(input);
  const text = await runAnthropic({
    model: options.model,
    max_tokens: options.maxTokens ?? 1200,
    temperature: options.temperature ?? 0.2,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt.user }],
  });

  const parsed = parseJsonResponse<AiJsonResponse<SuggestedFlowsPayload>>(text);
  if (!parsed) {
    throw new Error("Failed to parse AI JSON response for suggested flows");
  }

  return parsed;
}
