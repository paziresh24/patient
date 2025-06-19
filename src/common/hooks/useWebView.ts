import { create } from 'zustand';
import { isNativeWebView } from '../utils/isNativeWebView';

export const useWebViewStore = create<{
  isWebView: boolean;
  setIsWebView: (isWebView: boolean) => void;
}>(set => ({
  isWebView: false,
  setIsWebView: isWebView => set(state => ({ ...state, isWebView })),
}));

export const useWebView = () => {
  if (typeof window === 'undefined') return false;

  return isNativeWebView();
};

export default useWebView;
