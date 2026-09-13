import { doctorJobTitleAttr, hasDoctorIdentity, isDoctorUser } from './doctorIdentity';

describe('hasDoctorIdentity', () => {
  it('is true when provider centers exist', () => {
    const user = { provider: { centers: [{ id: 'c1' }] } };
    expect(isDoctorUser(user)).toBe(true);
    expect(hasDoctorIdentity(user)).toBe(true);
  });

  it('is true from device cache even without centers yet', () => {
    expect(hasDoctorIdentity({}, true)).toBe(true);
    expect(hasDoctorIdentity({ is_doctor: true })).toBe(true);
    expect(hasDoctorIdentity({ provider: { job_title: 'doctor' } })).toBe(true);
  });

  it('is false for empty patients', () => {
    expect(hasDoctorIdentity({ provider: { centers: [], job_title: null } })).toBe(false);
  });

  it('maps analytics job_title from identity', () => {
    expect(doctorJobTitleAttr({ provider: { centers: [{ id: 'c1' }] } })).toBe('doctor');
    expect(doctorJobTitleAttr({})).toBe('normal');
    expect(doctorJobTitleAttr({}, true)).toBe('doctor');
  });
});
