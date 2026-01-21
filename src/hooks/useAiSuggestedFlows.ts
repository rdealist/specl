/**
 * AI Suggested Flows Hook
 * Used to generate user flows for requirements
 */

import { useState } from 'react';

interface FlowStep {
  stepTitle: string;
  userIntent: string;
  systemResponse: string;
}

interface SuggestedFlowsOptions {
  documentId: string;
  requirementId: string;
  userStory: string;
  acceptance?: Array<{ given: string; when: string; then: string }>;
}

interface SuggestedFlowsResult {
  flows: {
    main: FlowStep[];
    alternatives: FlowStep[];
  };
  tokensUsed: number;
  cost: number;
}

interface AiError {
  error: string;
  code?: string;
  retryable?: boolean;
  retryAfter?: number;
}

export function useAiSuggestedFlows() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AiError | null>(null);

  const generateFlows = async (
    options: SuggestedFlowsOptions
  ): Promise<SuggestedFlowsResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/suggested-flows', {
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

      const result: SuggestedFlowsResult = await response.json();
      setLoading(false);
      return result;
    } catch (err) {
      console.error('AI suggested flows error:', err);
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
    generateFlows,
    loading,
    error,
    reset,
  };
}
