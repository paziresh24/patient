import { buildRismanDoctorId } from './buildRismanDoctorId';

describe('buildRismanDoctorId', () => {
  it('formats owner_id and server_id for Risman API', () => {
    expect(buildRismanDoctorId('41f599b4-a2f7-11ea-893e-005056b09c11', 1)).toBe(
      'doctor_41f599b4-a2f7-11ea-893e-005056b09c11_1',
    );
  });

  it('defaults server_id to 1 when missing', () => {
    expect(buildRismanDoctorId('41f599b4-a2f7-11ea-893e-005056b09c11')).toBe(
      'doctor_41f599b4-a2f7-11ea-893e-005056b09c11_1',
    );
  });

  it('returns already-prefixed ids unchanged', () => {
    expect(buildRismanDoctorId('doctor_41f599b4-a2f7-11ea-893e-005056b09c11_1', 99)).toBe(
      'doctor_41f599b4-a2f7-11ea-893e-005056b09c11_1',
    );
  });

  it('returns undefined when owner_id is empty', () => {
    expect(buildRismanDoctorId('', 1)).toBeUndefined();
    expect(buildRismanDoctorId(null, 1)).toBeUndefined();
  });
});
