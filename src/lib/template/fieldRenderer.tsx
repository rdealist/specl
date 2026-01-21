import React from 'react';
import type { FieldSchema, FieldValue, ValidationResult } from './types';

export interface FieldRendererProps {
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  fieldSchema: FieldSchema;
  language: 'zh' | 'en';
  disabled?: boolean;
  error?: string;
}

/**
 * Validate field value against schema
 */
export function validateField(value: FieldValue, schema: FieldSchema): ValidationResult {
  // Required check
  if (schema.required) {
    if (value === null || value === undefined || value === '') {
      return { valid: false, error: 'This field is required' };
    }
    if (Array.isArray(value) && value.length === 0) {
      return { valid: false, error: 'At least one item is required' };
    }
  }

  // String validations
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) {
      return { valid: false, error: `Minimum length is ${schema.minLength}` };
    }
    if (schema.maxLength && value.length > schema.maxLength) {
      return { valid: false, error: `Maximum length is ${schema.maxLength}` };
    }
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        return { valid: false, error: 'Invalid format' };
      }
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (schema.min !== undefined && value < schema.min) {
      return { valid: false, error: `Minimum value is ${schema.min}` };
    }
    if (schema.max !== undefined && value > schema.max) {
      return { valid: false, error: `Maximum value is ${schema.max}` };
    }
  }

  return { valid: true };
}

/**
 * Short text input field
 */
export function ShortTextRenderer({ value, onChange, fieldSchema, language, disabled, error }: FieldRendererProps) {
  const placeholder = fieldSchema.placeholder?.[language] || '';

  return (
    <div>
      <input
        type="text"
        className={`input w-full ${error ? 'border-red-500' : ''}`}
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={fieldSchema.maxLength}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Long text textarea field
 */
export function LongTextRenderer({ value, onChange, fieldSchema, language, disabled, error }: FieldRendererProps) {
  const placeholder = fieldSchema.placeholder?.[language] || '';

  return (
    <div>
      <textarea
        className={`input w-full min-h-[120px] ${error ? 'border-red-500' : ''}`}
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={fieldSchema.maxLength}
        rows={6}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Enum dropdown field
 */
export function EnumRenderer({ value, onChange, fieldSchema, language, disabled, error }: FieldRendererProps) {
  return (
    <div>
      <select
        className={`input w-full ${error ? 'border-red-500' : ''}`}
        value={(value as string) || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select...</option>
        {fieldSchema.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label[language]}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Multi-enum checkbox group field
 */
export function MultiEnumRenderer({ value, onChange, fieldSchema, language, disabled, error }: FieldRendererProps) {
  const selectedValues = (value as string[]) || [];

  const handleToggle = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newValues);
  };

  return (
    <div>
      <div className="space-y-2">
        {fieldSchema.options?.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              disabled={disabled}
              className="w-4 h-4"
            />
            <span className="text-sm">{option.label[language]}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * String list editor (array of strings)
 */
export function StringListRenderer({ value, onChange, fieldSchema, language, disabled, error }: FieldRendererProps) {
  const items = (value as string[]) || [];
  const [newItem, setNewItem] = React.useState('');

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="space-y-2 mb-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              className="input flex-1"
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index] = e.target.value;
                onChange(newItems);
              }}
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="btn btn-ghost text-red-500 px-2"
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="input flex-1"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={fieldSchema.placeholder?.[language] || 'Add item...'}
          disabled={disabled}
        />
        <button type="button" onClick={handleAdd} className="btn btn-secondary" disabled={disabled || !newItem.trim()}>
          Add
        </button>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Object list editor (array of objects)
 */
export function ObjectListRenderer({ value, onChange, fieldSchema, language, disabled, error }: FieldRendererProps) {
  const items = (value as Array<Record<string, any>>) || [];

  const handleAdd = () => {
    onChange([...items, {}]);
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, fieldKey: string, fieldValue: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [fieldKey]: fieldValue };
    onChange(newItems);
  };

  return (
    <div>
      <div className="space-y-4 mb-4">
        {items.map((item, index) => (
          <div key={index} className="card p-4 border border-[var(--border)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-[var(--muted-foreground)]">Item {index + 1}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="btn btn-ghost text-red-500 text-sm px-2"
                disabled={disabled}
              >
                Remove
              </button>
            </div>
            {/* Render nested fields based on itemSchema */}
            {fieldSchema.itemSchema && (
              <div className="space-y-3">
                {/* This would recursively render fields - simplified for now */}
                <pre className="text-xs text-[var(--muted-foreground)]">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAdd} className="btn btn-secondary w-full" disabled={disabled}>
        + Add Item
      </button>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Number input field
 */
export function NumberRenderer({ value, onChange, fieldSchema, disabled, error }: FieldRendererProps) {
  return (
    <div>
      <input
        type="number"
        className={`input w-full ${error ? 'border-red-500' : ''}`}
        value={(value as number) || ''}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        min={fieldSchema.min}
        max={fieldSchema.max}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Boolean checkbox field
 */
export function BooleanRenderer({ value, onChange, fieldSchema, language, disabled }: FieldRendererProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4"
      />
      <span className="text-sm">{fieldSchema.label[language]}</span>
    </label>
  );
}

/**
 * Date picker field
 */
export function DateRenderer({ value, onChange, disabled, error }: FieldRendererProps) {
  const dateValue = value instanceof Date ? value.toISOString().split('T')[0] : (value as string) || '';

  return (
    <div>
      <input
        type="date"
        className={`input w-full ${error ? 'border-red-500' : ''}`}
        value={dateValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Main field renderer - routes to specific renderer based on field type
 */
export function renderField(props: FieldRendererProps): React.ReactElement {
  switch (props.fieldSchema.type) {
    case 'shortText':
      return <ShortTextRenderer {...props} />;
    case 'longText':
      return <LongTextRenderer {...props} />;
    case 'enum':
      return <EnumRenderer {...props} />;
    case 'multiEnum':
      return <MultiEnumRenderer {...props} />;
    case 'stringList':
      return <StringListRenderer {...props} />;
    case 'objectList':
      return <ObjectListRenderer {...props} />;
    case 'number':
      return <NumberRenderer {...props} />;
    case 'boolean':
      return <BooleanRenderer {...props} />;
    case 'date':
      return <DateRenderer {...props} />;
    default:
      return <div className="text-red-500">Unknown field type: {props.fieldSchema.type}</div>;
  }
}
