import { isDoctorDeviceCached, isDoctorDeviceMarkedInDom } from '@/common/utils/doctorDeviceCache';
import { useLayoutEffect, useState } from 'react';

/**
 * Hydration-safe doctor-device cache flag.
 * First render is always false (matches SSR); useLayoutEffect applies LS / html[data-doctor-device] before paint.
 */
export function useDoctorDeviceCached(): boolean {
  const [cached, setCached] = useState(false);

  useLayoutEffect(() => {
    setCached(isDoctorDeviceMarkedInDom() || isDoctorDeviceCached());
  }, []);

  return cached;
}
