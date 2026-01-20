import { Issue } from "../issues/types";

export interface CompletionStats {
  requiredDone: number;
  requiredTotal: number;
  requiredPercent: number;
  qualityPercent: number;
}

export interface SectionStats {
  sectionKey: string;
  requiredDone: number;
  requiredTotal: number;
  requiredPercent: number;
}

export interface ReadinessResult {
  isReady: boolean;
  completion: CompletionStats;
  blockingIssues: Issue[];
  recommendations: Issue[];
  perSectionStats: SectionStats[];
}

export interface TemplateReadinessRules {
  requireFields: string[];
  requirePerRequirement: string[];
}

export interface TemplateSectionField {
  key: string;
  required?: boolean;
  type?: string;
  validation?: {
    minItems?: number;
    maxItems?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface TemplateSection {
  key: string;
  title?: Record<string, string> | string;
  fields: TemplateSectionField[];
}

export interface TemplateSchema {
  sections: TemplateSection[];
  readinessRules: TemplateReadinessRules;
}
