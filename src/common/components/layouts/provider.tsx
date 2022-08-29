import createCache from '@emotion/cache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import theme from 'theme.mui';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    TagManager.initialize({
      gtmId: 'GTM-P5RPLDP',
    });
  }, []);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CacheProvider>
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
    </>
  );
};

export default Provider;
