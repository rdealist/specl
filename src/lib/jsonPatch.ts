/**
 * JSON Patch (RFC 6902) Utilities
 * Simplified implementation for common operations
 */

export interface JsonPatchOperation {
  op: 'replace' | 'add' | 'remove';
  path: string;
  value?: any;
}

/**
 * Apply a single JSON Patch operation to an object
 */
function applyOperation(obj: any, operation: JsonPatchOperation): void {
  const { op, path, value } = operation;

  // Parse path (e.g., "/requirements/0/acceptance" -> ["requirements", "0", "acceptance"])
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) {
    throw new Error('Invalid patch path: path cannot be empty');
  }

  // Navigate to parent object
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      if (op === 'add') {
        // Create intermediate objects for add operation
        current[part] = {};
      } else {
        throw new Error(`Path not found: ${path}`);
      }
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];

  switch (op) {
    case 'replace':
      if (!(lastPart in current)) {
        throw new Error(`Cannot replace non-existent path: ${path}`);
      }
      current[lastPart] = value;
      break;

    case 'add':
      current[lastPart] = value;
      break;

    case 'remove':
      if (!(lastPart in current)) {
        throw new Error(`Cannot remove non-existent path: ${path}`);
      }
      delete current[lastPart];
      break;

    default:
      throw new Error(`Unsupported operation: ${op}`);
  }
}

/**
 * Apply an array of JSON Patch operations to an object
 * Returns a new object with patches applied (does not mutate original)
 */
export function applyPatch(
  obj: Record<string, any>,
  patches: JsonPatchOperation[]
): Record<string, any> {
  // Deep clone to avoid mutation
  const result = JSON.parse(JSON.stringify(obj));

  for (const patch of patches) {
    try {
      applyOperation(result, patch);
    } catch (error) {
      throw new Error(
        `Failed to apply patch ${JSON.stringify(patch)}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  return result;
}

/**
 * Validate patch operations before applying
 */
export function validatePatch(patches: JsonPatchOperation[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(patches)) {
    return { valid: false, errors: ['Patches must be an array'] };
  }

  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];

    if (!patch.op || !['replace', 'add', 'remove'].includes(patch.op)) {
      errors.push(`Patch ${i}: Invalid operation "${patch.op}"`);
    }

    if (!patch.path || typeof patch.path !== 'string' || !patch.path.startsWith('/')) {
      errors.push(`Patch ${i}: Invalid path "${patch.path}" (must start with /)`);
    }

    if ((patch.op === 'replace' || patch.op === 'add') && patch.value === undefined) {
      errors.push(`Patch ${i}: Missing value for ${patch.op} operation`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Create a replace operation
 */
export function createReplacePatch(path: string, value: any): JsonPatchOperation {
  return { op: 'replace', path, value };
}

/**
 * Create an add operation
 */
export function createAddPatch(path: string, value: any): JsonPatchOperation {
  return { op: 'add', path, value };
}

/**
 * Create a remove operation
 */
export function createRemovePatch(path: string): JsonPatchOperation {
  return { op: 'remove', path };
}
