import { DEFAULT_SEARCH_ROUTE, normalizeSearchRoute } from './route';

describe('normalizeSearchRoute', () => {
  it('keeps a valid route untouched', () => {
    expect(normalizeSearchRoute('tehran/exp-cardiologist')).toBe('tehran/exp-cardiologist');
    expect(normalizeSearchRoute('ir')).toBe('ir');
  });

  it('falls back to "ir" for the literal string "null"', () => {
    // decodeURIComponent(null) yields the string "null" — the reported bug that
    // produced requests to /seapi/v1/search/null in the online-visit flow.
    expect(normalizeSearchRoute('null')).toBe(DEFAULT_SEARCH_ROUTE);
  });

  it('falls back to "ir" for the literal string "undefined"', () => {
    expect(normalizeSearchRoute('undefined')).toBe(DEFAULT_SEARCH_ROUTE);
  });

  it('falls back to "ir" for nullish and empty values', () => {
    expect(normalizeSearchRoute(null)).toBe(DEFAULT_SEARCH_ROUTE);
    expect(normalizeSearchRoute(undefined)).toBe(DEFAULT_SEARCH_ROUTE);
    expect(normalizeSearchRoute('')).toBe(DEFAULT_SEARCH_ROUTE);
  });
});
