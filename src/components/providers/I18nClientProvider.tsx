'use client';

/**
 * 客户端提供者包装器
 * 包含 I18nProvider 和其他客户端提供者
 */

import { I18nProvider } from '@/lib/i18n/context';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale?: 'zh' | 'en';
}

export function I18nClientProvider({ children, initialLocale }: ProvidersProps) {
  return <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>;
}
