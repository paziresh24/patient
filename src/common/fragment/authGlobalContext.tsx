import React, { useEffect, useMemo } from 'react';
import { DataProvider, GlobalActionsProvider } from '@plasmicapp/host';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { useUserInfoStore, UserInfo } from '@/modules/login/store/userInfo';
import { useLoginModalContext } from '@/modules/login/context/loginModal';

interface AuthGlobalContextProps {
  previewToken?: string;
}

export const normalizeAuthInfo = (info: UserInfo, deviceCached = false) => {
  const isDoctor = hasDoctorIdentity(info, deviceCached);

  return {
    ...info,
    is_doctor: isDoctor,
    provider: {
      ...info?.provider,
      job_title: isDoctor ? 'doctor' : info?.provider?.job_title ?? null,
    },
  };
};

export const AuthGlobalContext = ({ children, previewToken }: React.PropsWithChildren<AuthGlobalContextProps>) => {
  const info = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const isPending = useUserInfoStore(state => state.pending);
  const logout = useUserInfoStore(state => state.logout);
  const deviceCached = useDoctorDeviceCached();
  const { handleOpenLoginModal } = useLoginModalContext();

  useEffect(() => {
    if (previewToken) {
      localStorage.setItem('fragment::previewToken', previewToken);
    }
  }, [previewToken]);

  const authData = useMemo(
    () => ({
      isLogin,
      isPending,
      info: normalizeAuthInfo(info, deviceCached),
    }),
    [info, isLogin, isPending, deviceCached],
  );

  const actions = useMemo(
    () => ({
      login: () => handleOpenLoginModal({ state: true }),
      logout,
    }),
    [handleOpenLoginModal, logout],
  );

  return (
    <GlobalActionsProvider contextName="AuthGlobalContext" actions={actions}>
      <DataProvider name="auth" data={authData}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
