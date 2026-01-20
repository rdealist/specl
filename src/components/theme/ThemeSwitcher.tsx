'use client';

/**
 * Theme Switcher Component
 * Provides a dropdown menu for theme selection (dark/light/system)
 */

import { useTheme } from '@/lib/theme';
import { useT } from '@/lib/i18n/context';
import { useState } from 'react';

interface ThemeSwitcherProps {
  variant?: 'header' | 'footer' | 'compact';
}

export function ThemeSwitcher({ variant = 'header' }: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'dark' as const, name: t('settings.darkMode'), icon: '🌙' },
    { value: 'light' as const, name: t('settings.lightMode'), icon: '☀️' },
    { value: 'system' as const, name: t('settings.autoMode'), icon: '💻' },
  ];

  const currentTheme = themes.find((th) => th.value === theme) || themes[0];

  // Compact mode (for mobile)
  if (variant === 'compact') {
    return (
      <button
        onClick={() => {
          if (resolvedTheme === 'dark') {
            setTheme('light');
          } else {
            setTheme('dark');
          }
        }}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] transition-colors text-sm cursor-pointer"
        title={resolvedTheme === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}
      >
        <span className="text-base">{resolvedTheme === 'dark' ? '🌙' : '☀️'}</span>
      </button>
    );
  }

  // Dropdown menu mode
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] transition-colors text-sm cursor-pointer"
      >
        <span className="text-base">{currentTheme.icon}</span>
        <span className="hidden sm:inline">{currentTheme.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-20 animate-slide-down">
            {themes.map((th) => (
              <button
                key={th.value}
                onClick={() => {
                  setTheme(th.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                  theme === th.value
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'hover:bg-[var(--secondary)]'
                }`}
              >
                <span className="text-base">{th.icon}</span>
                <span className="flex-1">{th.name}</span>
                {theme === th.value && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Theme setting card (for settings page)
export function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  const t = useT();

  const themes = [
    {
      value: 'dark' as const,
      name: t('settings.darkMode'),
      description: '暗色主题，适合夜间使用',
      icon: '🌙',
    },
    {
      value: 'light' as const,
      name: t('settings.lightMode'),
      description: '亮色主题，清晰明亮',
      icon: '☀️',
    },
    {
      value: 'system' as const,
      name: t('settings.autoMode'),
      description: '跟随系统设置自动切换',
      icon: '💻',
    },
  ];

  return (
    <div className="space-y-3">
      {themes.map((th) => (
        <button
          key={th.value}
          onClick={() => setTheme(th.value)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
            theme === th.value
              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
          }`}
        >
          <span className="text-2xl">{th.icon}</span>
          <div className="flex-1 text-left">
            <div className="font-semibold mb-0.5">{th.name}</div>
            <div className="text-sm text-[var(--muted-foreground)]">{th.description}</div>
          </div>
          {theme === th.value && (
            <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
