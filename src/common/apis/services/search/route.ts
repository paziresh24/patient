export const DEFAULT_SEARCH_ROUTE = 'ir';

/**
 * Normalizes the `:route` segment of `/seapi/v1/search/:route`.
 *
 * Guards against nullish / stringified-nullish city values. A doctor without a
 * `city_en_slug` flows through the online-visit substitute flow as `null`, and
 * `decodeURIComponent(null)` coerces it to the literal string `"null"`, which
 * produced broken requests like `/seapi/v1/search/null`. This is the single
 * choke point every `search()` caller passes through, so the guard lives here.
 *
 * The guard is applied **per segment**, not to the whole string: a route is
 * built by interpolating a city and a category into `` `${city}/${category}` ``,
 * so either half can independently be a stringified nullish while the other is
 * a perfectly good slug. `"kermanshah/undefined"` is the shape actually seen in
 * production (ConsultBanner opened with no category selected) and a whole-string
 * comparison lets it straight through to a 404.
 */
export const normalizeSearchRoute = (route?: string | null): string => {
  if (!route) {
    return DEFAULT_SEARCH_ROUTE;
  }
  const segments = route.split('/').filter(segment => segment && segment !== 'null' && segment !== 'undefined');

  return segments.length ? segments.join('/') : DEFAULT_SEARCH_ROUTE;
};
