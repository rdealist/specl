import { runAnthropic } from "../providers/anthropic";
import { SYSTEM_PROMPT } from "../prompts/system";
import { buildContextExportEnPrompt, ContextExportEnPromptInput } from "../prompts/contextExportEn";
import { AiJsonResponse, AiTaskOptions } from "./types";
import { parseJsonResponse } from "../utils";

export interface ContextExportEnPayload {
  contextEn: Record<string, unknown>;
}

export async function runContextExportEnTask(
  input: ContextExportEnPromptInput,
  options: AiTaskOptions
): Promise<AiJsonResponse<ContextExportEnPayload>> {
  const prompt = buildContextExportEnPrompt(input);
  const text = await runAnthropic({
    model: options.model,
    max_tokens: options.maxTokens ?? 2400,
    temperature: options.temperature ?? 0.2,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt.user }],
  });

  const parsed = parseJsonResponse<AiJsonResponse<ContextExportEnPayload>>(text);
  if (!parsed) {
    throw new Error("Failed to parse AI JSON response for context export EN");
  }

  return parsed;
}
