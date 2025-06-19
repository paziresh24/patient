import useWebView from './useWebView';

interface shareParams {
  title?: string;
  text?: string;
  url: string;
}

export const useShare = () => {
  const isWebView = useWebView();

  const share = ({ title = '', text = '', url }: shareParams) => {
    if (isWebView) return window.Android.shareQA(text, url);
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
