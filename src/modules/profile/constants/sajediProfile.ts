/** Temporary Sajedi-only UI gate — keep separate from PROFILE_API_SOURCE_SLUGS. */
export const SAJEDI_PROFILE_SLUG = 'دکتر-ابوالفضل-ساجدی-10';

export function isSajediProfileSlug(slug?: string | null): boolean {
  return !!slug && slug === SAJEDI_PROFILE_SLUG;
}
