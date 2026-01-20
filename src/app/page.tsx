'use client';

import Link from "next/link";
import {
  SpeclSimpleIcon,
  ArrowRightIcon,
  DocumentIcon,
  CheckCircleIcon,
  SparklesIcon,
  GitHubIcon,
} from "@/components/icons/specl-icons";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useT } from "@/lib/i18n/context";

export default function Home() {
  const t = useT();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
              <SpeclSimpleIcon size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">{t('common.appName')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              {t('nav.features')}
            </Link>
            <Link href="#workflow" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              {t('nav.workflow')}
            </Link>
            <Link href="#docs" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              {t('nav.docs')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="compact" />
            <Link href="/login" className="btn btn-ghost text-sm">
              {t('auth.login')}
            </Link>
            <Link href="/register" className="btn btn-primary text-sm">
              {t('auth.signUp')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--accent)] opacity-[0.08] blur-[120px] rounded-full" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-[var(--secondary)] text-sm text-[var(--muted-foreground)] animate-fade-in border border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
                {t('home.betaBadge')}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                {t('home.heroTitle')}
                <br />
                <span className="gradient-text">{t('home.heroTitleHighlight')}</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
                {t('home.heroDescription')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
                <Link href="/register" className="btn btn-primary px-8 py-3 text-base">
                  {t('home.getStarted')}
                  <ArrowRightIcon size={16} />
                </Link>
                <Link href="/prd/demo" className="btn btn-secondary px-8 py-3 text-base">
                  {t('home.viewDemo')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-[var(--card)]">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.builtForProductThinking')}
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
                {t('home.builtForProductThinkingDesc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card card-interactive group">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/25 transition-colors">
                  <DocumentIcon size={24} className="text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('features.structuredContext.title')}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {t('features.structuredContext.description')}
                </p>
              </div>

              <div className="card card-interactive group">
                <div className="w-12 h-12 rounded-xl bg-[var(--success)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--success)]/25 transition-colors">
                  <CheckCircleIcon size={24} className="text-[var(--success)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('features.readinessChecks.title')}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {t('features.readinessChecks.description')}
                </p>
              </div>

              <div className="card card-interactive group">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--warning)]/25 transition-colors">
                  <SparklesIcon size={24} className="text-[var(--warning)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('features.aiAssistance.title')}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {t('features.aiAssistance.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.simpleWorkflow')}
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
                {t('home.simpleWorkflowDesc')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">{t('workflow.write.title')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('workflow.write.description')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">{t('workflow.validate.title')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('workflow.validate.description')}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">{t('workflow.export.title')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t('workflow.export.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[var(--accent)] relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="container text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('home.readyToStructure')}
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              {t('home.readyToStructureDesc')}
            </p>
            <Link href="/register" className="btn bg-white text-[var(--accent)] hover:bg-gray-100 px-8 py-3 text-base font-semibold">
              {t('home.getStartedFree')}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--accent)] rounded-md flex items-center justify-center">
              <SpeclSimpleIcon size={16} className="text-white" />
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              {t('footer.copyright')}
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="https://github.com" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
              <GitHubIcon size={16} />
              {t('footer.github')}
            </Link>
            <Link href="/docs" className="hover:text-[var(--foreground)] transition-colors">
              {t('footer.documentation')}
            </Link>
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
