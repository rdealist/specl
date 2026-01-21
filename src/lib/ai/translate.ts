/**
 * AI Translation Helper for Context Export
 */

import { callAi, parseAiJson } from './client';

/**
 * Translate ZH context to EN using AI
 */
export async function translateContextToEn(zhContext: Record<string, any>): Promise<{
  enContext: Record<string, any>;
  tokensIn: number;
  tokensOut: number;
}> {
  const systemPrompt = `You are a professional technical translator specializing in product requirements documents.

Your task is to translate a Chinese PRD context JSON to English while:
1. Preserving the exact JSON structure
2. Maintaining technical accuracy
3. Using professional product management terminology
4. Keeping field names and schema unchanged
5. Only translating string values, not keys

Return ONLY the translated JSON, no explanations or markdown.`;

  const userPrompt = `Translate this PRD context from Chinese to English:

${JSON.stringify(zhContext, null, 2)}

Return the translated JSON with the same structure.`;

  const aiResponse = await callAi(systemPrompt, userPrompt, {
    temperature: 0.3, // Lower temperature for more consistent translation
    maxTokens: 8192, // Larger context may need more tokens
  });

  // Parse the translated context
  const enContext = parseAiJson<Record<string, any>>(aiResponse.content);

  // Ensure meta.language is set to 'en'
  if (enContext.meta) {
    enContext.meta.language = 'en';
    enContext.meta.source = 'ai_assisted';
  }

  return {
    enContext,
    tokensIn: aiResponse.tokensIn,
    tokensOut: aiResponse.tokensOut,
  };
}
