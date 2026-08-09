import { buildPayload, findTarget, pageTemplate, sanitizeAttribution, WEB_VITALS_TARGETS } from './webVitals';

const metric = {
  id: 'v3-1',
  name: 'LCP',
  label: 'web-vital' as const,
  value: 2345.678,
  startTime: 0,
};

describe('RUM web-vitals — انتخابِ مقصد', () => {
  it('صفحاتِ جستجو به مقصدِ search می‌روند', () => {
    expect(findTarget('/s/')?.name).toBe('search');
    expect(findTarget('/s/tehran/dermatology/')?.name).toBe('search');
    expect(findTarget('/s')?.name).toBe('search');
  });

  it('پروفایلِ پزشک و مرکز **هیچ** مقصدی ندارند (تصمیمِ owner)', () => {
    expect(findTarget('/dr/some-doctor/')).toBeUndefined();
    expect(findTarget('/c/some-center/')).toBeUndefined();
    expect(findTarget('/')).toBeUndefined();
    expect(findTarget('/patient/appointments/')).toBeUndefined();
  });

  it('فقط یک مقصد فعال است و به ایندکسِ اختصاصیِ خودش وصل است', () => {
    expect(WEB_VITALS_TARGETS).toHaveLength(1);
    expect(WEB_VITALS_TARGETS[0].token).toBeTruthy();
    // توکن نباید با توکن‌های موجودِ splunk.ts یکی باشد (شرطِ owner: توکنِ متفاوت)
    expect(WEB_VITALS_TARGETS[0].token).not.toBe('1e490c2c-d98b-4777-816d-cf7f09b21888');
    expect(WEB_VITALS_TARGETS[0].token).not.toBe('2ab7c78b-d713-46ff-b5a7-2a09920787c4');
  });
});

describe('RUM web-vitals — قالبِ صفحه', () => {
  it('ریشه‌ی شهر، تخصص+شهر، و لندینگِ مشاوره از هم تفکیک می‌شوند', () => {
    expect(pageTemplate('/s/', false)).toBe('listing_city_root');
    expect(pageTemplate('/s/tehran/', false)).toBe('listing_city_root');
    expect(pageTemplate('/s/tehran/dermatology/', false)).toBe('listing_specialty_city');
    expect(pageTemplate('/s/ir/psychology/', true)).toBe('consult_landing');
  });
});

describe('RUM web-vitals — payload', () => {
  const ctx = {
    pathname: '/s/tehran/dermatology/',
    isConsult: false,
    targetName: 'search',
    terminalId: 'abc-123',
    buildId: 'BUILD_X',
    isMobile: true,
    connection: '4g',
    isApplication: false,
  };

  it('مقادیرِ کلیدی را دارد', () => {
    const p = buildPayload(metric, ctx);
    expect(p).toMatchObject({
      event_group: 'web_vitals_search',
      event_type: 'web_vital',
      metric: 'LCP',
      page_template: 'listing_specialty_city',
      device: 'mobile',
      connection: '4g',
      build_id: 'BUILD_X',
      terminal_id: 'abc-123',
    });
    expect(p.value).toBe(2345.678);
  });

  /**
   * گاردِ حریمِ خصوصی — مهم‌ترین تستِ این فایل.
   * متنِ جستجوی کاربر می‌تواند دادهٔ سلامت باشد و طبقِ قاعده‌ی
   * ghane/docs/infrastructure-maneuver/analytics-events-map.md هرگز نباید واردِ Splunk شود.
   */
  it('هیچ query string / URL کاملی در payload نیست', () => {
    const p = buildPayload(metric, ctx);
    const serialized = JSON.stringify(p);
    expect(serialized).not.toContain('?');
    expect(serialized).not.toContain('text=');
    expect(serialized).not.toContain('http');
    expect(Object.keys(p)).not.toContain('current_url');
    expect(Object.keys(p)).not.toContain('href');
  });

  it('attribution اگر باشد کوتاه می‌شود', () => {
    const withAttr = { ...metric, attribution: { element: 'x'.repeat(2000) } } as any;
    const p = buildPayload(withAttr, ctx);
    expect(p.attribution!.length).toBeLessThanOrEqual(400);
  });

  /**
   * رگرسیونِ واقعی: در تستِ زنده معلوم شد Next داخلِ attribution آبجکتِ `navigationEntry` را
   * می‌گذارد که `name`ش **آدرسِ کامل با query string** (یعنی متنِ جستجوی کاربر) است.
   */
  it('attribution آبجکت‌های تودرتو و URL را حذف می‌کند', () => {
    const raw = {
      timeToFirstByte: 1118.4000000953674,
      loadState: 'dom-interactive',
      element: 'div.card > img',
      url: 'https://cdn.example.com/a.jpg',
      navigationEntry: {
        name: 'https://www.paziresh24.com/s/tehran/dermatology/?text=%D8%AF%DA%A9%D8%AA%D8%B1',
        entryType: 'navigation',
      },
    };
    const out = sanitizeAttribution(raw)!;
    expect(out).toContain('timeToFirstByte');
    expect(out).toContain('loadState');
    expect(out).toContain('element');
    expect(out).not.toContain('navigationEntry');
    expect(out).not.toContain('text=');
    expect(out).not.toContain('http');
  });

  it('payload نهایی با attributionِ آلوده هم تمیز می‌ماند', () => {
    const dirty = {
      ...metric,
      attribution: {
        navigationEntry: { name: 'https://www.paziresh24.com/s/?text=secret' },
        timeToFirstByte: 12,
      },
    } as any;
    const p = buildPayload(dirty, ctx);
    const serialized = JSON.stringify(p);
    expect(serialized).not.toContain('http');
    expect(serialized).not.toContain('secret');
    expect(serialized).toContain('timeToFirstByte');
  });
});
