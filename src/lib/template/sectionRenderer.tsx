'use client';

import React from 'react';
import type { SectionSchema, SectionData } from '@/lib/template/types';
import { DynamicField } from '@/components/editor/DynamicField';

export interface SectionRendererProps {
  sectionSchema: SectionSchema;
  sectionData: SectionData;
  onChange: (updates: SectionData) => void;
  language: 'zh' | 'en';
  disabled?: boolean;
  showValidation?: boolean;
  collapsible?: boolean;
}

/**
 * SectionRenderer - Renders all fields in a section
 *
 * This component:
 * - Iterates over section.fields[]
 * - Renders each field with DynamicField
 * - Handles section-level updates
 * - Supports collapsible sections
 */
export function SectionRenderer({
  sectionSchema,
  sectionData,
  onChange,
  language,
  disabled = false,
  showValidation = true,
  collapsible = true,
}: SectionRendererProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleFieldChange = (fieldKey: string, value: any) => {
    onChange({
      ...sectionData,
      [fieldKey]: value,
    });
  };

  const isCollapsible = collapsible && sectionSchema.collapsible !== false;

  return (
    <div className="card">
      {/* Section Header */}
      <div
        className={`flex items-center justify-between p-6 ${
          isCollapsible ? 'cursor-pointer hover:bg-[var(--secondary)]/50 transition-colors' : ''
        }`}
        onClick={isCollapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
      >
        <div>
          <h3 className="text-xl font-bold mb-1">{sectionSchema.title[language]}</h3>
          {sectionSchema.description && (
            <p className="text-sm text-[var(--muted-foreground)]">{sectionSchema.description[language]}</p>
          )}
          {sectionSchema.optional && (
            <span className="text-xs text-[var(--muted-foreground)] mt-1 inline-block">Optional section</span>
          )}
        </div>
        {isCollapsible && (
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {/* Section Fields */}
      {!isCollapsed && (
        <div className="px-6 pb-6 space-y-6">
          {sectionSchema.fields.map((fieldSchema) => (
            <DynamicField
              key={fieldSchema.key}
              fieldSchema={fieldSchema}
              value={sectionData[fieldSchema.key] ?? null}
              onChange={(value) => handleFieldChange(fieldSchema.key, value)}
              language={language}
              disabled={disabled}
              showValidation={showValidation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
