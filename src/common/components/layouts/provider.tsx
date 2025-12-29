import { AppBridge, useSetupAppBridge } from '@/common/hooks/useSetupAppBridge';
import { LoginModalProvider } from '@/modules/login/context/loginModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { Toaster } from 'react-hot-toast';
import { EntryPoint } from './entryPoint';
import Splash from './splash';
import config from 'next/config';
import GoogleOneTap from '@/modules/login/components/googleOneTapLogin';
const { publicRuntimeConfig } = config();

const Provider = ({ children, pageProps }: { children: React.ReactNode; pageProps: any }) => {
  const appBridgeConfig = useSetupAppBridge();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 30 * 60 * 1000,
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LoginModalProvider>
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
