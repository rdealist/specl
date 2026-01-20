import React from 'react';

interface EditorLayoutProps {
  nav: React.ReactNode;
  issues: React.ReactNode;
  children: React.ReactNode;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({ nav, issues, children }) => {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      {nav}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 md:px-8 lg:px-12">
          {children}
        </div>
      </main>
      {issues}
    </div>
  );
};
