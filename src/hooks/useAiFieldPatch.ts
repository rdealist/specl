/**
 * AI Field Patch Hook
 * Used to auto-fix fields using AI suggestions
 */

import { useState } from 'react';
import { JsonPatchOperation } from '@/lib/jsonPatch';

interface FieldPatchOptions {
  documentId: string;
  targetFieldPath: string;
  currentValue: any;
  documentSummary: {
    title: string;
    userStory?: string;
  };
}

interface FieldPatchResult {
  patches: JsonPatchOperation[];
  preview: string;
  tokensUsed: number;
  cost: number;
}

interface AiError {
  error: string;
  code?: string;
  retryable?: boolean;
  retryAfter?: number;
}

export function useAiFieldPatch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AiError | null>(null);

  const generatePatch = async (options: FieldPatchOptions): Promise<FieldPatchResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/field-patch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData: AiError = await response.json();
        setError(errorData);
        setLoading(false);
        return null;
      }

      const result: FieldPatchResult = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      console.error('AI field patch error:', err);
      setError({
        error: 'Failed to connect to AI service',
        retryable: true,
      });
      setLoading(false);
      return null;
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return {
    generatePatch,
    loading,
    error,
    reset,
  };
}
