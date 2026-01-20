import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">Specl</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Features
            </Link>
            <Link href="#workflow" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Workflow
            </Link>
            <Link href="#docs" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost text-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
          {/* Background gradient effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--accent)] opacity-[0.08] blur-[120px] rounded-full" />
          </div>

          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-[var(--secondary)] text-sm text-[var(--muted-foreground)] animate-fade-in border border-[var(--border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
                v0.1 Beta
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
                Design. Structure.
                <br />
                <span className="gradient-text">to Code.</span>
              </h1>

              <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto animate-slide-up stagger-1">
                Specl helps you create structured, machine-readable PRD documents that coding agents can directly consume. Enforce product-thinking checkpoints with AI assistance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2">
                <Link href="/register" className="btn btn-primary px-8 py-3 text-base">
                  Start Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/prd/demo" className="btn btn-secondary px-8 py-3 text-base">
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-[var(--card)]">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Product Thinking
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
                Enforce completeness through structured fields and AI-powered assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card card-interactive group">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/25 transition-colors">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Structured Context</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Export stable, JSON-schema validated documents that coding agents can directly consume without ambiguity.
                </p>
              </div>

              <div className="card card-interactive group">
                <div className="w-12 h-12 rounded-xl bg-[var(--success)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--success)]/25 transition-colors">
                  <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Readiness Checks</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Built-in validation ensures all required fields are complete before export. No more missing acceptance criteria.
                </p>
              </div>

              <div className="card card-interactive group">
                <div className="w-12 h-12 rounded-xl bg-[var(--warning)]/15 flex items-center justify-center mb-4 group-hover:bg-[var(--warning)]/25 transition-colors">
                  <svg className="w-6 h-6 text-[var(--warning)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Assistance</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Let AI help fill acceptance criteria, edge cases, and user flows based on your requirements context.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple Workflow
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
                From idea to structured PRD in minutes, not hours.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Write</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Fill in structured fields for problem, goals, scope, and requirements.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Validate</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Review blocking issues and let AI help complete missing fields.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Export</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Generate prd.context.json for your coding agent workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-[var(--accent)] relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className="container text-center relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to structure your PRDs?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Start creating machine-readable product specifications today.
            </p>
            <Link href="/register" className="btn bg-white text-[var(--accent)] hover:bg-gray-100 px-8 py-3 text-base font-semibold">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)] bg-[var(--card)]">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--accent)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              Specl v0.1 - Open Source PRD Tool
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="https://github.com" className="hover:text-[var(--foreground)] transition-colors">
              GitHub
            </Link>
            <Link href="/docs" className="hover:text-[var(--foreground)] transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
