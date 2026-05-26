import Loading from '@/common/components/atom/loading';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import {
  getHamiPathFromUrl,
  HAMI_ORIGIN,
  isHamiMainChatsUrl,
  toAppChatsRouteFromHamiPath,
  toHamiIframeSrc,
  toHamiPathFromAppRoute,
} from '@/modules/hami/chatsRouting';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useRef, useState } from 'react';

export const ChatsPage = (props: any) => {
  const router = useRouter();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showBottomNavigation, setShowBottomNavigation] = useState(true);
  const [iframeSrc, setIframeSrc] = useState(`${HAMI_ORIGIN}/`);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastSyncedRouteRef = useRef<string | null>(null);
  const syncFromIframeRef = useRef(false);

  // Only sync iframe src on first load / parent navigation (back, refresh, shared link).
  // Hami is SPA: internal navigations must not change iframe src.
  useEffect(() => {
    if (!router.isReady) return;

    const hamiPath = toHamiPathFromAppRoute(router.query.hami);
    setShowBottomNavigation(isHamiMainChatsUrl(hamiPath));

    if (syncFromIframeRef.current) {
      syncFromIframeRef.current = false;
      return;
    }

    const nextSrc = toHamiIframeSrc(hamiPath);
    setIframeSrc(prev => (prev === nextSrc ? prev : nextSrc));
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsAppLoading(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== HAMI_ORIGIN) return;
      if (event.data?.type !== 'IFRAME_URL_CHANGED' || !event.data?.url) return;

      const nextHamiPath = getHamiPathFromUrl(event.data.url);
      if (!nextHamiPath) return;

      const normalized = nextHamiPath.startsWith('/') ? nextHamiPath : `/${nextHamiPath}`;
      setShowBottomNavigation(isHamiMainChatsUrl(normalized));

      const nextRoute = toAppChatsRouteFromHamiPath(normalized);
      if (lastSyncedRouteRef.current === nextRoute) return;

      const currentRoute = router.asPath.split('?')[0];
      if (currentRoute === nextRoute) {
        lastSyncedRouteRef.current = nextRoute;
        return;
      }

      lastSyncedRouteRef.current = nextRoute;
      syncFromIframeRef.current = true;
      router.replace(nextRoute, undefined, { shallow: true, scroll: false });
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  useEffect(() => {
    if (!router.isReady) return;
    lastSyncedRouteRef.current = router.asPath.split('?')[0];
  }, [router.isReady, router.asPath]);

  return (
    <LayoutWithHeaderAndFooter
      {...props.config}
      shouldShowPromoteApp={false}
      showFooter={false}
      showHeader={false}
      showBottomNavigation={showBottomNavigation}
      className="!h-svh !min-h-svh !max-h-svh:"
    >
      <Seo title={'گفت‌وگو‌ها'} noIndex />
      <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto h-full flex-col flex-grow w-full relative">
        {isAppLoading && (
          <div className="w-full bg-white justify-center flex flex-col items-center h-full flex-grow">
            <Loading />
            <span className="text-xs font-medium">لطفا کمی صبر کنید...</span>
          </div>
        )}

        <iframe
          ref={iframeRef}
          onLoad={() => setIsAppLoading(false)}
          className={classNames('w-full h-full flex-grow', { hidden: isAppLoading })}
          allow="microphone; camera; fullscreen; clipboard-write;"
          sandbox="allow-forms allow-modals allow-downloads allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols allow-storage-access-by-user-activation"
          src={iframeSrc}
        />
      </div>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default ChatsPage;
