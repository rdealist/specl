/**
 * i18n 核心模块
 * 提供翻译函数和类型定义
 */

import { zh } from './locales/zh';
import { en } from './locales/en';
import type { Locale } from './config';

// 所有翻译的类型（基于中文）
export type Translations = typeof zh;
export type TranslationKey = keyof Translations;

// 翻译映射（使用 unknown 解决类型兼容性问题）
const translations: Record<Locale, Translations> = {
  zh,
  en: en as unknown as Translations,
};

// 默认语言
let currentLocale: Locale = 'zh' as Locale;

/**
 * 获取当前语言
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * 设置当前语言
 */
export function setLocale(locale: Locale): void {
  if (locale !== currentLocale) {
    currentLocale = locale;
  }
}

/**
 * 获取翻译文本
 * @param key 翻译键，支持点号分隔的路径，如 'common.appName'
 * @param params 参数对象，用于替换模板中的 {{param}}
 * @returns 翻译后的文本
 *
 * @example
 * t('common.appName') // 'Specl'
 * t('validation.minLength', { min: 8 }) // 'Must be at least 8 characters'
 */
export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const keys = key.split('.');
  let result: any = translations[currentLocale];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      // 如果找不到翻译，尝试使用默认语言（中文）
      result = translations.zh;
      for (const k2 of keys) {
        if (result && typeof result === 'object' && k2 in result) {
          result = result[k2];
        } else {
          return key; // 找不到翻译，返回 key
        }
      }
      break;
    }
  }

  if (typeof result !== 'string') {
    return key;
  }

  // 替换参数
  if (params) {
    return result.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return result;
}

/**
 * 检查翻译是否存在
 */
export function hasTranslation(key: string): boolean {
  const keys = key.split('.');
  let result: any = translations[currentLocale];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return false;
    }
  }

  return typeof result === 'string';
}

/**
 * 获取所有可用语言
 */
export function getLocales(): Locale[] {
  return Object.keys(translations) as Locale[];
}

/**
 * 获取所有翻译
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

/**
 * 带类型的翻译钩子（用于客户端组件）
 */
export function useTranslations() {
  return {
    locale: currentLocale,
    t,
    setLocale,
    hasTranslation,
  };
}

/**
 * 日期格式化
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'full' | 'time' = 'short',
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = currentLocale === 'zh' ? 'zh-CN' : 'en-US';

  const formats: Record<Locale, Record<typeof format, string>> = {
    zh: {
      short: 'YYYY/MM/DD',
      long: 'YYYY年MM月DD日',
      full: 'YYYY年MM月DD日 HH:mm',
      time: 'HH:mm',
    },
    en: {
      short: 'MM/DD/YYYY',
      long: 'MMMM D, YYYY',
      full: 'MMMM D, YYYY HH:mm',
      time: 'HH:mm',
    },
  };

  const formatStr = formats[currentLocale][format];

  return formatStr
    .replace('YYYY', dateObj.getFullYear().toString())
    .replace('MM', String(dateObj.getMonth() + 1).padStart(2, '0'))
    .replace('DD', String(dateObj.getDate()).padStart(2, '0'))
    .replace('HH', String(dateObj.getHours()).padStart(2, '0'))
    .replace('mm', String(dateObj.getMinutes()).padStart(2, '0'))
    .replace('MMMM', dateObj.toLocaleString(locale, { month: 'long' }))
    .replace('D', dateObj.getDate().toString());
}

/**
 * 相对时间格式化
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (currentLocale === 'zh') {
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    return formatDate(dateObj, 'short');
  } else {
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateObj, 'short');
  }
}

/**
 * 数字格式化
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat(currentLocale === 'zh' ? 'zh-CN' : 'en-US').format(
    num,
  );
}

/**
 * 百分比格式化
 */
export function formatPercent(num: number, decimals: number = 1): string {
  return new Intl.NumberFormat(currentLocale === 'zh' ? 'zh-CN' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num / 100);
}

/**
 * 文件大小格式化
 */
export function formatFileSize(bytes: number): string {
  const units = currentLocale === 'zh' ? ['B', 'KB', 'MB', 'GB', 'TB'] : ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
