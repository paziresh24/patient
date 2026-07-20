export const DEFAULT_SEARCH_ROUTE = 'ir';

/**
 * Normalizes the `:route` segment of `/seapi/v1/search/:route`.
 *
 * Guards against nullish / stringified-nullish city values. A doctor without a
 * `city_en_slug` flows through the online-visit substitute flow as `null`, and
 * `decodeURIComponent(null)` coerces it to the literal string `"null"`, which
 * produced broken requests like `/seapi/v1/search/null`. This is the single
 * choke point every `search()` caller passes through, so the guard lives here.
 */
export const normalizeSearchRoute = (route?: string | null): string => {
  if (!route || route === 'null' || route === 'undefined') {
    return DEFAULT_SEARCH_ROUTE;
  }
  return route;
};
