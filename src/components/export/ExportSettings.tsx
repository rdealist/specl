'use client';

import React from 'react';

export type ExportProfile = 'lean' | 'standard' | 'detailed';
export type ExportLanguage = 'zh' | 'en';
export type ExportScope = 'all' | 'p0_only' | 'p0_p1';

interface ExportSettingsProps {
  profile: ExportProfile;
  setProfile: (value: ExportProfile) => void;
  language: ExportLanguage;
  setLanguage: (value: ExportLanguage) => void;
  scope: ExportScope;
  setScope: (value: ExportScope) => void;
  includeFlows: boolean;
  setIncludeFlows: (value: boolean) => void;
  generateFlows: boolean;
  setGenerateFlows: (value: boolean) => void;
  tokenBudget: number;
  onCopy: () => void;
  onDownload: () => void;
}

export const ExportSettings: React.FC<ExportSettingsProps> = ({
  profile,
  setProfile,
  language,
  setLanguage,
  scope,
  setScope,
  includeFlows,
  setIncludeFlows,
  generateFlows,
  setGenerateFlows,
  tokenBudget,
  onCopy,
  onDownload,
}) => {
  const profileDescriptions = {
    lean: 'Minimal fields, optimized for token budget',
    standard: 'Balanced with journeys and tracking',
    detailed: 'Full context including release info',
  };

  return (
    <div className="flex flex-col h-full bg-[var(--muted)] border-r border-[var(--border)]">
      <div className="p-6 border-b border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wider">Export Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Profile */}
        <div>
          <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
            Profile
          </label>
          <div className="space-y-2">
            {(['lean', 'standard', 'detailed'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 border ${
                  profile === p
                    ? 'bg-[var(--background)] border-[var(--accent)] shadow-sm'
                    : 'bg-transparent border-[var(--border)] hover:bg-[var(--background)]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${profile === p ? 'text-[var(--accent)]' : ''}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </span>
                  {profile === p && (
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {profileDescriptions[p]}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
            Language
          </label>
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
            <button
              onClick={() => setLanguage('zh')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                language === 'zh'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              中文
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors border-l border-[var(--border)] ${
                language === 'en'
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              English
            </button>
          </div>
          {language === 'en' && (
            <p className="text-xs text-[var(--warning)] mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI translation will be used
            </p>
          )}
        </div>

        {/* Scope */}
        <div>
          <label className="block text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
            Requirement Scope
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as ExportScope)}
            className="input"
          >
            <option value="all">All Requirements</option>
            <option value="p0_only">P0 Only</option>
            <option value="p0_p1">P0 & P1</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer group">
            <div>
              <span className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors">
                Include Flows
              </span>
              <p className="text-xs text-[var(--muted-foreground)]">Add flow steps to lean profile</p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${includeFlows ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'} relative`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${includeFlows ? 'translate-x-5' : 'translate-x-1'}`} />
              <input
                type="checkbox"
                checked={includeFlows}
                onChange={(e) => setIncludeFlows(e.target.checked)}
                className="sr-only"
                disabled={profile !== 'lean'}
              />
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <div>
              <span className="text-sm font-medium group-hover:text-[var(--accent)] transition-colors">
                Generate Suggested Flows
              </span>
              <p className="text-xs text-[var(--muted-foreground)]">AI generates journey steps</p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${generateFlows ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'} relative`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${generateFlows ? 'translate-x-5' : 'translate-x-1'}`} />
              <input
                type="checkbox"
                checked={generateFlows}
                onChange={(e) => setGenerateFlows(e.target.checked)}
                className="sr-only"
              />
            </div>
          </label>
        </div>

        {/* Token Budget */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
              Token Budget
            </label>
            <span className={`text-sm font-bold ${
              tokenBudget > 90 ? 'text-[var(--destructive)]' : tokenBudget > 75 ? 'text-[var(--warning)]' : 'text-[var(--success)]'
            }`}>
              {tokenBudget}%
            </span>
          </div>
          <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                tokenBudget > 90 ? 'bg-[var(--destructive)]' : tokenBudget > 75 ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'
              }`}
              style={{ width: `${tokenBudget}%` }}
            />
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            Estimated token usage for AI context
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-[var(--border)] space-y-3">
        <button
          onClick={onCopy}
          className="btn btn-secondary w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy JSON
        </button>
        <button
          onClick={onDownload}
          className="btn btn-primary w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download JSON
        </button>
      </div>
    </div>
  );
};
