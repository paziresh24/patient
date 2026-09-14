import { useClientMounted } from '@/common/hooks/useClientMounted';
import { useIsomorphicLayoutEffect } from '@/common/hooks/useIsomorphicLayoutEffect';
import { isMobileViewport } from '@/common/hooks/useResponsive';
import {
  isDoctorDeviceCached,
  redirectCachedDoctorHome,
} from '@/common/utils/doctorDeviceCache';
import { isDoctorHomeRedirectPath } from '@/common/utils/doctorHomePaths';
import { isPatientViewModeStored } from '@/modules/doctorHome/store/viewMode';
import { isSpaPatientView, useSpaPatientViewStore } from '@/modules/doctorHome/utils/spaPatientView';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';

export { hasDoctorIdentity, isDoctorUser } from '@/common/utils/doctorIdentity';

export const useDoctorHomeRedirect = () => {
  const router = useRouter();
  const mounted = useClientMounted();
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pending = useUserInfoStore(state => state.pending);
  const spaPatientView = useSpaPatientViewStore(state => state.active);
  const hasRedirected = useRef(false);

  const isCachedDoctor = mounted && isDoctorDeviceCached();
  const isDoctor = isLogin && hasDoctorIdentity(user, isCachedDoctor);
  // Soft SPA patient switch (in-memory or sessionStorage from switcher click).
  const isPatientOptOut = spaPatientView || (mounted && isPatientViewModeStored());
  // Desktop: never. Mobile soft-nav: never bounce if patient opted out.
  // Cold/hard redirect paths ignore patient storage (see redirectCachedDoctorHome).
  const shouldRedirect =
    mounted &&
    !pending &&
    isDoctorHomeRedirectPath(router.pathname) &&
    isDoctor &&
    isMobileViewport() &&
    !isPatientOptOut;

  useEffect(() => {
    if (isLogin || isCachedDoctor) {
      void router.prefetch('/_/');
    }
  }, [isLogin, isCachedDoctor, router]);

  // Cold-load / refresh: hard redirect before paint — mobile only, ignores patient storage.
  useIsomorphicLayoutEffect(() => {
    if (hasRedirected.current) return;
    if (isSpaPatientView()) return;
    if (redirectCachedDoctorHome()) {
      hasRedirected.current = true;
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isPatientOptOut) {
      hasRedirected.current = false;
      return;
    }
    if (hasRedirected.current) return;
    if (!shouldRedirect) return;
    if (!router.isReady) return;

    hasRedirected.current = true;
    void router.replace('/_/');
  }, [shouldRedirect, isPatientOptOut, router, router.isReady, router.pathname]);
};
