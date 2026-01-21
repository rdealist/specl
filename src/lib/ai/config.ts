/**
 * AI Configuration and Provider Setup
 */

export type AiMode = 'cloud' | 'disabled';
export type AiProvider = 'anthropic' | 'openai';

export interface AiConfig {
  mode: AiMode;
  provider: AiProvider;
  model: string;
  apiKey?: string;
}

/**
 * Get AI configuration from environment variables
 * Throws error if AI is disabled or not properly configured
 */
export function getAiConfig(): AiConfig {
  const mode = (process.env.AI_MODE || 'disabled') as AiMode;

  if (mode === 'disabled') {
    throw new Error('AI features are disabled. Set AI_MODE=cloud and provide API keys to enable.');
  }

  const provider = (process.env.AI_PROVIDER || 'anthropic') as AiProvider;
  const model = process.env.AI_DEFAULT_MODEL || 'claude-3-5-sonnet-20241022';

  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required when AI_MODE=cloud and AI_PROVIDER=anthropic');
    }
    return { mode, provider, model, apiKey };
  }

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required when AI_MODE=cloud and AI_PROVIDER=openai');
    }
    return { mode, provider, model, apiKey };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

/**
 * Check if AI features are enabled
 */
export function isAiEnabled(): boolean {
  const mode = process.env.AI_MODE || 'disabled';
  return mode === 'cloud';
}

/**
 * Get AI configuration safely (returns null if disabled)
 */
export function getAiConfigSafe(): AiConfig | null {
  try {
    return getAiConfig();
  } catch {
    return null;
  }
}
