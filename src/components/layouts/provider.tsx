import { CacheProvider, ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import theme from "theme.mui";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </CacheProvider>
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        rtl
        draggable
        closeButton
        limit={3}
        theme="colored"
        transition={Slide}
      />
    </>
  );
};

export default Provider;
