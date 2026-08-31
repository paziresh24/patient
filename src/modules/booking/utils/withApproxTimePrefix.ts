/**
 * Prefixes «حدود» for online-visit time copy so the slot reads as approximate.
 * Idempotent if the text already starts with «حدود».
 * Note: do not use \b — JS word boundaries do not treat Persian letters as word chars.
 */
export const withApproxTimePrefix = (timeText: string | null | undefined): string => {
  if (timeText == null) return '';
  const trimmed = String(timeText).trim();
  if (!trimmed) return '';
  if (/^حدود(?:\s|$)/.test(trimmed)) return trimmed;
  return `حدود ${trimmed}`;
};
