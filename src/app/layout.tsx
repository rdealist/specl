import type { Metadata } from "next";
import "./globals.css";
import { I18nClientProvider } from "@/components/providers/I18nClientProvider";

export const metadata: Metadata = {
  title: "Specl - Structured PRD Authoring Tool",
  description: "Create stable, structured PRD context for coding agents with AI-assisted completion.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <I18nClientProvider>{children}</I18nClientProvider>
      </body>
    </html>
  );
}
