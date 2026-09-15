import { AppBridge, useSetupAppBridge } from '@/common/hooks/useSetupAppBridge';
import { LoginModalProvider } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import {
  clearDoctorHomePersistedCache,
  reconcileDoctorHomeCacheUser,
  removeDoctorHomeQueries,
  restoreDoctorHomeQueryCache,
  schedulePersistDoctorHomeQueryCache,
} from '@/modules/doctorHome/utils/doctorHomeQueryPersist';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { EntryPoint } from './entryPoint';
import { DoctorHomeEarlyRedirect } from './doctorHomeEarlyRedirect';
import Splash from './splash';
import GoogleOneTap from '@/modules/login/components/googleOneTapLogin';

const Provider = ({ children, pageProps }: { children: React.ReactNode; pageProps: any }) => {
  const appBridgeConfig = useSetupAppBridge();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userId = useUserInfoStore(state => state.info?.id);
  const wasLoginRef = useRef(false);
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: true,
        },
      },
    });
    // Restore before any doctor-home section mounts so refresh shows cached data immediately.
    restoreDoctorHomeQueryCache(client);
    return client;
  });

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      schedulePersistDoctorHomeQueryCache(queryClient, userId);
    });
    return unsubscribe;
  }, [queryClient, userId]);

  useEffect(() => {
    if (userId != null) {
      reconcileDoctorHomeCacheUser(queryClient, String(userId));
      schedulePersistDoctorHomeQueryCache(queryClient, userId);
    }
  }, [queryClient, userId]);

  useEffect(() => {
    if (isLogin) {
      wasLoginRef.current = true;
      return;
    }
    // Only clear after an actual logout — not on the initial pre-auth boot.
    if (!wasLoginRef.current) return;
    removeDoctorHomeQueries(queryClient);
    clearDoctorHomePersistedCache();
    wasLoginRef.current = false;
  }, [isLogin, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <LoginModalProvider>
        <DoctorHomeEarlyRedirect />
        <EntryPoint>
          <AppBridge {...appBridgeConfig}>
            <>{children}</>
            <GoogleOneTap />
          </AppBridge>
        </EntryPoint>
      </LoginModalProvider>
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            padding: '1rem',
          },
          duration: 3000,
        }}
      />
      {pageProps?.themeConfing?.partnerKey && <Splash partnerLogo={pageProps?.themeConfing?.partnerLogo} />}
    </QueryClientProvider>
  );
};

export default Provider;
