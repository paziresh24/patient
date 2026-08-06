import {
  LEGACY_SEARCH_PARAMS,
  SEARCH_BOX_QS_REF,
  SEARCH_BOX_REF,
  buildSearchBoxUrl,
  stripLegacySearchParams,
} from './searchBoxUrl';

describe('buildSearchBoxUrl', () => {
  it('URLِ شهردار را با text و ref می‌سازد', () => {
    expect(buildSearchBoxUrl({ text: 'چشم پزشک', ref: SEARCH_BOX_QS_REF, citySlug: 'tehran' })).toBe(
      '/s/tehran/?text=چشم پزشک&ref=search_suggestion_box_qs',
    );
  });

  it('بدونِ شهر، URLِ ریشه می‌سازد', () => {
    expect(buildSearchBoxUrl({ text: 'دندانپزشک', ref: SEARCH_BOX_REF })).toBe(
      '/s/?text=دندانپزشک&ref=search_suggestion_box',
    );
  });

  it('citySlugِ خالی مثلِ نبودنش رفتار می‌کند (نه `/s//?`)', () => {
    expect(buildSearchBoxUrl({ text: 'قلب', ref: SEARCH_BOX_REF, citySlug: '' })).toBe(
      '/s/?text=قلب&ref=search_suggestion_box',
    );
  });

  /**
   * 🛡️ گاردِ اصلیِ DR-30 — اگر کسی روزی دوباره `semantic_search` را به URLِ کادر اضافه کند،
   * این تست قرمز می‌شود. قبل از DR-30 چنین گاردی وجود نداشت و دقیقاً به همین دلیل یک پارامترِ
   * مرده مدت‌ها در URLِ همه‌ی کاربران ماند.
   */
  it.each([
    ['با شهر', { text: 'x', ref: SEARCH_BOX_QS_REF, citySlug: 'shiraz' }],
    ['بدونِ شهر', { text: 'x', ref: SEARCH_BOX_REF }],
  ])('هیچ paramِ مرده‌ای تولید نمی‌کند (%s)', (_label, input) => {
    const url = buildSearchBoxUrl(input);
    LEGACY_SEARCH_PARAMS.forEach(name => expect(url).not.toContain(name));
  });
});

describe('stripLegacySearchParams', () => {
  it('paramِ مرده را حذف و بقیه را دست‌نخورده نگه می‌دارد', () => {
    const params = new URLSearchParams('text=قلب&semantic_search=false&ref=search_suggestion_box&page=2');
    stripLegacySearchParams(params);

    expect(params.get('semantic_search')).toBeNull();
    expect(params.get('text')).toBe('قلب');
    expect(params.get('ref')).toBe('search_suggestion_box');
    // `page` عمداً این‌جا حذف نمی‌شود — ریستِ صفحه‌بندی مسئولیتِ جداگانه‌ی خودِ کامپوننت است.
    expect(params.get('page')).toBe('2');
  });

  it('اگر paramِ مرده نباشد چیزی را خراب نمی‌کند و idempotent است', () => {
    const params = new URLSearchParams('text=قلب');
    expect(stripLegacySearchParams(stripLegacySearchParams(params)).toString()).toBe(
      new URLSearchParams('text=قلب').toString(),
    );
  });

  it('چند مقدارِ تکراریِ همان param را هم پاک می‌کند', () => {
    const params = new URLSearchParams('semantic_search=true&text=x&semantic_search=false');
    stripLegacySearchParams(params);
    expect(params.getAll('semantic_search')).toHaveLength(0);
  });
});
