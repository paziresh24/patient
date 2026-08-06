type NameParts = {
  name?: string | null;
  family?: string | null;
};

/** Join name + family; ignore null/blank parts. */
export function joinProfileNameParts(parts: NameParts): string {
  return [parts.name, parts.family]
    .map(part => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean)
    .join(' ')
    .trim();
}

/** Derive a readable label from center name e.g. "مطب سیدرضا حجازیان" → "سیدرضا حجازیان". */
export function displayNameFromCenterName(centerName?: string | null): string {
  if (typeof centerName !== 'string') return '';
  return centerName
    .trim()
    .replace(/^مطب\s+/u, '')
    .replace(/^کلینیک\s+/u, '')
    .replace(/^دفتر\s+/u, '')
    .trim();
}

/**
 * Pick the best available display name when full-profile is skipped
 * (self-redirect slugs) or granular fullname API returned empty.
 */
export function resolveProfileDisplayName(
  parts: NameParts,
  options?: { centerName?: string | null; slug?: string },
): string {
  const joined = joinProfileNameParts(parts);
  if (joined) return joined;

  const fromCenter = displayNameFromCenterName(options?.centerName);
  if (fromCenter) return fromCenter;

  if (options?.slug) {
    return options.slug.replace(/-/g, ' ').trim();
  }

  return '';
}
