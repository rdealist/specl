/**
 * Template Schema Types
 *
 * These types define the structure of the template schema stored in the database
 * and drive the dynamic rendering of the editor UI.
 */

export interface TemplateSchema {
  templateSchemaVersion: string;
  contextSchemaVersion: string;
  sections: SectionSchema[];
  readinessRules: ReadinessRules;
  aiHooks?: AiHooks;
}

export interface SectionSchema {
  key: string;
  title: LocalizedString;
  description?: LocalizedString;
  fields: FieldSchema[];
  optional?: boolean;
  collapsible?: boolean;
}

export interface FieldSchema {
  key: string;
  type: FieldType;
  label: LocalizedString;
  description?: LocalizedString;
  placeholder?: LocalizedString;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: FieldOption[];
  itemSchema?: FieldSchema; // For stringList/objectList
  export: ExportMapping;
  aiHook?: string;
}

export type FieldType =
  | 'shortText'
  | 'longText'
  | 'enum'
  | 'multiEnum'
  | 'stringList'
  | 'objectList'
  | 'number'
  | 'boolean'
  | 'date';

export interface FieldOption {
  value: string;
  label: LocalizedString;
}

export interface LocalizedString {
  zh: string;
  en: string;
}

export interface ExportMapping {
  path: string;
  omitIfEmpty?: boolean;
  transform?: string;
}

export interface ReadinessRules {
  requireFields: string[];
  requirePerRequirement: string[];
  optionalFields?: string[];
}

export interface AiHooks {
  [fieldKey: string]: {
    taskType: 'field_patch' | 'suggested_flows';
    scope: 'single' | 'batch';
    prompt?: string;
  };
}

/**
 * Runtime field value types
 */
export type FieldValue =
  | string
  | string[]
  | number
  | boolean
  | Date
  | Record<string, any>
  | Array<Record<string, any>>
  | null;

/**
 * Field validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Helper type for section data
 */
export type SectionData = Record<string, FieldValue>;

/**
 * Helper type for document fields JSON
 */
export type DocumentFieldsJson = Record<string, SectionData>;
