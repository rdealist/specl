import { Issue } from "../issues/types";
import { buildRequirementFieldPath } from "../paths/fieldPath";
import {
  ReadinessResult,
  TemplateSchema,
  TemplateSectionField,
} from "./types";

const REQUIREMENT_ID_REGEX = /^[A-Za-z][A-Za-z0-9_-]{1,63}$/;
const PRIORITIES = new Set(["P0", "P1", "P2"]);

function getFieldDefinition(template: TemplateSchema, fieldPath: string): TemplateSectionField | null {
  const [sectionKey, fieldKey] = fieldPath.split(".");
  if (!sectionKey || !fieldKey) return null;
  const section = template.sections.find((item) => item.key === sectionKey);
  if (!section) return null;
  return section.fields.find((field) => field.key === fieldKey) ?? null;
}

function getValueByPath(data: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: any = data;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = current[part];
  }
  return current;
}

function isPresent(value: unknown, definition?: TemplateSectionField | null): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number" || typeof value === "boolean") return true;
  if (Array.isArray(value)) {
    const minItems = definition?.validation?.minItems;
    if (typeof minItems === "number") return value.length >= minItems;
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return false;
}

function isAcceptanceItemValid(item: unknown): boolean {
  if (typeof item === "string") return item.trim().length > 0;
  if (!item || typeof item !== "object") return false;
  const value = item as Record<string, unknown>;
  return (
    typeof value.given === "string" && value.given.trim().length > 0 &&
    typeof value.when === "string" && value.when.trim().length > 0 &&
    typeof value.then === "string" && value.then.trim().length > 0
  );
}

function getRequirementFieldValue(requirement: Record<string, unknown>, fieldKey: string): unknown {
  return requirement[fieldKey];
}

