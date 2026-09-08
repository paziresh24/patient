import { normalizeDoctorMedicalCodePayload } from './normalizeDoctorMedicalCodePayload';

describe('normalizeDoctorMedicalCodePayload', () => {
  it('reads medical_code string', () => {
    expect(normalizeDoctorMedicalCodePayload({ medical_code: '123456' })).toBe('123456');
  });

  it('reads nested data.medical_code', () => {
    expect(normalizeDoctorMedicalCodePayload({ data: { medical_code: 'م-60681' } })).toBe('م-60681');
  });

  it('reads a raw string or number', () => {
    expect(normalizeDoctorMedicalCodePayload(' 123 ')).toBe('123');
    expect(normalizeDoctorMedicalCodePayload(123456)).toBe('123456');
  });

  it('returns empty for blank or missing code', () => {
    expect(normalizeDoctorMedicalCodePayload({ medical_code: '   ' })).toBe('');
    expect(normalizeDoctorMedicalCodePayload({})).toBe('');
    expect(normalizeDoctorMedicalCodePayload(null)).toBe('');
  });
});
