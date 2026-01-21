'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseDocumentFieldsReturn {
  fieldsJson: Record<string, any>;
  updateSection: (sectionKey: string, updates: Record<string, any>) => void;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
}

export function useDocumentFields(documentId: string): UseDocumentFieldsReturn {
  const [fieldsJson, setFieldsJson] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const loadFields = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}/fields`);
        if (response.ok) {
          const data = await response.json();
          setFieldsJson(data.fieldsJson);
          if (data.updatedAt) {
            setLastSaved(new Date(data.updatedAt));
          }
        } else {
          setError('Failed to load document fields');
        }
      } catch (err) {
        console.error('Error loading fields:', err);
        setError('Failed to load document fields');
      }
    };

    loadFields();
  }, [documentId]);

  // Save function
  const saveSection = useCallback(
    async (sectionKey: string, updates: Record<string, any>) => {
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch(`/api/documents/${documentId}/fields`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionKey, updates }),
        });

        if (response.ok) {
          const data = await response.json();
          setLastSaved(new Date(data.updatedAt));
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Save failed');
        }
      } catch (err) {
        console.error('Error saving fields:', err);
        setError('Network error while saving');
      } finally {
        setIsSaving(false);
      }
    },
    [documentId]
  );

  // Debounced save (500ms delay)
  const debouncedSave = useDebounce(saveSection, 500);

  // Update section with optimistic update
  const updateSection = useCallback(
    (sectionKey: string, updates: Record<string, any>) => {
      // Optimistic update
      setFieldsJson((prev) => ({
        ...prev,
        [sectionKey]: { ...(prev[sectionKey] || {}), ...updates },
      }));

      // Trigger debounced save
      debouncedSave(sectionKey, updates);
    },
    [debouncedSave]
  );

  return {
    fieldsJson,
    updateSection,
    isSaving,
    lastSaved,
    error,
  };
}
