'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpeclSimpleIcon } from "@/components/icons/specl-icons";
import { useT } from "@/lib/i18n/context";

export default function RegisterPage() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsNotMatch'));
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('auth.registerFailed'));
        return;
      }

      router.push('/dashboard');
    } catch {
      setError(t('auth.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex flex-1 bg-[var(--accent)] items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="max-w-md text-white relative">
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-8">
            <SpeclSimpleIcon size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {t('home.heroTitle')} {t('home.heroTitleHighlight')}
          </h2>
          <p className="text-white/70 text-lg mb-8">
            {t('home.heroDescription')}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">{t('features.structuredContext.title')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">{t('features.aiAssistance.title')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm">{t('features.readinessChecks.title')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('auth.backToHome')}
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('auth.createAccount')}</h1>
            <p className="text-[var(--muted-foreground)]">
              {t('auth.createAccountDesc')}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-[var(--destructive)]/15 border border-[var(--destructive)]/30 text-[var(--destructive)] text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
              <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                {t('auth.passwordTooShort')}
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                {t('auth.confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.loading')}
                </span>
              ) : (
                t('auth.signUp')
              )}
            </button>

            <p className="text-xs text-center text-[var(--muted-foreground)]">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-[var(--foreground)]">{t('footer.terms')}</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-[var(--foreground)]">{t('footer.privacy')}</Link>
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-[var(--accent)] hover:underline font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
