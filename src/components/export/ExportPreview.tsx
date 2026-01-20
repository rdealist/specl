'use client';

import React from 'react';

interface ExportPreviewProps {
  content: string;
  isLoading?: boolean;
}

export const ExportPreview: React.FC<ExportPreviewProps> = ({ content, isLoading }) => {
  return (
    <div className="flex-1 h-full bg-[var(--background)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold">Preview</h2>
          <span className="badge badge-default text-xs font-mono">prd.context.json</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span>{content ? `${content.split('\n').length} lines` : '0 lines'}</span>
          <span>•</span>
          <span>{content ? `${(new Blob([content]).size / 1024).toFixed(1)} KB` : '0 KB'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-[var(--muted)]">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="card flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-4 text-[var(--accent)] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-[var(--muted-foreground)]">Generating preview...</p>
              </div>
            </div>
          ) : content ? (
            <div className="card p-0 overflow-hidden">
              <div className="bg-[var(--muted)] px-4 py-2 border-b border-[var(--border)] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--destructive)]/60" />
                <div className="w-3 h-3 rounded-full bg-[var(--warning)]/60" />
                <div className="w-3 h-3 rounded-full bg-[var(--success)]/60" />
              </div>
              <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto">
                <code className="text-[var(--foreground)]">{content}</code>
              </pre>
            </div>
          ) : (
            <div className="card flex items-center justify-center py-20">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-[var(--muted-foreground)]">No content generated yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
