/**
 * Generate SHA-256 hash for export content caching
 */

import crypto from 'crypto';

/**
 * Generate SHA-256 hash of export content
 * Used for deduplication and caching
 */
export function generateCacheKey(content: Record<string, any>): string {
  const jsonString = JSON.stringify(content, null, 0); // Compact JSON
  const hash = crypto.createHash('sha256');
  hash.update(jsonString);
  return hash.digest('hex');
}

/**
 * Generate cache key from export parameters
 * Used to check if export already exists
 */
export function generateExportParamsKey(params: {
  documentId: string;
  profile: string;
  language: string;
  scope: string;
}): string {
  const paramsString = JSON.stringify(params, Object.keys(params).sort());
  const hash = crypto.createHash('sha256');
  hash.update(paramsString);
  return hash.digest('hex');
}
