import { runAnthropic } from "../providers/anthropic";
import { SYSTEM_PROMPT } from "../prompts/system";
import { buildFieldPatchPrompt, FieldPatchPromptInput } from "../prompts/fieldPatch";
import { AiJsonResponse, AiTaskOptions } from "./types";
import { parseJsonResponse } from "../utils";

export interface FieldPatchPayload {
  patch: Array<{ op: string; path: string; value: unknown }>;
  preview?: Record<string, unknown>;
}

export async function runFieldPatchTask(
  input: FieldPatchPromptInput,
  options: AiTaskOptions
): Promise<AiJsonResponse<FieldPatchPayload>> {
  const prompt = buildFieldPatchPrompt(input);
  const text = await runAnthropic({
    model: options.model,
    max_tokens: options.maxTokens ?? 1200,
    temperature: options.temperature ?? 0.2,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt.user }],
  });

  const parsed = parseJsonResponse<AiJsonResponse<FieldPatchPayload>>(text);
  if (!parsed) {
    throw new Error("Failed to parse AI JSON response for field patch");
  }

  return parsed;
}
