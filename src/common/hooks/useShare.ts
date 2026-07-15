import toast from 'react-hot-toast';
import useWebView from './useWebView';

interface shareParams {
  title?: string;
  text?: string;
  url: string;
}

export const useShare = () => {
  const isWebView = useWebView();

  const share = async ({ title = '', text = '', url }: shareParams) => {
    if (typeof window === 'undefined') return;

    if (isWebView) {
      window.Android.shareQA(text, url);
      return;
    }

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error: any) {
        if (error?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard?.writeText(url);
      toast.success('لینک کپی شد.');
    } catch {
      toast.error('اشتراک‌گذاری در این مرورگر پشتیبانی نمی‌شود.');
    }
  };

  return share;
};

export default useShare;
