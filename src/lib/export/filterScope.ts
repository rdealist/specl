/**
 * Filter requirements by scope based on priority
 */

export type ExportScope = 'all' | 'p0_only' | 'p0_p1';

interface Requirement {
  priority?: string;
  [key: string]: any;
}

/**
 * Filter requirements based on export scope
 * - p0_only: Only P0 requirements
 * - p0_p1: P0 and P1 requirements
 * - all: All requirements
 */
export function filterRequirementsByScope(
  requirements: Requirement[],
  scope: ExportScope
): Requirement[] {
  if (!Array.isArray(requirements)) {
    return [];
  }

  if (scope === 'p0_only') {
    return requirements.filter(req => req.priority === 'P0');
  }

  if (scope === 'p0_p1') {
    return requirements.filter(req => req.priority === 'P0' || req.priority === 'P1');
  }

  // 'all' - return all requirements
  return requirements;
}
