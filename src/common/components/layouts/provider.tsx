import { LoginModalProvider } from '@/modules/login/context/loginModal';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EntryPoint } from './entryPoint';

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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        rtl
        draggable
        closeButton
        limit={3}
        theme="colored"
        transition={Slide}
        hideProgressBar
      />
    </QueryClientProvider>
  );
};

export default Provider;
