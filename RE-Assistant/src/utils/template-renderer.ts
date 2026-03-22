// ============================================================
// Template Renderer
// Replaces {{variable}} placeholders with actual values.
// ============================================================

export function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] ?? match;
  });
}

export function getRequiredVariables(template: string): string[] {
  const matches = template.matchAll(/\{\{(\w+)\}\}/g);
  return [...new Set([...matches].map((m) => m[1]))];
}

export function validateTemplateVariables(
  template: string,
  provided: Record<string, string>
): { valid: boolean; missing: string[] } {
  const required = getRequiredVariables(template);
  const missing = required.filter((v) => !(v in provided));
  return { valid: missing.length === 0, missing };
}
