export interface RequirementPathMatch {
  requirementId?: string;
  index?: number;
  fieldKey: string;
}

const REQUIREMENT_PATH_REGEX = /^requirements\.requirements\[(.+?)\]\.([A-Za-z0-9_.-]+)$/;

export function buildRequirementFieldPath(requirementId: string, fieldKey: string): string {
  return `requirements.requirements[${requirementId}].${fieldKey}`;
}

export function parseRequirementFieldPath(fieldPath: string): RequirementPathMatch | null {
  const match = fieldPath.match(REQUIREMENT_PATH_REGEX);
  if (!match) return null;

  const raw = match[1];
  const fieldKey = match[2];

  if (raw.startsWith("#")) {
    const index = Number(raw.slice(1));
    if (Number.isInteger(index)) {
      return { index, fieldKey };
    }
    return null;
  }

  return { requirementId: raw, fieldKey };
}

export function resolveRequirementIndex(
  requirements: Array<{ id?: string }> | undefined,
  requirementId: string
): number | null {
  if (!requirements) return null;
  const index = requirements.findIndex((req) => req?.id === requirementId);
  return index >= 0 ? index : null;
}
