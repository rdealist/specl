'use client';

import React, { useState, useEffect } from 'react';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { SectionNav } from '@/components/editor/SectionNav';
import { IssuesPanel } from '@/components/editor/IssuesPanel';
import { SectionRenderer } from '@/lib/template/sectionRenderer';
import { useDocumentFields } from '@/hooks/useDocumentFields';
import { useReadiness } from '@/hooks/useReadiness';
import { useAiFieldPatch } from '@/hooks/useAiFieldPatch';
import { useI18n } from '@/lib/i18n/context';
import { applyPatch } from '@/lib/jsonPatch';
import type { TemplateSchema } from '@/lib/template/types';
import type { Issue } from '@/domain/readiness/types';

interface EditorPageClientProps {
  id: string;
}

export default function EditorPageClient({ id }: EditorPageClientProps) {
  const { locale } = useI18n();
  const { fieldsJson, updateSection, isSaving, lastSaved, error: fieldsError } = useDocumentFields(id);
  const { readiness, loading: readinessLoading, error: readinessError, refresh: refreshReadiness } = useReadiness(id);
  const { generatePatch, loading: aiLoading, error: aiError } = useAiFieldPatch();

  const [document, setDocument] = useState<any>(null);
  const [template, setTemplate] = useState<TemplateSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiToast, setAiToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load document and template
  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/documents/${id}`);
        if (response.ok) {
          const data = await response.json();
          setDocument(data.document);
          setTemplate(data.document.template.schemaJson as TemplateSchema);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load document');
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError('Network error while loading document');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  // Refresh readiness after save
  useEffect(() => {
    if (lastSaved && !isSaving) {
      refreshReadiness();
    }
  }, [lastSaved, isSaving, refreshReadiness]);

  // Auto-hide AI toast after 5 seconds
  useEffect(() => {
    if (aiToast) {
      const timer = setTimeout(() => setAiToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [aiToast]);

  // Handle AI auto-fix for issues
  const handleAutoFix = async (issue: Issue) => {
    if (!issue.fieldPath) {
      setAiToast({ message: 'Cannot auto-fix: field path missing', type: 'error' });
      return;
    }

    // Parse field path (e.g., "requirements.0.acceptance" -> section: "requirements", field updates)
    const pathParts = issue.fieldPath.split('.');
    const sectionKey = pathParts[0];

    // Get current value from fieldsJson
    let currentValue = fieldsJson;
    for (const part of pathParts) {
      currentValue = currentValue?.[part];
    }

    // Call AI to generate patch
    const result = await generatePatch({
      documentId: id,
      targetFieldPath: issue.fieldPath,
      currentValue,
      documentSummary: {
        title: document?.title || 'Untitled Document',
      },
    });

    if (!result) {
      // Error already set in hook
      setAiToast({
        message: aiError?.error || 'Failed to generate AI suggestion',
        type: 'error',
      });
      return;
    }

    try {
      // Apply patches to fieldsJson
      const patchedFieldsJson = applyPatch(fieldsJson, result.patches);

      // Update each affected section
      // For simplicity, we'll update the entire section that contains the field
      const sectionData = patchedFieldsJson[sectionKey];
      await updateSection(sectionKey, sectionData);

      setAiToast({
        message: `AI suggestion applied successfully (${result.tokensUsed} tokens used)`,
        type: 'success',
      });

      // Refresh readiness after applying patch
      setTimeout(() => refreshReadiness(), 500);
    } catch (patchError) {
      console.error('Failed to apply AI patch:', patchError);
      setAiToast({
        message: 'Failed to apply AI suggestion',
        type: 'error',
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)]">Loading document...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!document || !template) {
    return null;
  }

  // Build section nav items from template
  const sections = template.sections.map((section, index) => ({
    id: section.key,
    title: section.title[locale],
    active: index === 0,
  }));

  return (
    <EditorLayout
      nav={
        <SectionNav
          sections={sections}
          documentId={id}
          documentTitle={document.title}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      }
      issues={<IssuesPanel readiness={readiness} loading={readinessLoading || aiLoading} onAutoFix={handleAutoFix} />}
    >
      <div className="pb-32 animate-fade-in">
        {/* Save indicator */}
        {fieldsError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {fieldsError}
          </div>
        )}

        {/* Document header */}
        <section className="mb-12 pb-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-default font-mono">PRD-{id}</span>
            <span className="badge badge-default">{document.status}</span>
            {readiness && (
              <span className="text-sm text-[var(--muted-foreground)]">
                {readiness.completion.requiredPercent}% complete
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{document.title}</h1>
          <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            {lastSaved && <span>Last saved: {new Date(lastSaved).toLocaleString()}</span>}
            <span>Language: {locale === 'zh' ? '中文' : 'English'}</span>
          </div>
        </section>

        {/* Render sections dynamically from template */}
        {template.sections.map((sectionSchema) => (
          <section key={sectionSchema.key} id={sectionSchema.key} className="mb-12">
            <SectionRenderer
              sectionSchema={sectionSchema}
              sectionData={fieldsJson[sectionSchema.key] || {}}
              onChange={(updates) => updateSection(sectionSchema.key, updates)}
              locale={locale}
              disabled={isSaving}
              showValidation={true}
              collapsible={true}
            />
          </section>
        ))}
      </div>

      {/* AI Toast Notification */}
      {aiToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              aiToast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {aiToast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span className="text-sm">{aiToast.message}</span>
          </div>
        </div>
      )}
    </EditorLayout>
  );
}
