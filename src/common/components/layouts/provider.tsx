import { LoginModalProvider } from '@/modules/login/context/modalLogin';
import { ModalLogin } from '@/modules/login/views/modalLogin';
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
      retry: false,
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
    <LoginModalProvider>
      <QueryClientProvider client={queryClient}>
        <EntryPoint>
          <>
            {children} <ModalLogin />
          </>
        </EntryPoint>
      </QueryClientProvider>
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
    </LoginModalProvider>
  );
};

export default Provider;
