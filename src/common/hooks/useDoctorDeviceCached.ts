import { isDoctorDeviceCached, isDoctorDeviceMarkedInDom } from '@/common/utils/doctorDeviceCache';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useLayoutEffect, useState } from 'react';

/**
 * Hydration-safe doctor-device cache flag.
 * First render is always false (matches SSR); re-reads when store identity changes.
 */
export function useDoctorDeviceCached(): boolean {
  const [cached, setCached] = useState(false);
  const identityKey = useUserInfoStore(
    state => `${state.info.is_doctor}:${state.info.provider?.job_title}:${state.info.provider?.centers?.length ?? 0}`,
  );

  useLayoutEffect(() => {
    setCached(isDoctorDeviceMarkedInDom() || isDoctorDeviceCached());
  }, [identityKey]);

  return cached;
}
