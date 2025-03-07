import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useApps } from '@/modules/dashboard/apis/apps';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { App, SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useId, useMemo, useRef, useState } from 'react';

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

  const app = useMemo(() => appsData.data?.data?.find((app: App) => app.key === `${appKey}`), [isReady, appKey, appsData]);

  const selctedMenu = useMemo(
    () => app?.fragments.find((item: any) => item.type === 'menu')?.options.find((item: any) => item.key === menuKey),
    [app, isReady, menuKey, appKey],
  );
  const appName = selctedMenu?.name?.fa ?? app?.display_name?.fa ?? 'داشبورد';

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

  return (
    <LayoutWithHeaderAndFooter
      {...props.config}
      shouldShowPromoteApp={false}
      showFooter={false}
      showHeader={!isMobile}
      className="!h-svh !min-h-svh !max-h-svh:"
    >
      <SideBar className="hidden md:flex">
        <div className="flex flex-grow flex-col w-full">
          <Seo title={appName} noIndex />
          {appsData.isSuccess && selctedMenu?.embed_src && <AppBar title={appName} className="hidden pwa:!flex" />}
          <div
            key={selctedMenu?.key}
            className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto h-full flex-col flex-grow w-full relative"
          >
            {(!appsData.isSuccess || isAppLoading) && <LoadingApps />}
            {appsData.isSuccess && user?.id && selctedMenu?.embed_src && (
              <iframe
                ref={iframeRef}
                key={selctedMenu?.key}
                onLoad={() => setIsAppLoading(false)}
                className={classNames('w-full h-full flex-grow', { hidden: isAppLoading })}
                src={`https://hamdast.paziresh24.com/bridge/?app=${app.id}&menu=${selctedMenu.id}&user_id=${
                  user.id
                }&src=${encodeURIComponent(`${selctedMenu?.embed_src}${window?.location?.search ? window?.location?.search : ''}`)}`}
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
