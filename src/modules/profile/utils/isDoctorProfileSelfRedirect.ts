/**
 * Normalize a doctor profile slug or /dr/... path for equality checks.
 * Handles percent-encoding, trailing slash, absolute URLs, and Unicode NFC.
 */
export function normalizeDoctorProfileSlug(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let value = input.trim();

  // Strip origin if an absolute URL was passed.
  value = value.replace(/^https?:\/\/[^/]+/i, '');

  // Decode repeatedly (safe for already-decoded Persian).
  for (let i = 0; i < 3; i += 1) {
    try {
      const decoded = decodeURIComponent(value);
      if (decoded === value) break;
      value = decoded;
    } catch {
      break;
    }
  }

  const drMatch = value.match(/\/dr\/([^/?#]+)/i);
  let slug = drMatch ? drMatch[1] : value.replace(/^\/+/, '').replace(/\/+$/, '');
  slug = slug.replace(/\/+$/, '');

  try {
    slug = decodeURIComponent(slug);
  } catch {
    // keep as-is
  }

  return slug.normalize('NFC');
}

/**
 * True when slug-validation redirect points at the same doctor profile
 * the user already requested (would cause an infinite 301 loop).
 */
export function isDoctorProfileSelfRedirect(currentSlug: string, redirectRoute: string): boolean {
  const current = normalizeDoctorProfileSlug(currentSlug);
  const destination = normalizeDoctorProfileSlug(redirectRoute);
  return Boolean(current) && current === destination;
}
