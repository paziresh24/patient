import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { create } from 'zustand';

export const useWebViewStore = create<{
  isWebView: boolean;
  setIsWebView: (isWebView: boolean) => void;
}>(set => ({
  isWebView: false,
  setIsWebView: isWebView => set(state => ({ ...state, isWebView })),
}));

export const useWebView = () => {
  const { query } = useRouter();
  const { isWebView, setIsWebView } = useWebViewStore();

  useEffect(() => {
    if (!isWebView) {
      setIsWebView(!!query.isWebView || (typeof window !== 'undefined' && window?.matchMedia('(display-mode: standalone)')?.matches));
    }
  }, [query]);

  return isWebView;
};

export default useWebView;
