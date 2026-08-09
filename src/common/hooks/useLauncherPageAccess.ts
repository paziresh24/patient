import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { useClientMounted } from '@/common/hooks/useClientMounted';
import { isDoctorDeviceCached } from '@/common/utils/doctorDeviceCache';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const LAUNCHER_HOME_PATHS = ['/_', '/_/'];

export const useLauncherPageAccess = () => {
  const router = useRouter();
  const mounted = useClientMounted();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const doctorProfilePending = useUserInfoStore(state => state.doctorProfilePending);
  const hasRedirected = useRef(false);

  // localStorage is unavailable on SSR — defer cache read until after hydration.
  const hasDoctorIdentity = (mounted && isDoctorDeviceCached()) || (isLogin && isDoctorUser(user));
  const isResolving = (pending || doctorProfilePending) && !hasDoctorIdentity;
  const isDoctor = isLogin && isDoctorUser(user);

  useEffect(() => {
    if (!LAUNCHER_HOME_PATHS.includes(router.pathname)) return;
    // Cached doctors are allowed to stay while profile/login finishes — avoids /_/ ↔ /patient loops.
    if (hasDoctorIdentity) return;
    if (pending || doctorProfilePending) return;
    if (isDoctor) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;
    void router.replace('/patient');
  }, [pending, doctorProfilePending, isDoctor, hasDoctorIdentity, router, router.pathname]);

  return {
    isResolving,
    isDoctor: isDoctor || hasDoctorIdentity,
    shouldShowLauncher: !isResolving && (isDoctor || hasDoctorIdentity),
  };
};
