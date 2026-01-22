'use client';

import React from 'react';

interface WarningItem {
  id: string;
  type: 'fallback' | 'question' | 'info' | 'error';
  message: string;
}

interface ExportWarningsProps {
  items: WarningItem[];
}

export const ExportWarnings: React.FC<ExportWarningsProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  const getWarningStyle = (type: WarningItem['type']) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-[var(--destructive)]/10',
          border: 'border-[var(--destructive)]/30',
          icon: 'text-[var(--destructive)]',
          label: 'Error',
        };
      case 'fallback':
        return {
          bg: 'bg-[var(--warning)]/10',
          border: 'border-[var(--warning)]/30',
          icon: 'text-[var(--warning)]',
          label: 'AI Fallback',
        };
      case 'question':
        return {
          bg: 'bg-[var(--accent)]/10',
          border: 'border-[var(--accent)]/30',
          icon: 'text-[var(--accent)]',
          label: 'Open Question',
        };
      case 'info':
      default:
        return {
          bg: 'bg-[var(--muted)]',
          border: 'border-[var(--border)]',
          icon: 'text-[var(--muted-foreground)]',
          label: 'Info',
        };
    }
  };

  return (
    <div className="w-80 border-l border-[var(--border)] bg-[var(--background)] h-full overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
          Warnings
        </h2>
        <span className="badge badge-warning text-xs">{items.length}</span>
      </div>

      {/* Warnings List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => {
          const style = getWarningStyle(item.type);
          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${style.bg} ${style.border} animate-slide-up`}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.type === 'error' ? (
                  <svg className={`w-4 h-4 ${style.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : item.type === 'fallback' ? (
                  <svg className={`w-4 h-4 ${style.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 ${style.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-xs font-semibold uppercase tracking-wide opacity-75">
                  {style.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{item.message}</p>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="p-4 border-t border-[var(--border)]">
        <p className="text-xs text-[var(--muted-foreground)]">
          Address warnings to improve export quality. Some warnings are informational only.
        </p>
      </div>
    </div>
  );
};
