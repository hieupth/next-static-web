/**
 * Generate BEM-style class names from a base element and optional modifiers.
 * Example:
 *  bemClassnames("button", ["primary", "large"]) => "button button-primary button-large"
 */
export function bemClassnames(element?: string, classname?: string[]) {
  // If both element and modifiers are missing, return an empty string
  if (!element?.trim() && !classname?.length) return '';
  // Array to collect all valid classnames
  const parts: string[] = [];
  if (element?.trim()) {
    parts.push(element.trim());
  }
  // Add classnames if they exist
  if (classname?.length) {
    const filtered = classname.filter(c => c && typeof c === 'string' && c.trim());
    const prefixed = filtered.map(c => {
      const cleanClass = c.trim();
      return element?.trim() ? `${element.trim()}-${cleanClass}` : cleanClass;
    });
    parts.push(...prefixed);
  }
  // Join all parts with spaces to form the final classname string
  return parts.join(' ');
}