export function evaluateReadiness(fieldsJson: Record<string, any>, template: TemplateSchema): ReadinessResult {
  const blockingIssues: Issue[] = [];
  const recommendations: Issue[] = [];

  const requiredFields = template.readinessRules.requireFields ?? [];
  const perRequirementFields = template.readinessRules.requirePerRequirement ?? [];

  const sectionTotals = new Map<string, { total: number; done: number }>();

  let requiredTotal = 0;
  let requiredDone = 0;

  for (const fieldPath of requiredFields) {
    requiredTotal += 1;

    const definition = getFieldDefinition(template, fieldPath);
    const value = getValueByPath(fieldsJson, fieldPath);
    const present = isPresent(value, definition);

    const sectionKey = fieldPath.split(".")[0];
    const sectionStats = sectionTotals.get(sectionKey) ?? { total: 0, done: 0 };
    sectionStats.total += 1;
    if (present) {
      sectionStats.done += 1;
      requiredDone += 1;
    } else {
      blockingIssues.push({
        code: "REQUIRED_FIELD_MISSING",
        severity: "error",
        fieldPath,
        message: "Required field is missing.",
        suggestion: "Fill in this field before export.",
      });
    }
    sectionTotals.set(sectionKey, sectionStats);
  }

  const requirements: Array<Record<string, unknown>> =
    fieldsJson?.requirements?.requirements ?? [];

  const idCounts = new Map<string, number>();
  for (const requirement of requirements) {
    const rawId = typeof requirement.id === "string" ? requirement.id.trim() : "";
    if (rawId) {
      idCounts.set(rawId, (idCounts.get(rawId) ?? 0) + 1);
    }
  }

  for (const requirement of requirements) {
    const rawId = typeof requirement.id === "string" ? requirement.id.trim() : "";
    const requirementId = rawId || "#unknown";

    if (!rawId || !REQUIREMENT_ID_REGEX.test(rawId)) {
      blockingIssues.push({
        code: "REQUIRED_REQ_FIELD_MISSING",
        severity: "error",
        fieldPath: buildRequirementFieldPath(requirementId, "id"),
        message: "Requirement ID is missing or invalid.",
        suggestion: "Use a readable ID like FEATURE-P0.",
      });
    }

    if (rawId && (idCounts.get(rawId) ?? 0) > 1) {
      blockingIssues.push({
        code: "DUPLICATE_REQUIREMENT_ID",
        severity: "error",
        fieldPath: "requirements.requirements",
        message: `Duplicate requirement id: ${rawId}.`,
        suggestion: "Ensure each requirement id is unique.",
        meta: { duplicateId: rawId },
      });
    }

    const priority = typeof requirement.priority === "string" ? requirement.priority : "";
    if (priority && !PRIORITIES.has(priority)) {
      blockingIssues.push({
        code: "INVALID_ENUM_VALUE",
        severity: "error",
        fieldPath: buildRequirementFieldPath(requirementId, "priority"),
        message: "Priority must be P0, P1, or P2.",
        suggestion: "Choose a valid priority.",
      });
    }

    for (const fieldKey of perRequirementFields) {
      requiredTotal += 1;
      const value = getRequirementFieldValue(requirement, fieldKey);
      const present = isPresent(value);
      if (present) {
        requiredDone += 1;
      } else {
        blockingIssues.push({
          code: "REQUIRED_REQ_FIELD_MISSING",
          severity: "error",
          fieldPath: buildRequirementFieldPath(requirementId, fieldKey),
          message: `Requirement field ${fieldKey} is missing.`,
          suggestion: `Fill ${fieldKey} for this requirement.`,
        });
      }
    }

    const acceptance = requirement.acceptance;
    if (Array.isArray(acceptance) && acceptance.length > 0) {
      acceptance.forEach((item) => {
        if (!isAcceptanceItemValid(item)) {
          blockingIssues.push({
            code: "INVALID_ACCEPTANCE_ITEM",
            severity: "error",
            fieldPath: buildRequirementFieldPath(requirementId, "acceptance"),
            message: "Acceptance item must include Given/When/Then.",
            suggestion: "Complete the acceptance criteria.",
          });
        }
      });
    }

    const flows = requirement.flows as Record<string, unknown> | undefined;
    const mainFlows = Array.isArray(flows?.main) ? (flows?.main as Array<Record<string, unknown>>) : [];
    if (mainFlows.length > 0) {
      const steps = mainFlows.map((step) => Number(step.step)).filter((step) => Number.isInteger(step));
      if (steps.length === mainFlows.length) {
        const sorted = [...steps].sort((a, b) => a - b);
        const contiguous = sorted.every((value, index) => value === index + 1);
        if (!contiguous) {
          recommendations.push({
            code: "FLOWS_STEP_NOT_CONTIGUOUS",
            severity: "warning",
            fieldPath: buildRequirementFieldPath(requirementId, "flows.main"),
            message: "Flow steps should be contiguous starting at 1.",
            suggestion: "Renumber steps in order.",
          });
        }
      }

      if (mainFlows.length > 7) {
        recommendations.push({
          code: "FLOWS_TOO_LONG",
          severity: "warning",
          fieldPath: buildRequirementFieldPath(requirementId, "flows.main"),
          message: "Flow has more than 7 steps.",
          suggestion: "Consider splitting the requirement.",
          meta: { maxSteps: 7, actualSteps: mainFlows.length },
        });
      }
    }
  }

  const openQuestions = fieldsJson?.scope?.openQuestions;
  if (Array.isArray(openQuestions) && openQuestions.length === 0) {
    recommendations.push({
      code: "OPEN_QUESTIONS_EMPTY_BUT_RISKY",
      severity: "warning",
      fieldPath: "scope.openQuestions",
      message: "Open questions is empty. Add any remaining unknowns.",
      suggestion: "Capture unknowns before export.",
    });
  }

  const perSectionStats = Array.from(sectionTotals.entries()).map(([sectionKey, stats]) => ({
    sectionKey,
    requiredDone: stats.done,
    requiredTotal: stats.total,
    requiredPercent: stats.total > 0 ? Math.floor((stats.done / stats.total) * 100) : 0,
  }));

  const requiredPercent = requiredTotal > 0 ? Math.floor((requiredDone / requiredTotal) * 100) : 0;

  const qualityChecklist = [
    Boolean(fieldsJson?.journeys?.primary?.length),
    Boolean(fieldsJson?.tracking?.events?.length),
    Boolean(fieldsJson?.nfr?.items?.length),
    requirements.some((req) => req.priority === "P0" && Array.isArray((req as any).flows?.main)),
  ];
  const qualityTotal = requiredTotal + qualityChecklist.length;
  const qualityDone = requiredDone + qualityChecklist.filter(Boolean).length;
  const qualityPercent = qualityTotal > 0 ? Math.floor((qualityDone / qualityTotal) * 100) : requiredPercent;

  return {
    isReady: blockingIssues.length === 0,
    completion: {
      requiredDone,
      requiredTotal,
      requiredPercent,
      qualityPercent,
    },
    blockingIssues,
    recommendations,
    perSectionStats,
  };
}
