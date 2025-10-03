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
import { initFaro } from '@/common/services/faro';
import { useFeatureIsOn, useGrowthBook } from '@growthbook/growthbook-react';

const Provider = ({ children, pageProps }: { children: React.ReactNode; pageProps: any }) => {
  const appBridgeConfig = useSetupAppBridge();
  const growthbook = useGrowthBook();
  const isFaroEnabled = useFeatureIsOn('enable-faro');
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
    if (!growthbook) {
      return;
    }
    if (growthbook.ready) return;

    growthbook
      .loadFeatures({ autoRefresh: true })
      .catch(error => console.error('Failed to load GrowthBook features', error));
  }, [growthbook]);

  // Initialize Grafana Faro only for specific users based on feature flag
  useEffect(() => {
      if (isFaroEnabled) {
        initFaro();
      }
  }, [isFaroEnabled]);

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
