/**
 * AI Error Handler
 * Maps AI provider errors to user-friendly messages
 */

export interface AiError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  retryAfter?: number; // seconds
}

/**
 * Map error to user-friendly message
 */
export function handleAiError(error: any): AiError {
  // API key missing
  if (error.message?.includes('API_KEY') || error.message?.includes('apiKey')) {
    return {
      code: 'API_KEY_MISSING',
      message: error.message,
      userMessage: 'AI features disabled. Add ANTHROPIC_API_KEY to enable.',
      retryable: false,
    };
  }

  // Rate limit error
  if (error.status === 429 || error.message?.includes('rate limit')) {
    return {
      code: 'RATE_LIMIT',
      message: error.message || 'Rate limit exceeded',
      userMessage: 'AI service busy. Please wait 60 seconds and try again.',
      retryable: true,
      retryAfter: 60,
    };
  }

  // Timeout error
  if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
    return {
      code: 'TIMEOUT',
      message: error.message || 'Request timeout',
      userMessage: 'AI request timed out. Try again with a simpler task.',
      retryable: true,
    };
  }

  // Invalid JSON response
  if (error.message?.includes('JSON') || error.message?.includes('parse')) {
    return {
      code: 'INVALID_JSON',
      message: error.message,
      userMessage: 'AI returned invalid response. Please contact support.',
      retryable: false,
    };
  }

  // Authentication error
  if (error.status === 401 || error.status === 403) {
    return {
      code: 'AUTH_ERROR',
      message: error.message || 'Authentication failed',
      userMessage: 'Invalid API key. Please check your AI configuration.',
      retryable: false,
    };
  }

  // Service unavailable
  if (error.status === 503 || error.status === 502) {
    return {
      code: 'SERVICE_UNAVAILABLE',
      message: error.message || 'Service unavailable',
      userMessage: 'AI service temporarily unavailable. Please try again later.',
      retryable: true,
      retryAfter: 30,
    };
  }

  // AI features disabled
  if (error.message?.includes('disabled')) {
    return {
      code: 'AI_DISABLED',
      message: error.message,
      userMessage: 'AI features are disabled. Contact administrator to enable.',
      retryable: false,
    };
  }

  // Generic error
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'Unknown error',
    userMessage: 'An unexpected error occurred. Please try again.',
    retryable: true,
  };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: AiError): boolean {
  return error.retryable;
}

/**
 * Get retry delay in milliseconds
 */
export function getRetryDelay(error: AiError): number {
  return (error.retryAfter || 5) * 1000;
}
