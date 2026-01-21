/**
 * AI Client for Anthropic Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import { getAiConfig } from './config';

export interface AiCallOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AiResponse {
  content: string;
  tokensIn: number;
  tokensOut: number;
}

/**
 * Call Anthropic Claude API
 */
export async function callAi(
  systemPrompt: string,
  userPrompt: string,
  options: AiCallOptions = {}
): Promise<AiResponse> {
  const config = getAiConfig();

  if (config.provider !== 'anthropic') {
    throw new Error('Only Anthropic provider is currently supported');
  }

  const anthropic = new Anthropic({
    apiKey: config.apiKey,
  });

  const response = await anthropic.messages.create({
    model: config.model,
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature || 1.0,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Extract text content
  const textContent = response.content
    .filter((block) => block.type === 'text')
    .map((block) => ('text' in block ? block.text : ''))
    .join('\n');

  return {
    content: textContent,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
  };
}

/**
 * Parse JSON response from AI
 * Attempts to extract JSON from markdown code blocks if needed
 */
export function parseAiJson<T = any>(content: string): T {
  let jsonStr = content.trim();

  // Try to extract JSON from markdown code block
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    throw new Error(`Failed to parse AI JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
