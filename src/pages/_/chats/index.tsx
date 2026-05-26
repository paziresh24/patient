import Loading from '@/common/components/atom/loading';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { Report } from '@/modules/hamdast/components/report';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useRef, useState } from 'react';

const HAMI_ORIGIN = 'https://hami.paziresh24.com';

const isHamiMainChatsUrl = (url: string) => {
  try {
    const raw = url?.trim();
    if (!raw) return false;

    let origin: string | null = null;
    let pathname: string;

    if (raw.startsWith('/')) {
      // Sometimes iframe sends relative paths.
      origin = HAMI_ORIGIN;
      pathname = raw;
    } else {
      const candidate = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
      const parsed = new URL(candidate);
      origin = parsed.origin;
      pathname = parsed.pathname;
    }

    if (origin !== HAMI_ORIGIN) return false;

    const path = pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/chats') return true;
    if (/^\/chat\/[^/]+/i.test(path)) return false;
    if (/^\/stories(\/|$)/i.test(path)) return false;

    return false;
  } catch {
    return false;
  }
};

export const Dashboard = (props: any) => {
  const user = useUserInfoStore(state => state.info);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showBottomNavigation, setShowBottomNavigation] = useState(true);
  const iframeRef = useRef<any>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== HAMI_ORIGIN) return;
      if (event.data?.type !== 'IFRAME_URL_CHANGED' || !event.data?.url) return;

      setShowBottomNavigation(isHamiMainChatsUrl(event.data.url));
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
          src={`https://hami.paziresh24.com/`}
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

export default Dashboard;
