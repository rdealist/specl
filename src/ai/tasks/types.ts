export interface AiJsonResponse<TPayload = unknown> {
  type: string;
  payload: TPayload;
  openQuestions?: string[];
  warnings?: string[];
}

export interface AiTaskOptions {
  model: string;
  maxTokens?: number;
  temperature?: number;
}
