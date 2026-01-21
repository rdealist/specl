'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReadinessResult } from '@/domain/readiness/types';

interface UseReadinessReturn {
  readiness: ReadinessResult | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useReadiness(documentId: string): UseReadinessReturn {
  const [readiness, setReadiness] = useState<ReadinessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadiness = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/documents/${documentId}/readiness`);
      if (response.ok) {
        const data = await response.json();
        setReadiness(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to evaluate readiness');
      }
    } catch (err) {
      console.error('Error fetching readiness:', err);
      setError('Network error while fetching readiness');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  // Initial fetch on mount
  useEffect(() => {
    fetchReadiness();
  }, [fetchReadiness]);

  const refresh = useCallback(async () => {
    await fetchReadiness();
  }, [fetchReadiness]);

  return {
    readiness,
    loading,
    error,
    refresh,
  };
}
