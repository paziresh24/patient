import { LoginModalProvider } from '@/modules/login/context/loginModal';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { EntryPoint } from './entryPoint';
import Splash from './splash';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: true,
    },
  },
});

const Provider = ({ children, pageProps }: { children: React.ReactNode; pageProps: any }) => {
  useEffect(() => {
    TagManager.initialize({
      gtmId: pageProps.query?.['gtm:id'] ?? pageProps.query?.university ? 'GTM-56C68BQ' : 'GTM-P5RPLDP',
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
      {pageProps.pageProps?.query?.university && <Splash partnerLogo={pageProps?.query?.['partner:logo']} />}
    </QueryClientProvider>
  );
};

export default Provider;
