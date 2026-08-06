import { isDoctorProfileSelfRedirect, normalizeDoctorProfileSlug } from './isDoctorProfileSelfRedirect';

describe('normalizeDoctorProfileSlug', () => {
  it('returns bare slug from path', () => {
    expect(normalizeDoctorProfileSlug('/dr/کارشناس-سیدرضا-حجازیان/')).toBe('کارشناس-سیدرضا-حجازیان');
  });

  it('decodes percent-encoded path', () => {
    const encoded = '/dr/%DA%A9%D8%A7%D8%B1%D8%B4%D9%86%D8%A7%D8%B3-%D8%B3%DB%8C%D8%AF%D8%B1%D8%B6%D8%A7-%D8%AD%D8%AC%D8%A7%D8%B2%DB%8C%D8%A7%D9%86/';
    expect(normalizeDoctorProfileSlug(encoded)).toBe('کارشناس-سیدرضا-حجازیان');
  });

  it('accepts bare slug', () => {
    expect(normalizeDoctorProfileSlug('کارشناس-سیدرضا-حجازیان')).toBe('کارشناس-سیدرضا-حجازیان');
  });

  it('strips absolute origin', () => {
    expect(normalizeDoctorProfileSlug('https://www.paziresh24.com/dr/دکتر-تست-0/')).toBe('دکتر-تست-0');
  });
});

describe('isDoctorProfileSelfRedirect', () => {
  const slug = 'کارشناس-سیدرضا-حجازیان';

  it('detects self-redirect when route matches current slug', () => {
    expect(isDoctorProfileSelfRedirect(slug, `/dr/${slug}/`)).toBe(true);
  });

  it('detects self-redirect when route is percent-encoded', () => {
    expect(isDoctorProfileSelfRedirect(slug, encodeURI(`/dr/${slug}/`))).toBe(true);
  });

  it('allows real redirects to a different slug', () => {
    expect(isDoctorProfileSelfRedirect(slug, '/dr/دکتر-سیدرضا-حجازیان-0/')).toBe(false);
  });

  it('returns false for empty inputs', () => {
    expect(isDoctorProfileSelfRedirect('', `/dr/${slug}/`)).toBe(false);
    expect(isDoctorProfileSelfRedirect(slug, '')).toBe(false);
  });
});
