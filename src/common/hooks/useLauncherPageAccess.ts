import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const LAUNCHER_HOME_PATHS = ['/_', '/_/'];

export const useLauncherPageAccess = () => {
  const router = useRouter();
  const deviceCached = useDoctorDeviceCached();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const doctorProfilePending = useUserInfoStore(state => state.doctorProfilePending);
  const hasRedirected = useRef(false);

  const hasIdentity = hasDoctorIdentity(user, deviceCached);
  const isResolving = (pending || doctorProfilePending) && !hasIdentity;
  const isDoctor = isLogin && hasIdentity;

  useEffect(() => {
    if (!LAUNCHER_HOME_PATHS.includes(router.pathname)) return;
    // Cached doctors are allowed to stay while profile/login finishes — avoids /_/ ↔ /patient loops.
    if (hasIdentity) return;
    if (pending || doctorProfilePending) return;
    if (isDoctor) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;
    void router.replace('/patient');
  }, [pending, doctorProfilePending, isDoctor, hasIdentity, router, router.pathname]);

  return {
    isResolving,
    isDoctor: isDoctor || hasIdentity,
    shouldShowLauncher: !isResolving && (isDoctor || hasIdentity),
  };
};
