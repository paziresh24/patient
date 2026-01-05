import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = {
  color?: string;
  height?: number;
  showSpinner?: boolean;
  minimum?: number;
};

export default function RouteProgress({ color = '#3861fb', height = 2, showSpinner = false, minimum = 0.3 }: Props) {
  const router = useRouter();

  useEffect(() => {
    NProgress.configure({ showSpinner, minimum });
    document.documentElement.style.setProperty('--nprogress-color', color);
    document.documentElement.style.setProperty('--nprogress-height', `${height}px`);

    const start = () => NProgress.start();
    const done = () => NProgress.done();

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', done);
    router.events.on('routeChangeError', done);

    return () => {
      router.events.off('routeChangeStart', start);
      router.events.off('routeChangeComplete', done);
      router.events.off('routeChangeError', done);
      NProgress.done(true);
    };
  }, [router.events, color, height, showSpinner, minimum]);

  return null;
}
