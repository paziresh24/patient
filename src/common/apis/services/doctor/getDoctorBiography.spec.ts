import { normalizeDoctorBiographyPayload } from './normalizeDoctorBiographyPayload';

describe('normalizeDoctorBiographyPayload', () => {
  it('reads flat biography string', () => {
    expect(normalizeDoctorBiographyPayload({ biography: '<p>hello</p>' })).toBe('<p>hello</p>');
  });

  it('reads nested data.biography', () => {
    expect(normalizeDoctorBiographyPayload({ data: { biography: '<p>nested</p>' } })).toBe('<p>nested</p>');
  });

  it('returns empty for blank or missing bio', () => {
    expect(normalizeDoctorBiographyPayload({ biography: '   ' })).toBe('');
    expect(normalizeDoctorBiographyPayload({})).toBe('');
    expect(normalizeDoctorBiographyPayload(null)).toBe('');
  });
});
