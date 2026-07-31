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

  it('returns true when deviceCached option is set', () => {
    expect(shouldOptimisticallyShowNewDoctorHome(null, { deviceCached: true })).toBe(true);
  });

  it('returns true when memoryEnabledTrue', () => {
    expect(shouldOptimisticallyShowNewDoctorHome('42', { memoryEnabledTrue: true })).toBe(true);
  });

  it('ignores raw localStorage during sync helper (caller must pass deviceCached)', () => {
    localStorage.setItem(DOCTOR_DEVICE_CACHE_KEY, '1');
    expect(shouldOptimisticallyShowNewDoctorHome('42')).toBe(false);
  });
});
