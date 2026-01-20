'use client';

/**
 * i18n React 上下文
 * 提供客户端多语言支持
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from './config';
import {
  t as tFn,
  setLocale as setLocaleFn,
  getLocale as getLocaleFn,
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercent,
  formatFileSize,
} from '.';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date | string, format?: 'short' | 'long' | 'full' | 'time') => string;
  formatRelativeTime: (date: Date | string) => string;
  formatNumber: (num: number) => string;
  formatPercent: (num: number, decimals?: number) => string;
  formatFileSize: (bytes: number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || 'zh');
  const [isClient, setIsClient] = useState(false);

  // 客户端 hydration
  useEffect(() => {
    setIsClient(true);

    // 从 localStorage 读取语言设置
    const stored = localStorage.getItem('specl_locale') as Locale | null;
    if (stored && (stored === 'zh' || stored === 'en')) {
      setLocaleState(stored);
      setLocaleFn(stored);
    } else {
      // 从浏览器语言检测
      const browserLang = navigator.language.toLowerCase();
      const detected = browserLang.startsWith('zh') ? 'zh' : 'en';
      setLocaleState(detected);
      setLocaleFn(detected);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleFn(newLocale);
    localStorage.setItem('specl_locale', newLocale);
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: tFn,
    formatDate,
    formatRelativeTime,
    formatNumber,
    formatPercent,
    formatFileSize,
  };

  // 避免 hydration 不匹配
  if (!isClient) {
    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * 使用 i18n 钩子
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

/**
 * 简化的翻译钩子
 * 只返回 t 函数，减少解构
 */
export function useT() {
  const { t } = useI18n();
  return t;
}

/**
 * 格式化钩子
 * 返回所有格式化函数
 */
export function useFormat() {
  const { formatDate, formatRelativeTime, formatNumber, formatPercent, formatFileSize } = useI18n();
  return { formatDate, formatRelativeTime, formatNumber, formatPercent, formatFileSize };
}

/**
 * 语言切换钩子
 */
export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
