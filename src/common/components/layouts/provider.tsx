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

const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    TagManager.initialize({
      gtmId: 'GTM-P5RPLDP',
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
      <Splash />
    </QueryClientProvider>
  );
};

export default Provider;
