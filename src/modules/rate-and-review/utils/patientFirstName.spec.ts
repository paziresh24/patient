import { toPatientFirstName } from './patientFirstName';

describe('toPatientFirstName', () => {
  it('keeps a single first name', () => {
    expect(toPatientFirstName('سارا')).toBe('سارا');
    expect(toPatientFirstName('  سارا  ')).toBe('سارا');
  });

  it('drops family from full display names', () => {
    expect(toPatientFirstName('نرگس بهرامی')).toBe('نرگس');
    expect(toPatientFirstName('سید علاالدین دشتی')).toBe('سید');
  });

  it('returns undefined for empty values', () => {
    expect(toPatientFirstName(null)).toBeUndefined();
    expect(toPatientFirstName(undefined)).toBeUndefined();
    expect(toPatientFirstName('   ')).toBeUndefined();
  });
});
