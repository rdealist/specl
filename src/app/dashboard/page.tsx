'use client';

import Link from "next/link";
import { useState } from "react";
import {
  DocumentIcon,
  PlusIcon,
  SettingsIcon,
  SpeclSimpleIcon,
  UserIcon,
  CheckCircleIcon,
  SparklesIcon,
  XIcon,
} from "@/components/icons/specl-icons";
import { useT, useFormat } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/theme";

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

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-[var(--success)]';
    if (percent >= 70) return 'bg-[#8B5CF6]';
    if (percent >= 40) return 'bg-[var(--warning)]';
    return 'bg-[var(--primary)]';
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.05] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B5CF6] opacity-[0.05] blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-4 left-4 right-4 z-50 glass rounded-2xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[#8B5CF6] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                <SpeclSimpleIcon size={20} className="text-white" />
              </div>
              <span className="font-semibold text-lg tracking-tight">{t('common.appName')}</span>
            </Link>
            <h1 className="hidden sm:block text-lg font-semibold">{t('dashboard.myPrds')}</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSwitcher variant="compact" />
            <LanguageSwitcher variant="compact" />
            <button className="btn btn-ghost text-sm p-2 hover:bg-[var(--secondary)] transition-colors">
              <SettingsIcon size={18} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-medium shadow-lg">
              <UserIcon size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('dashboard.myPrdsDesc')}</h2>
            <p className="text-[var(--muted-foreground)]">
              Manage your PRDs and track progress
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn btn-primary shadow-lg hover:shadow-xl transition-all"
          >
            <PlusIcon size={16} />
            <span>{t('dashboard.newPrd')}</span>
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 flex items-center justify-center">
                  <DocumentIcon size={24} className="text-[var(--primary)]" />
                </div>
                <span className="text-3xl font-bold gradient-text">{prds.length}</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">Total PRDs</p>
            </div>
          </div>

          <div className="card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--success)]/20 to-[var(--success)]/5 flex items-center justify-center">
                  <CheckCircleIcon size={24} className="text-[var(--success)]" />
                </div>
                <span className="text-3xl font-bold text-[var(--success)]">
                  {prds.filter(p => p.status === 'ready_to_export').length}
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">Completed</p>
            </div>
          </div>

          <div className="card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--warning)]/20 to-[var(--warning)]/5 flex items-center justify-center">
                  <SparklesIcon size={24} className="text-[var(--warning)]" />
                </div>
                <span className="text-3xl font-bold text-[var(--warning)]">
                  {prds.filter(p => p.status === 'draft').length}
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">In Progress</p>
            </div>
          </div>
        </div>

        {/* PRD Grid */}
        {prds.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--secondary)] to-[var(--border)] flex items-center justify-center mx-auto mb-6">
              <DocumentIcon size={40} className="text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-xl font-bold mb-3">{t('dashboard.noPrdsYet')}</h3>
            <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prds.map((prd, index) => (
              <Link
                key={prd.id}
                href={`/prd/${prd.id}`}
                className={`card card-interactive group relative overflow-hidden animate-slide-up stagger-${index + 1}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[var(--primary)] group-hover:to-[#8B5CF6] transition-all duration-300">
                      <DocumentIcon size={24} className="text-[var(--primary)] group-hover:text-white transition-colors" />
                    </div>
                    {getStatusBadge(prd.status)}
                  </div>

                  <h3 className="font-bold text-lg mb-3 group-hover:text-[var(--primary)] transition-colors">
                    {prd.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatRelativeTime(prd.updatedAt)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[var(--muted-foreground)] font-medium">{t('dashboard.completion')}</span>
                      <span className="font-bold">{prd.completionPercent}%</span>
                    </div>
                    <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getProgressColor(prd.completionPercent)}`}
                        style={{ width: `${prd.completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* New PRD Card */}
            <button
              onClick={() => setShowNewModal(true)}
              className="card border-dashed border-2 border-[var(--border)] flex flex-col items-center justify-center py-16 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/50 hover:bg-gradient-to-br hover:from-[var(--primary)]/5 hover:to-transparent transition-all group min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--secondary)] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[var(--primary)] group-hover:to-[#8B5CF6] transition-all duration-300">
                <PlusIcon size={32} className="group-hover:text-white transition-colors" />
              </div>
              <span className="font-bold text-lg">{t('dashboard.newPrd')}</span>
            </button>
          </div>
        )}
      </main>

      {/* New PRD Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowNewModal(false)}
          />
          <div className="relative bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in border border-[var(--border)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t('dashboard.createPrd')}</h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-[var(--secondary)] flex items-center justify-center transition-colors"
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowNewModal(false); }} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-3">
                  {t('requirements.title')}
                </label>
                <input
                  id="title"
                  type="text"
                  className="input focus:ring-2 focus:ring-[var(--primary)]/20"
                  placeholder={t('requirements.title')}
                  required
                />
              </div>

              <div>
                <label htmlFor="template" className="block text-sm font-semibold mb-3">
                  {t('template.selectTemplate')}
                </label>
                <select id="template" className="input focus:ring-2 focus:ring-[var(--primary)]/20">
                  <option value="default">{t('template.defaultTemplate')}</option>
                  <option value="minimal">{t('template.minimalTemplate')}</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  <span>{t('common.confirm')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
