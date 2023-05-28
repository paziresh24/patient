import { LoginModalProvider } from '@/modules/login/context/loginModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { Toaster } from 'react-hot-toast';
import { EntryPoint } from './entryPoint';
import Splash from './splash';

const Provider = ({ children, pageProps }: { children: React.ReactNode; pageProps: any }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: true,
          },
        },
      }),
  );

  useEffect(() => {
    TagManager.initialize({
      gtmId: pageProps.query?.['gtm:id'] ?? 'GTM-P5RPLDP',
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LoginModalProvider>
        <EntryPoint>
          <>{children}</>
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
      {pageProps?.query?.university && <Splash partnerLogo={pageProps?.query?.['partner:logo']} />}
    </QueryClientProvider>
  );
};

export default Provider;
