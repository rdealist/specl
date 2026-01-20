'use client';

import React from 'react';

interface Issue {
  id: string;
  type: 'blocking' | 'recommendation';
  code: string;
  message: string;
  fieldPath?: string;
  canAutoFix?: boolean;
}

interface IssuesPanelProps {
  blockingIssues?: Issue[];
  recommendations?: Issue[];
  onAutoFix?: (issue: Issue) => void;
}

export const IssuesPanel: React.FC<IssuesPanelProps> = ({
  blockingIssues = [],
  recommendations = [],
  onAutoFix,
}) => {
  return (
    <aside className="w-80 h-screen overflow-y-auto bg-[var(--card)] border-l border-[var(--border)] hidden xl:flex xl:flex-col sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold">Document Health</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Blocking Issues */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--destructive)]" />
              Blocking Issues
            </h3>
            <span className="badge badge-destructive text-[10px]">
              {blockingIssues.length}
            </span>
          </div>

          {blockingIssues.length === 0 ? (
            <div className="p-4 border border-dashed border-[var(--border)] rounded-lg text-center">
              <svg className="w-6 h-6 text-[var(--success)] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-xs text-[var(--muted-foreground)]">
                No blocking issues
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {blockingIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onAutoFix={onAutoFix} />
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              Recommendations
            </h3>
            <span className="badge badge-accent text-[10px]">
              {recommendations.length}
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="p-4 border border-dashed border-[var(--border)] rounded-lg text-center">
              <p className="text-xs text-[var(--muted-foreground)]">
                No recommendations
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recommendations.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onAutoFix={onAutoFix} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Readiness Score */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Readiness</span>
          <span className="text-sm font-bold text-[var(--success)]">85%</span>
        </div>
        <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--success)] rounded-full transition-all duration-500"
            style={{ width: '85%' }}
          />
        </div>
      </div>
    </aside>
  );
};

const IssueCard: React.FC<{ issue: Issue; onAutoFix?: (issue: Issue) => void }> = ({
  issue,
  onAutoFix,
}) => {
  const isBlocking = issue.type === 'blocking';

  return (
    <div
      className={`p-3 rounded-lg border transition-colors ${
        isBlocking
          ? 'bg-[var(--destructive)]/5 border-[var(--destructive)]/20'
          : 'bg-[var(--accent)]/5 border-[var(--accent)]/20'
      }`}
    >
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xs font-mono text-[var(--muted-foreground)]">
          {issue.code}
        </span>
      </div>
      <p className="text-sm mb-2">{issue.message}</p>
      {issue.fieldPath && (
        <p className="text-xs text-[var(--muted-foreground)] font-mono mb-2">
          {issue.fieldPath}
        </p>
      )}
      {issue.canAutoFix && onAutoFix && (
        <button
          onClick={() => onAutoFix(issue)}
          className="btn btn-ghost text-xs px-2 py-1 h-auto text-[var(--accent)]"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Auto-fix with AI
        </button>
      )}
    </div>
  );
};
