'use client';

import React from 'react';

interface RequirementCardProps {
  id: string;
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  userStory: string;
  acceptance: string[];
  edgeCases?: string[];
  flows?: string[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
  id,
  title,
  priority,
  userStory,
  acceptance,
  edgeCases = [],
  flows = [],
  isExpanded = false,
  onToggle,
}) => {
  const priorityClass = {
    P0: 'priority-p0',
    P1: 'priority-p1',
    P2: 'priority-p2',
  }[priority];

  return (
    <div className="card group hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-[var(--muted-foreground)]">{id}</span>
            <span className={`badge text-[10px] uppercase tracking-wider ${priorityClass}`}>
              {priority}
            </span>
          </div>
          <h3 className="font-semibold text-base group-hover:text-[var(--accent)] transition-colors">
            {title}
          </h3>
        </div>
        <button className="p-1 rounded hover:bg-[var(--muted)] transition-colors">
          <svg
            className={`w-5 h-5 text-[var(--muted-foreground)] transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* User Story */}
      <div className="mt-4">
        <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-1.5">
          User Story
        </h4>
        <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
          {userStory}
        </p>
      </div>

      {/* Expandable Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Acceptance Criteria */}
        {acceptance.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
              Acceptance Criteria
            </h4>
            <ul className="space-y-2">
              {acceptance.map((criteria, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--success)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--foreground)]/80">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Edge Cases */}
        {edgeCases.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
              Edge Cases
            </h4>
            <ul className="space-y-2">
              {edgeCases.map((edgeCase, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <svg className="w-4 h-4 text-[var(--warning)] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-[var(--foreground)]/80">{edgeCase}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Flows */}
        {flows.length > 0 && (
          <div>
            <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
              Flows
            </h4>
            <div className="flex flex-wrap gap-2">
              {flows.map((flow, idx) => (
                <span key={idx} className="badge badge-default">
                  {flow}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats (when collapsed) */}
      {!isExpanded && (
        <div className="mt-4 pt-3 border-t border-[var(--border)] flex gap-4 text-xs text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {acceptance.length} Criteria
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            {edgeCases.length} Edge Cases
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            {flows.length} Flows
          </span>
        </div>
      )}
    </div>
  );
};
