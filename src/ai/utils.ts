export function stripCodeFences(text: string): string {
  return text.replace(/^```[a-zA-Z]*\n/, "").replace(/```\s*$/, "").trim();
}

export function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function parseJsonResponse<T>(text: string): T | null {
  return safeJsonParse<T>(stripCodeFences(text));
}
