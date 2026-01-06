export function parseArrayField<T = string>(value?: unknown): T[] {
  if (!value) return [];

  // Case: already array (requiredSpecialties[]=SPA)
  if (Array.isArray(value)) return value as T[];

  // Case: single value (requiredSpecialties=SPA)
  if (typeof value === "string") {
    // JSON array string
    if (value.trim().startsWith("[")) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }

    // single value
    return [value as T];
  }

  return [];
}
