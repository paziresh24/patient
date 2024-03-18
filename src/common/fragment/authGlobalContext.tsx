import React, { useEffect, useMemo, useState } from 'react';
import { DataProvider, GlobalActionsProvider } from '@plasmicapp/host';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useLoginModalContext } from '@/modules/login/context/loginModal';

interface AuthGlobalContextProps {
  previewToken?: string;
}

export const AuthGlobalContext = ({ children, previewToken }: React.PropsWithChildren<AuthGlobalContextProps>) => {
  const userInfo = useUserInfoStore(state => ({ info: state.info, isPending: state.pending, isLogin: state.isLogin }));
  const logout = useUserInfoStore(state => state.logout);

  const [user, setUser] = useState({});
  const { handleOpenLoginModal } = useLoginModalContext();

  useEffect(() => {
    localStorage.setItem('fragment::previewToken', previewToken ?? '');
  }, [previewToken]);

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo.isLogin, userInfo.isPending, userInfo.info]);

  const actions = useMemo(
    () => ({
      login: () => handleOpenLoginModal({ state: true }),
      logout,
    }),
    [],
  );

  return (
    <GlobalActionsProvider contextName="AuthGlobalContext" actions={actions}>
      <DataProvider name="auth" data={user}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
