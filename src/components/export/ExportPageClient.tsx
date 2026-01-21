'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExportSettings, ExportProfile, ExportLanguage, ExportScope } from './ExportSettings';
import { ExportPreview } from './ExportPreview';
import { ExportWarnings } from './ExportWarnings';

interface ExportResponse {
  context: Record<string, any>;
  cached: boolean;
  createdAt: string;
}

interface ExportError {
  error: string;
  validationErrors?: string[];
  message?: string;
}

export const ExportPageClient = ({ id }: { id: string }) => {
  const [profile, setProfile] = useState<ExportProfile>('standard');
  const [language, setLanguage] = useState<ExportLanguage>('zh');
  const [scope, setScope] = useState<ExportScope>('all');
  const [includeFlows, setIncludeFlows] = useState(false);
  const [generateFlows, setGenerateFlows] = useState(false);
  const [tokenBudget, setTokenBudget] = useState(45);
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const fetchExport = async () => {
      setIsLoading(true);
      setError(null);
      setValidationErrors([]);

      try {
        const response = await fetch(`/api/documents/${id}/export`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile,
            language,
            scope,
          }),
        });

        if (!response.ok) {
          const errorData: ExportError = await response.json();

          if (errorData.validationErrors) {
            setValidationErrors(errorData.validationErrors);
            setError('Export validation failed. See details below.');
          } else if (errorData.message) {
            setError(errorData.message);
          } else {
            setError(errorData.error || 'Export failed');
          }

          setPreviewContent('');
          setIsLoading(false);
          return;
        }

        const data: ExportResponse = await response.json();
        setPreviewContent(JSON.stringify(data.context, null, 2));
        setIsCached(data.cached);
        setIsLoading(false);

        // Estimate token budget based on content size
        const contentSize = JSON.stringify(data.context).length;
        const estimatedTokens = Math.ceil(contentSize / 4); // Rough estimate: 1 token ≈ 4 chars
        setTokenBudget(Math.min(100, Math.round((estimatedTokens / 10000) * 100)));
      } catch (err) {
        console.error('Export error:', err);
        setError('Failed to connect to export service');
        setPreviewContent('');
        setIsLoading(false);
      }
    };

    fetchExport();
  }, [id, profile, language, scope]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([previewContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prd.context.${language}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Build warnings based on current state
  const warnings = [];

  if (language === 'en') {
    warnings.push({
      id: 'en-not-implemented',
      type: 'error' as const,
      message: 'EN export is not yet implemented. AI translation will be available in Phase 5.',
    });
  }

  if (isCached) {
    warnings.push({
      id: 'cached',
      type: 'info' as const,
      message: language === 'zh'
        ? '此导出来自缓存,可能不包含最新更改。'
        : 'This export is from cache and may not include latest changes.',
    });
  }

  if (validationErrors.length > 0) {
    validationErrors.forEach((err, idx) => {
      warnings.push({
        id: `validation-${idx}`,
        type: 'error' as const,
        message: err,
      });
    });
  }

  if (error) {
    warnings.push({
      id: 'error',
      type: 'error' as const,
      message: error,
    });
  }

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Back button overlay */}
      <Link
        href={`/prd/${id}`}
        className="fixed top-4 left-4 z-50 btn btn-secondary text-sm shadow-lg"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Editor
      </Link>

      {/* Settings Panel */}
      <div className="w-80 h-full shrink-0">
        <ExportSettings
          profile={profile}
          setProfile={setProfile}
          language={language}
          setLanguage={setLanguage}
          scope={scope}
          setScope={setScope}
          includeFlows={includeFlows}
          setIncludeFlows={setIncludeFlows}
          generateFlows={generateFlows}
          setGenerateFlows={setGenerateFlows}
          tokenBudget={tokenBudget}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>

      {/* Preview Panel */}
      <ExportPreview content={previewContent} isLoading={isLoading} />

      {/* Warnings Panel */}
      <ExportWarnings items={warnings} />

      {/* Toast notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="badge badge-success px-4 py-2 shadow-lg">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied to clipboard
          </div>
        </div>
      )}
    </div>
  );
};
