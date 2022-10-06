import { useRouter } from 'next/router';

interface shareParams {
  title?: string;
  text?: string;
  url: string;
}

export const useShare = () => {
  const { query } = useRouter();

  const share = ({ title = '', text = '', url }: shareParams) => {
    if (query.isWebView) return window.Android.shareQA(text, url);
    if (window.navigator && !!window.navigator.share) {
      navigator.share({
        title,
        text,
        url,
      });
    }
  };

  return share;
};

export default useShare;
