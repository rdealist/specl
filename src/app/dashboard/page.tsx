'use client';

import Link from "next/link";
import { useState } from "react";

interface PRDItem {
  id: string;
  title: string;
  status: 'draft' | 'ready_to_export' | 'archived';
  updatedAt: string;
  completionPercent: number;
}

const mockPRDs: PRDItem[] = [
  {
    id: 'prd-001',
    title: 'User Authentication System',
    status: 'ready_to_export',
    updatedAt: '2025-01-20T10:30:00Z',
    completionPercent: 100,
  },
  {
    id: 'prd-002',
    title: 'Payment Integration',
    status: 'draft',
    updatedAt: '2025-01-19T15:45:00Z',
    completionPercent: 65,
  },
  {
    id: 'prd-003',
    title: 'Dashboard Analytics',
    status: 'draft',
    updatedAt: '2025-01-18T09:20:00Z',
    completionPercent: 30,
  },
];

export default function DashboardPage() {
  const [prds] = useState<PRDItem[]>(mockPRDs);
  const [showNewModal, setShowNewModal] = useState(false);

  const getStatusBadge = (status: PRDItem['status']) => {
    switch (status) {
      case 'ready_to_export':
        return <span className="badge badge-success">Ready</span>;
      case 'draft':
        return <span className="badge badge-default">Draft</span>;
      case 'archived':
        return <span className="badge badge-default">Archived</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="glass border-b border-[var(--border)] sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">Specl</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="btn btn-ghost text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">My PRDs</h1>
            <p className="text-[var(--muted-foreground)]">
              Create and manage your product requirement documents
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New PRD
          </button>
        </div>

        {/* PRD Grid */}
        {prds.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No PRDs yet</h3>
            <p className="text-[var(--muted-foreground)] mb-6">
              Create your first PRD to get started
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="btn btn-primary"
            >
              Create PRD
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prds.map((prd, index) => (
              <Link
                key={prd.id}
                href={`/prd/${prd.id}`}
                className={`card card-interactive group animate-slide-up stagger-${index + 1}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/15 flex items-center justify-center group-hover:bg-[var(--accent)]/25 transition-colors">
                    <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {getStatusBadge(prd.status)}
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {prd.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                  <span>{formatDate(prd.updatedAt)}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--muted-foreground)]">Completion</span>
                    <span className="font-medium">{prd.completionPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        prd.completionPercent === 100 ? 'bg-[var(--success)]' : 'bg-[var(--accent)]'
                      }`}
                      style={{ width: `${prd.completionPercent}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}

            {/* New PRD Card */}
            <button
              onClick={() => setShowNewModal(true)}
              className="card border-dashed border-2 border-[var(--border)] flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--secondary)] flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium">New PRD</span>
            </button>
          </div>
        )}
      </main>

      {/* New PRD Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 animate-fade-in"
            onClick={() => setShowNewModal(false)}
          />
          <div className="relative bg-[var(--card)] rounded-xl shadow-2xl w-full max-w-md p-6 animate-scale-in border border-[var(--border)]">
            <h2 className="text-xl font-bold mb-4">Create new PRD</h2>

            <form onSubmit={(e) => { e.preventDefault(); setShowNewModal(false); }}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="input"
                  placeholder="e.g., User Authentication System"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="template" className="block text-sm font-medium mb-2">
                  Template
                </label>
                <select id="template" className="input">
                  <option value="default">Default Template</option>
                  <option value="minimal">Minimal Template</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
