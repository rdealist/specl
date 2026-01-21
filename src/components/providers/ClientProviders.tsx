'use client';

/**
 * 客户端提供者包装器
 * 包含 ThemeProvider、I18nProvider、AuthProvider 和其他客户端提供者
 */

import { ThemeProvider } from '@/lib/theme';
import { I18nProvider } from '@/lib/i18n/context';
import { AuthProvider } from '@/contexts/AuthContext';

interface ProvidersProps {
  children: React.ReactNode;
  initialLocale?: 'zh' | 'en';
}

export function ClientProviders({ children, initialLocale }: ProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system">
        <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
