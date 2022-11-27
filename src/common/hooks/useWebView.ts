import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useWebView = () => {
  const { query } = useRouter();
  const isWebview = useMemo(() => query.isWebView, []);

  return isWebview;
};

export default useWebView;
