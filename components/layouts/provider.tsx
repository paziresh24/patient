import { QueryClient, QueryClientProvider } from "react-query";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
