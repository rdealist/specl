'use client';

/**
 * 语言切换组件
 */

import { useLocale } from '@/lib/i18n/context';
import { LOCALE_NAMES } from '@/lib/i18n/config';
import { SpeclSimpleIcon } from '@/components/icons/specl-icons';
import { useState } from 'react';

export function LanguageSwitcher({ variant = 'header' }: { variant?: 'header' | 'footer' | 'compact' }) {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'zh' as const, name: '简体中文', flag: '🇨🇳' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  // 紧凑模式（用于移动端）
  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] transition-colors text-sm"
        title={LOCALE_NAMES[locale === 'zh' ? 'en' : 'zh']}
      >
        <span className="text-base">{locale === 'zh' ? '🇺🇸' : '🇨🇳'}</span>
        <span className="hidden sm:inline">{locale === 'zh' ? 'EN' : '中文'}</span>
      </button>
    );
  }

  // 下拉菜单模式
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--muted)] transition-colors text-sm"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
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
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  setLocale(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  locale === language.code
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'hover:bg-[var(--secondary)]'
                }`}
              >
                <span className="text-base">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                {locale === language.code && (
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

// 带图标的语言切换器（用于设置页面）
export function LanguageSetting() {
  const { locale, setLocale } = useLocale();

  const languages = [
    { code: 'zh' as const, name: '简体中文', description: 'Simplified Chinese', flag: '🇨🇳' },
    { code: 'en' as const, name: 'English', description: 'English (United States)', flag: '🇺🇸' },
  ];

  return (
    <div className="space-y-3">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => setLocale(language.code)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
            locale === language.code
              ? 'border-[var(--accent)] bg-[var(--accent)]/5'
              : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
          }`}
        >
          <span className="text-2xl">{language.flag}</span>
          <div className="flex-1 text-left">
            <div className="font-semibold mb-0.5">{language.name}</div>
            <div className="text-sm text-[var(--muted-foreground)]">{language.description}</div>
          </div>
          {locale === language.code && (
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
