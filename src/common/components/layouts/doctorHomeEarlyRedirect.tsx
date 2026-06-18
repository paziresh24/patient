import { redirectCachedDoctorHome } from '@/common/utils/doctorDeviceCache';
import { useLayoutEffect, useRef } from 'react';

export const DoctorHomeEarlyRedirect = () => {
  const hasRedirected = useRef(false);

  useLayoutEffect(() => {
    if (hasRedirected.current) return;
    if (redirectCachedDoctorHome()) {
      hasRedirected.current = true;
    }
  }, []);

  return null;
};
