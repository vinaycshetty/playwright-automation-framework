export function transformRequest(
  template: string,
  data: Record<string, any>,
): any {
  let result = template;

  for (const key of Object.keys(data)) {
    const value = data[key];
    result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  }

  return JSON.parse(result);
}