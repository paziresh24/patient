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

  it('drops a stringified-nullish segment but keeps the good one', () => {
    // ConsultBanner builds `${city}/${categorySlug}`. With no category selected
    // this became "kermanshah/undefined" and 404'd in production — the whole-string
    // comparison never matched it. Keep the city, drop the broken half.
    expect(normalizeSearchRoute('kermanshah/undefined')).toBe('kermanshah');
    expect(normalizeSearchRoute('ir/undefined')).toBe('ir');
    expect(normalizeSearchRoute('tehran/null')).toBe('tehran');
    expect(normalizeSearchRoute('undefined/dermatology')).toBe('dermatology');
  });

  it('falls back to "ir" when every segment is nullish', () => {
    expect(normalizeSearchRoute('undefined/undefined')).toBe(DEFAULT_SEARCH_ROUTE);
    expect(normalizeSearchRoute('null/undefined')).toBe(DEFAULT_SEARCH_ROUTE);
  });

  it('does not touch slugs that merely contain the words', () => {
    // Guard against an over-eager substring match killing legitimate slugs.
    expect(normalizeSearchRoute('tehran/undefined-clinic')).toBe('tehran/undefined-clinic');
    expect(normalizeSearchRoute('nullabad/dermatology')).toBe('nullabad/dermatology');
  });
});
