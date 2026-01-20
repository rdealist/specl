/**
 * i18n 配置
 * 支持的语言
 */

export const SUPPORTED_LOCALES = ['zh', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'zh';

export const LOCALE_NAMES: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
};

// 本地存储的 key
export const LOCALE_STORAGE_KEY = 'specl_locale';

// Cookie key
export const LOCALE_COOKIE_KEY = 'specl_locale';
