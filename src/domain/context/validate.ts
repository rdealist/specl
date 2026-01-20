import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../schemas/prd-context.schema.json";

const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
addFormats(ajv);
const validate = ajv.compile(schema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateContext(
  context: Record<string, unknown>,
): ValidationResult {
  const valid = validate(context);
  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (validate.errors ?? []).map((error) => {
    const path = error.instancePath || "root";
    return `${path} ${error.message}`.trim();
  });

  return { valid: false, errors };
}
