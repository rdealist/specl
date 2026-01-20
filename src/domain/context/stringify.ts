function sortObject(value: any): any {
  if (Array.isArray(value)) {
    return value.map(sortObject);
  }
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, any>>((acc, key) => {
        acc[key] = sortObject(value[key]);
        return acc;
      }, {});
  }
  return value;
}

export function stableStringify(value: Record<string, any>): string {
  return JSON.stringify(sortObject(value), null, 2);
}
