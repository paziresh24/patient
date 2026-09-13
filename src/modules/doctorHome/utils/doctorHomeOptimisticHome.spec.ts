import { DOCTOR_DEVICE_CACHE_KEY } from '@/common/utils/doctorDeviceCache';
import { shouldOptimisticallyShowNewDoctorHome } from './doctorHomeOptimisticHome';

describe('shouldOptimisticallyShowNewDoctorHome', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns false without signals', () => {
    expect(shouldOptimisticallyShowNewDoctorHome(null)).toBe(false);
    expect(shouldOptimisticallyShowNewDoctorHome('42')).toBe(false);
  });

  it('does not treat device cache as the new-home flag', () => {
    expect(shouldOptimisticallyShowNewDoctorHome(null, { deviceCached: true })).toBe(false);
    expect(shouldOptimisticallyShowNewDoctorHome('42', { deviceCached: true })).toBe(false);
  });

  it('returns true when memoryEnabledTrue', () => {
    expect(shouldOptimisticallyShowNewDoctorHome('42', { memoryEnabledTrue: true })).toBe(true);
  });

  it('returns true when persistedEnabledTrue', () => {
    expect(shouldOptimisticallyShowNewDoctorHome('42', { persistedEnabledTrue: true })).toBe(true);
  });

  it('ignores doctor-device localStorage (caller must pass persistedEnabledTrue)', () => {
    localStorage.setItem(DOCTOR_DEVICE_CACHE_KEY, '1');
    expect(shouldOptimisticallyShowNewDoctorHome('42')).toBe(false);
  });
});
