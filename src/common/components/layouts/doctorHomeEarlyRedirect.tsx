import { redirectCachedDoctorHome } from '@/common/utils/doctorDeviceCache';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import { isSpaPatientView } from '@/modules/doctorHome/utils/spaPatientView';
import { useRef } from 'react';

export const DoctorHomeEarlyRedirect = () => {
  const hasRedirected = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (hasRedirected.current) return;
    // On SPA switch to patient view, don't force back to doctor home.
    // (This in-memory flag is reset on full refresh/direct load.)
    if (isSpaPatientView()) return;
    if (redirectCachedDoctorHome()) {
      hasRedirected.current = true;
    }
  }, []);

  return null;
};
