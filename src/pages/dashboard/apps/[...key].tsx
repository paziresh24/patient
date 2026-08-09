import Loading from '@/common/components/atom/loading';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useApps } from '@/modules/dashboard/apis/apps';
import { buildDashboardEmbedSrc, getKnownDrappEmbedSrc } from '@/modules/dashboard/constants/knownEmbedSrc';
import { App, SideBar } from '@/modules/dashboard/layouts/sidebar';
import { Report } from '@/modules/hamdast/components/report';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useMemo, useRef, useState } from 'react';

export const Dashboard = (props: any) => {
  const user = useUserInfoStore(state => state.info);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  const sessionStartTime = useRef<any>(null);
  const appsData = useApps();
  const {
    query: { key: keys },
    isReady,
  } = useRouter();
  const { isMobile } = useResponsive();

  const appKey = (keys as string[])[0];
  const menuKey = (keys as string[])[1];

  const knownEmbedSrc = useMemo(() => getKnownDrappEmbedSrc(appKey, menuKey), [appKey, menuKey]);

  const app = useMemo(() => appsData.data?.data?.find((app: App) => app.key === `${appKey}`), [isReady, appKey, appsData]);

  const selctedMenu = useMemo(
    () => app?.fragments.find((item: any) => item.type === 'menu')?.options.find((item: any) => item.key === menuKey),
    [app, isReady, menuKey, appKey],
  );
  const appName = selctedMenu?.name?.fa ?? app?.display_name?.fa ?? 'داشبورد';
  const embedSrc = knownEmbedSrc ?? selctedMenu?.embed_src;
  const waitingForHamdastMenu = !knownEmbedSrc && !appsData.isSuccess;

  useEffect(() => {
    setIsAppLoading(true);
  }, [appKey, menuKey]);

  useEffect(() => {
    sessionStartTime.current = Date.now();

    if (app?.id && selctedMenu?.id && user?.id) {
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast-insight',
        type: 'active-users',
        event: {
          data: {
            user_id: user.id,
            job_title: user.provider?.job_title ?? 'normal',
            menu_key: menuKey,
            app_key: appKey,
            menu_id: selctedMenu?.id,
            app_id: app?.id,
          },
        },
      });
    }

    return () => {
      const sessionEndTime = Date.now();
      const sessionDuration = sessionEndTime - sessionStartTime.current;
      if (app?.id && selctedMenu?.id && user?.id) {
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast-insight',
          type: 'session-duration',
          event: {
            data: {
              user_id: user.id,
              job_title: user.provider?.job_title ?? 'normal',
              menu_key: menuKey,
              app_key: appKey,
              menu_id: selctedMenu?.id,
              app_id: app?.id,
              duration: sessionDuration,
            },
          },
        });
      }
    };
  }, [app, selctedMenu, user?.id, isReady]);

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 6000);
  }, [appKey, menuKey]);

  return (
    <LayoutWithHeaderAndFooter
      {...props.config}
      shouldShowPromoteApp={false}
      showFooter={false}
      showHeader={!isMobile}
      className="!h-svh !min-h-svh !max-h-svh:"
    >
      <AppBar
        title={appName}
        className="md:hidden"
        titleLoading={!knownEmbedSrc && !appsData.isSuccess}
        backButton={true}
        actionButton={<Report app_key={appKey as string} page_key={menuKey} />}
      />
      <SideBar className="hidden md:flex">
        <div className="flex flex-grow flex-col w-full">
          <Seo title={appName} noIndex />
          <div
            key={menuKey ?? selctedMenu?.key}
            className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto h-full flex-col flex-grow w-full relative"
          >
            {(waitingForHamdastMenu || isAppLoading) && (
              <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
                <Loading />
              </div>
            )}
            {user?.id && embedSrc && (
              <iframe
                ref={iframeRef}
                key={menuKey ?? selctedMenu?.key}
                onLoad={() => setIsAppLoading(false)}
                className={classNames('w-full h-full flex-grow', { hidden: isAppLoading })}
                src={buildDashboardEmbedSrc(embedSrc, user.id, window?.location?.search)}
                allow="microphone; camera; fullscreen; clipboard-write;"
                sandbox="allow-forms allow-modals allow-downloads allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation allow-top-navigation-to-custom-protocols allow-storage-access-by-user-activation"
              />
            )}
          </div>
        </div>
      </SideBar>
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
