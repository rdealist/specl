'use client';

import Link from "next/link";
import { useState } from "react";
import {
  DocumentIcon,
  PlusIcon,
  SettingsIcon,
  SpeclSimpleIcon,
  UserIcon,
} from "@/components/icons/specl-icons";
import { useT, useFormat } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

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
  const t = useT();
  const { formatRelativeTime } = useFormat();
  const [prds] = useState<PRDItem[]>(mockPRDs);
  const [showNewModal, setShowNewModal] = useState(false);

  const getStatusBadge = (status: PRDItem['status']) => {
    switch (status) {
      case 'ready_to_export':
        return <span className="badge badge-success">{t('dashboard.ready')}</span>;
      case 'draft':
        return <span className="badge badge-default">{t('dashboard.draft')}</span>;
      case 'archived':
        return <span className="badge badge-default">{t('dashboard.archived')}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="glass border-b border-[var(--border)] sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
                <SpeclSimpleIcon size={20} className="text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">{t('common.appName')}</span>
            </Link>
            <h1 className="hidden sm:block text-lg font-semibold">{t('dashboard.myPrds')}</h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="compact" />
            <button className="btn btn-ghost text-sm p-2">
              <SettingsIcon size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-sm font-medium">
              <UserIcon size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-1">{t('dashboard.myPrdsDesc')}</h2>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon size={16} />
            {t('dashboard.newPrd')}
          </button>
        </div>

        {/* PRD Grid */}
        {prds.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] flex items-center justify-center mx-auto mb-4">
              <DocumentIcon size={32} className="text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.noPrdsYet')}</h3>
            <p className="text-[var(--muted-foreground)] mb-6">
              {t('dashboard.noPrdsYetDesc')}
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="btn btn-primary"
            >
              {t('dashboard.createPrd')}
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
                    <DocumentIcon size={20} className="text-[var(--accent)]" />
                  </div>
                  {getStatusBadge(prd.status)}
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {prd.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
                  <span>{formatRelativeTime(prd.updatedAt)}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--muted-foreground)]">{t('dashboard.completion')}</span>
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
                <PlusIcon size={24} />
              </div>
              <span className="font-medium">{t('dashboard.newPrd')}</span>
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
            <h2 className="text-xl font-bold mb-4">{t('dashboard.createPrd')}</h2>

            <form onSubmit={(e) => { e.preventDefault(); setShowNewModal(false); }}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  {t('requirements.title')}
                </label>
                <input
                  id="title"
                  type="text"
                  className="input"
                  placeholder={t('requirements.title')}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="template" className="block text-sm font-medium mb-2">
                  {t('template.selectTemplate')}
                </label>
                <select id="template" className="input">
                  <option value="default">{t('template.defaultTemplate')}</option>
                  <option value="minimal">{t('template.minimalTemplate')}</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {t('common.confirm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
