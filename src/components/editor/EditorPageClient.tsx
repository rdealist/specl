'use client';

import React, { useState } from 'react';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { SectionNav } from '@/components/editor/SectionNav';
import { IssuesPanel } from '@/components/editor/IssuesPanel';
import { DocumentBlock } from '@/components/editor/DocumentBlock';
import { RequirementCard } from '@/components/editor/RequirementCard';

interface EditorPageClientProps {
  id: string;
}

export default function EditorPageClient({ id }: EditorPageClientProps) {
  const [expandedReq, setExpandedReq] = useState<string | null>(null);

  const sections = [
    { id: 'meta', title: 'Meta', active: true },
    { id: 'problem', title: '1. Problem Statement' },
    { id: 'goals', title: '2. Goals & Success' },
    { id: 'scope', title: '3. Scope' },
    { id: 'requirements', title: '4. Requirements', hasIssue: true },
    { id: 'tracking', title: '5. Tracking' },
    { id: 'nfr', title: '6. NFR' },
    { id: 'glossary', title: '7. Glossary' },
  ];

  const requirements = [
    {
      id: 'AUTH-LOGIN',
      title: 'User Login Flow',
      priority: 'P0' as const,
      userStory: 'As a user, I want to log in with my email and password so that I can access my account securely.',
      acceptance: [
        'User can enter email and password',
        'System validates credentials against database',
        'Successful login redirects to dashboard',
        'Failed login shows error message',
      ],
      edgeCases: [
        'User enters incorrect password 5 times',
        'User tries to login with unverified email',
        'Session expires during login process',
      ],
      flows: ['Main Login Flow', 'Password Reset Flow'],
    },
    {
      id: 'AUTH-REGISTER',
      title: 'User Registration',
      priority: 'P0' as const,
      userStory: 'As a new user, I want to create an account with my email so that I can start using the platform.',
      acceptance: [
        'User provides email and password',
        'System validates email format',
        'Password meets security requirements',
        'Confirmation email is sent',
      ],
      edgeCases: [
        'Email already registered',
        'Weak password entered',
        'Email delivery fails',
      ],
      flows: ['Registration Flow', 'Email Verification'],
    },
    {
      id: 'PRD-EXPORT',
      title: 'Export PRD to JSON',
      priority: 'P1' as const,
      userStory: 'As a product manager, I want to export my PRD as structured JSON so that coding agents can consume it.',
      acceptance: [
        'Export generates valid JSON schema',
        'All required fields are included',
        'Export supports multiple profiles (lean/standard/detailed)',
      ],
      edgeCases: [
        'Required fields are missing',
        'AI translation fails for EN export',
      ],
      flows: ['Export Flow'],
    },
  ];

  return (
    <EditorLayout
      nav={<SectionNav sections={sections} documentId={id} documentTitle="New Feature Specification" />}
      issues={<IssuesPanel />}
    >
      <div className="pb-32 animate-fade-in">
        {/* Meta Section */}
        <section id="meta" className="mb-12 pb-8 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge badge-default font-mono">PRD-{id}</span>
            <span className="badge badge-success">Draft</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            New Feature Specification
          </h1>
          <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            <span>Last updated: Today</span>
            <span>Language: English</span>
          </div>
        </section>

        {/* Problem Statement */}
        <section id="problem" className="mb-12">
          <DocumentBlock type="h2" content="1. Problem Statement" />
          <div className="card">
            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
                Background
              </h4>
              <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
                Current PRD authoring relies on unstructured documents that are difficult for coding agents to parse. Product managers spend significant time formatting and maintaining these documents.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
                Problem Statement
              </h4>
              <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
                Lack of stable, structured PRD export format slows implementation and increases miscommunication between product and engineering teams.
              </p>
            </div>
          </div>
        </section>

        {/* Goals & Success */}
        <section id="goals" className="mb-12">
          <DocumentBlock type="h2" content="2. Goals & Success Metrics" />
          <div className="grid gap-4">
            <div className="card bg-[var(--success)]/5 border-[var(--success)]/20">
              <h4 className="text-xs uppercase tracking-wide text-[var(--success)] font-bold mb-3">
                Goals
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="badge badge-success text-xs shrink-0">G1</span>
                  <div>
                    <p className="text-sm font-medium">Reduce PRD export time by 90%</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Metric: Export time • Target: &lt;30 seconds</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="badge badge-success text-xs shrink-0">G2</span>
                  <div>
                    <p className="text-sm font-medium">Improve format consistency to 100%</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Metric: Schema validation pass rate • Target: 100%</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="card">
              <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-3">
                Non-Goals
              </h4>
              <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                  Third-party integrations (Jira, TAPD, Figma)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                  PDF/Word export formats
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)]" />
                  Team collaboration features
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Scope */}
        <section id="scope" className="mb-12">
          <DocumentBlock type="h2" content="3. Scope" />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card border-[var(--success)]/30 bg-[var(--success)]/5">
              <h4 className="text-xs uppercase tracking-wide text-[var(--success)] font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                In Scope
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Structured JSON export with schema validation</li>
                <li>Template-driven editor UI</li>
                <li>AI-assisted field completion</li>
                <li>Chinese and English export support</li>
              </ul>
            </div>
            <div className="card border-[var(--destructive)]/30 bg-[var(--destructive)]/5">
              <h4 className="text-xs uppercase tracking-wide text-[var(--destructive)] font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--destructive)]" />
                Out of Scope
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Real-time collaboration</li>
                <li>Version control UI</li>
                <li>Custom template builder</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section id="requirements" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <DocumentBlock type="h2" content="4. Requirements" />
            <span className="badge badge-default">{requirements.length} items</span>
          </div>
          <div className="space-y-4">
            {requirements.map((req) => (
              <RequirementCard
                key={req.id}
                {...req}
                isExpanded={expandedReq === req.id}
                onToggle={() => setExpandedReq(expandedReq === req.id ? null : req.id)}
              />
            ))}
          </div>
        </section>

        {/* Tracking */}
        <section id="tracking" className="mb-12">
          <DocumentBlock type="h2" content="5. Tracking Events" />
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="bg-[var(--muted)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Event Name</th>
                  <th className="text-left px-4 py-3 font-medium">Trigger</th>
                  <th className="text-left px-4 py-3 font-medium">Properties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="px-4 py-3 font-mono text-[var(--accent)]">prd_exported</td>
                  <td className="px-4 py-3">User clicks export button</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">profile, language, scope</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-[var(--accent)]">ai_fix_applied</td>
                  <td className="px-4 py-3">User applies AI suggestion</td>
                  <td className="px-4 py-3 text-[var(--muted-foreground)]">field_path, issue_code</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* NFR */}
        <section id="nfr" className="mb-12">
          <DocumentBlock type="h2" content="6. Non-Functional Requirements" />
          <div className="grid gap-4">
            {[
              { type: 'Performance', desc: 'Page load time under 2 seconds. Export generation under 5 seconds.' },
              { type: 'Security', desc: 'All data encrypted in transit (TLS 1.3) and at rest. JWT-based authentication.' },
              { type: 'Availability', desc: 'Target 99.9% uptime with graceful degradation during AI provider outages.' },
            ].map((nfr) => (
              <div key={nfr.type} className="card">
                <h4 className="text-xs uppercase tracking-wide text-[var(--muted-foreground)] font-semibold mb-2">
                  {nfr.type}
                </h4>
                <p className="text-sm">{nfr.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section id="glossary" className="mb-12">
          <DocumentBlock type="h2" content="7. Glossary" />
          <div className="card">
            <dl className="grid sm:grid-cols-2 gap-6">
              <div>
                <dt className="font-semibold text-sm mb-1">PRD</dt>
                <dd className="text-sm text-[var(--muted-foreground)]">Product Requirements Document</dd>
              </div>
              <div>
                <dt className="font-semibold text-sm mb-1">Context</dt>
                <dd className="text-sm text-[var(--muted-foreground)]">Structured JSON output for coding agents</dd>
              </div>
              <div>
                <dt className="font-semibold text-sm mb-1">Readiness</dt>
                <dd className="text-sm text-[var(--muted-foreground)]">Validation state indicating export eligibility</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </EditorLayout>
  );
}
