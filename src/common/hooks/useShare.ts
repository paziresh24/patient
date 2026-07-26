import toast from 'react-hot-toast';
import useWebView from './useWebView';

interface shareParams {
  title?: string;
  text?: string;
  url: string;
}

const copyUrlToClipboard = async (url: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = url;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};

export const useShare = () => {
  const isWebView = useWebView();

  const share = async ({ title = '', text = '', url }: shareParams) => {
    if (isWebView) {
      window.Android.shareQA(text, url);
      return;
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return;
      } catch (error) {
        // User dismissed the share sheet — do not fall back to clipboard.
        if ((error as Error)?.name === 'AbortError') return;
      }
    }

    try {
      await copyUrlToClipboard(url);
      toast.success('لینک کپی شد');
    } catch {
      toast.error('امکان اشتراک‌گذاری وجود ندارد');
    }
  };

  return share;
};

export default useShare;
