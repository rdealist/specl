'use client';

import React from 'react';
import Link from 'next/link';

interface Section {
  id: string;
  title: string;
  active?: boolean;
  hasIssue?: boolean;
}

interface SectionNavProps {
  sections: Section[];
  documentId?: string;
  documentTitle?: string;
}

export const SectionNav: React.FC<SectionNavProps> = ({ sections, documentId, documentTitle = 'Untitled PRD' }) => {
  return (
    <nav className="w-64 h-screen overflow-y-auto bg-[var(--card)] border-r border-[var(--border)] py-6 hidden lg:flex lg:flex-col sticky top-0">
      {/* Header */}
      <div className="px-4 mb-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm">Back</span>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-[var(--accent)] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="font-semibold text-sm truncate">{documentTitle}</span>
        </div>
        {documentId && (
          <span className="text-xs text-[var(--muted-foreground)] font-mono">
            {documentId}
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="flex-1 px-2">
        <div className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-2">
          Contents
        </div>
        <ul className="space-y-0.5">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                  section.active
                    ? 'bg-[var(--accent)]/15 text-[var(--foreground)] font-medium border border-[var(--accent)]/30'
                    : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
                }`}
              >
                <span>{section.title}</span>
                {section.hasIssue && (
                  <span className="w-2 h-2 rounded-full bg-[var(--destructive)]" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Export Button */}
      {documentId && (
        <div className="px-4 pt-4 border-t border-[var(--border)] mt-4">
          <Link
            href={`/prd/${documentId}/export`}
            className="btn btn-primary w-full text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </Link>
        </div>
      )}
    </nav>
  );
};
