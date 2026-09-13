import {
  DOCTOR_DEVICE_CACHE_EVENT,
  isDoctorDeviceCached,
  isDoctorDeviceMarkedInDom,
} from '@/common/utils/doctorDeviceCache';
import { useLayoutEffect, useState } from 'react';

/**
 * Hydration-safe doctor-device cache flag.
 * First render is always false (matches SSR). Does not import the user store
 * (that cycle TDZ-crashed Next SSG of `/_/` in CI).
 */
export function useDoctorDeviceCached(): boolean {
  const [cached, setCached] = useState(false);

  useLayoutEffect(() => {
    const sync = () => setCached(isDoctorDeviceMarkedInDom() || isDoctorDeviceCached());
    sync();
    window.addEventListener(DOCTOR_DEVICE_CACHE_EVENT, sync);
    return () => window.removeEventListener(DOCTOR_DEVICE_CACHE_EVENT, sync);
  }, []);

  return cached;
}
