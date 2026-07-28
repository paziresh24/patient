/**
 * DR-08 (docs/dev-requests/dr-08-listing-pagespeed.md) — CLS fix.
 *
 * `ConsultBanner` (src/modules/search/components/consultBanner) is loaded via
 * `dynamic(..., { ssr: false })` from the listing page (`src/pages/s/[[...params]].tsx`), so the
 * server sends nothing for it — the browser must download and mount its chunk before any of its
 * markup appears. If the space it ends up occupying isn't reserved from the very first paint, that
 * mount pops the rest of the page down (a real, measured CLS contributor on mobile listing pages).
 *
 * ConsultBanner itself renders one of three shapes depending on data that's already known at the
 * *page* level before the chunk ever loads:
 *   - `isConsult` true                              → renders nothing (height 0).
 *   - `isConsult` false, no `selectedCategory.title` → plain single-line upsell prompt (~5rem).
 *   - `isConsult` false, `selectedCategory.title` set → richer "ویزیت آنلاین" card with substitute-
 *     doctor image + CTA button (~8.5rem).
 *
 * This function centralizes that mapping so the reserved height always matches the shape that will
 * actually mount, instead of one fixed guessed number (which is only ever right for one of the three
 * cases and wrong — i.e. a shift — for the other two).
 *
 * Validity boundary: the two non-zero estimates are derived from ConsultBanner's own Tailwind
 * spacing (padding/line-height), not a live measurement — re-check against real Lighthouse/CrUX CLS
 * numbers after deploy (docs/dev-requests/dr-08-listing-pagespeed.md §۱۱) and adjust the two
 * constants below if the real rendered height differs.
 */
export const CONSULT_BANNER_RESERVED_HEIGHT_REM = {
  none: 0,
  plain: 5,
  withCategory: 8.5,
} as const;

export interface ConsultBannerShapeInput {
  isConsult?: boolean;
  hasSelectedCategory?: boolean;
}

/** Returns the CSS `min-height` (in rem, as a CSS length string) to reserve for ConsultBanner. */
export const getConsultBannerReservedSpace = ({ isConsult, hasSelectedCategory }: ConsultBannerShapeInput): string => {
  if (isConsult) return `${CONSULT_BANNER_RESERVED_HEIGHT_REM.none}rem`;
  if (hasSelectedCategory) return `${CONSULT_BANNER_RESERVED_HEIGHT_REM.withCategory}rem`;
  return `${CONSULT_BANNER_RESERVED_HEIGHT_REM.plain}rem`;
};

export default getConsultBannerReservedSpace;
