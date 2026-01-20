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
import { ThemeSwitcher } from "@/components/theme";
import { useT } from "@/lib/i18n/context";

export default function Home() {
  const t = useT();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 aurora-gradient opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.08] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6] opacity-[0.08] blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-4 left-4 right-4 z-50 glass rounded-2xl">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[#8B5CF6] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <SpeclSimpleIcon size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">{t('common.appName')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors relative group">
              {t('nav.features')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all group-hover:w-full" />
            </Link>
            <Link href="#workflow" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors relative group">
              {t('nav.workflow')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all group-hover:w-full" />
            </Link>
            <Link href="#docs" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors relative group">
              {t('nav.docs')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all group-hover:w-full" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeSwitcher variant="compact" />
            <LanguageSwitcher variant="compact" />
            <Link href="/login" className="btn btn-ghost text-sm px-4">
              {t('auth.login')}
            </Link>
            <Link href="/register" className="btn btn-primary text-sm px-5">
              <span>{t('auth.signUp')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Misaki Studio inspired */}
      <main className="flex-1 pt-20 relative">
        <section className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Beta badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[var(--secondary)]/50 backdrop-blur-sm border border-[var(--border)] text-sm animate-fade-in relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary)]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse relative z-10" />
                <span className="relative z-10">{t('home.betaBadge')}</span>
              </div>

              {/* Hero heading with gradient */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 animate-slide-up leading-[1.1]">
                <span className="block">{t('home.heroTitle')}</span>
                <span className="gradient-text block mt-2">{t('home.heroTitleHighlight')}</span>
              </h1>

              {/* Hero description */}
              <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-12 max-w-2xl mx-auto animate-slide-up stagger-1 leading-relaxed">
                {t('home.heroDescription')}
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
                <Link href="/register" className="btn btn-primary px-10 py-4 text-base aurora-glow">
                  <span>{t('home.getStarted')}</span>
                  <ArrowRightIcon size={18} />
                </Link>
                <Link href="/prd/demo" className="btn btn-secondary px-10 py-4 text-base border-2 hover:border-[var(--primary)]/50 transition-all">
                  {t('home.viewDemo')}
                </Link>
              </div>

              {/* Quick stats */}
              <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up stagger-3">
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">100+</div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">PRDs Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">50+</div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold gradient-text">99%</div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section id="features" className="py-32 bg-[var(--card)]/30">
          <div className="container">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-6">
                Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('home.builtForProductThinking')}
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg">
                {t('home.builtForProductThinkingDesc')}
              </p>
            </div>

            <div className="bento-grid max-w-6xl mx-auto">
              {/* Feature 1 - Large card */}
              <div className="card card-interactive group bento-col-span-6 bento-row-span-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <DocumentIcon size={28} className="text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--primary)] transition-colors">
                    {t('features.structuredContext.title')}
                  </h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {t('features.structuredContext.description')}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card card-interactive group bento-col-span-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--success)]/20 to-[var(--success)]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircleIcon size={28} className="text-[var(--success)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--success)] transition-colors">
                    {t('features.readinessChecks.title')}
                  </h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {t('features.readinessChecks.description')}
                  </p>
                </div>
              </div>

              {/* Feature 3 - Large card */}
              <div className="card card-interactive group bento-col-span-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--warning)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--warning)]/20 to-[var(--warning)]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <SparklesIcon size={28} className="text-[var(--warning)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--warning)] transition-colors">
                      {t('features.aiAssistance.title')}
                    </h3>
                    <p className="text-[var(--muted-foreground)] leading-relaxed">
                      {t('features.aiAssistance.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-32">
          <div className="container">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-6">
                Workflow
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('home.simpleWorkflow')}
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg">
                {t('home.simpleWorkflowDesc')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white flex items-center justify-center mx-auto mb-6 font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    1
                  </div>
                  <h3 className="font-bold text-lg mb-3">{t('workflow.write.title')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {t('workflow.write.description')}
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white flex items-center justify-center mx-auto mb-6 font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    2
                  </div>
                  <h3 className="font-bold text-lg mb-3">{t('workflow.validate.title')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {t('workflow.validate.description')}
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white flex items-center justify-center mx-auto mb-6 font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    3
                  </div>
                  <h3 className="font-bold text-lg mb-3">{t('workflow.export.title')}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {t('workflow.export.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced with gradient */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[#8B5CF6] to-[#EC4899]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="container text-center relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('home.readyToStructure')}
            </h2>
            <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              {t('home.readyToStructureDesc')}
            </p>
            <Link href="/register" className="inline-flex items-center gap-3 bg-white text-[var(--primary)] hover:bg-gray-100 px-10 py-4 text-base font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-2xl">
              {t('home.getStartedFree')}
              <ArrowRightIcon size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--card)]/30 backdrop-blur-sm">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[#8B5CF6] rounded-lg flex items-center justify-center">
              <SpeclSimpleIcon size={18} className="text-white" />
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              {t('footer.copyright')}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="https://github.com" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-2 hover:scale-105 transform transition-all">
              <GitHubIcon size={18} />
              {t('footer.github')}
            </Link>
            <Link href="/docs" className="hover:text-[var(--foreground)] transition-colors hover:scale-105 transform transition-all">
              {t('footer.documentation')}
            </Link>
            <ThemeSwitcher variant="footer" />
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
