'use client';

import React, { useState } from 'react';
import type { FieldSchema, FieldValue } from '@/lib/template/types';
import { renderField, validateField } from '@/lib/template/fieldRenderer';

export interface DynamicFieldProps {
  fieldSchema: FieldSchema;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  language: 'zh' | 'en';
  disabled?: boolean;
  showValidation?: boolean;
}

/**
 * DynamicField - Renders a field based on its schema with validation
 *
 * This component is the bridge between the template schema and the actual UI.
 * It handles:
 * - Type-specific rendering via fieldRenderer
 * - Field-level validation
 * - Error display
 * - Label and description rendering
 */
export function DynamicField({
  fieldSchema,
  value,
  onChange,
  language,
  disabled = false,
  showValidation = true,
}: DynamicFieldProps) {
  const [touched, setTouched] = useState(false);

  // Validate on blur if validation is enabled
  const validation = showValidation && touched ? validateField(value, fieldSchema) : { valid: true };
  const error = validation.valid ? undefined : validation.error;

  const handleChange = (newValue: FieldValue) => {
    onChange(newValue);
    if (!touched) {
      setTouched(true);
    }
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className="space-y-2" onBlur={handleBlur}>
      {/* Field Label */}
      {fieldSchema.type !== 'boolean' && (
        <label className="block text-sm font-medium">
          {fieldSchema.label[language]}
          {fieldSchema.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Field Description */}
      {fieldSchema.description && (
        <p className="text-xs text-[var(--muted-foreground)] mb-2">{fieldSchema.description[language]}</p>
      )}

      {/* Field Renderer */}
      {renderField({
        value,
        onChange: handleChange,
        fieldSchema,
        language,
        disabled,
        error,
      })}

      {/* AI Hook Indicator */}
      {fieldSchema.aiHook && !disabled && (
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>AI assistance available</span>
        </div>
      )}
    </div>
  );
}
