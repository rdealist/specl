import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Specl - Structured PRD Authoring Tool",
  description: "Create stable, structured PRD context for coding agents with AI-assisted completion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
