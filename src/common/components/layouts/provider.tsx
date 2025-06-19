import { AppBridge, useSetupAppBridge } from '@/common/hooks/useSetupAppBridge';
import { LoginModalProvider } from '@/modules/login/context/loginModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { Toaster } from 'react-hot-toast';
import { EntryPoint } from './entryPoint';
import Splash from './splash';
import config from 'next/config';
const { publicRuntimeConfig } = config();

const Provider = ({ children, pageProps }: { children: React.ReactNode; pageProps: any }) => {
  const appBridgeConfig = useSetupAppBridge();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    if (!publicRuntimeConfig.DESABLED_GTM) {
      TagManager.initialize({
        gtmId: 'GTM-P5RPLDP',
      });
    }
  }, [publicRuntimeConfig]);

  return (
    <QueryClientProvider client={queryClient}>
      <LoginModalProvider>
        <EntryPoint>
          <AppBridge {...appBridgeConfig}>
            <>{children}</>
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
