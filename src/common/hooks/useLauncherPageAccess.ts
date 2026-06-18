import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

const LAUNCHER_HOME_PATHS = ['/_'];

export const useLauncherPageAccess = () => {
  const router = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const user = useUserInfoStore(state => state.info);
  const pending = useUserInfoStore(state => state.pending);
  const doctorProfilePending = useUserInfoStore(state => state.doctorProfilePending);
  const hasRedirected = useRef(false);

  const isResolving = pending;
  const isDoctor = isLogin && isDoctorUser(user);

  useEffect(() => {
    if (!LAUNCHER_HOME_PATHS.includes(router.pathname)) return;
    if (pending || doctorProfilePending) return;
    if (isDoctor) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;
    router.replace('/patient');
  }, [pending, doctorProfilePending, isDoctor, router, router.pathname]);

  return {
    isResolving,
    isDoctor,
    shouldShowLauncher: !isResolving && isDoctor,
  };
};
