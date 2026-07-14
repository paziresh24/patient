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
import { App, SideBar } from '@/modules/dashboard/layouts/sidebar';
import { Report } from '@/modules/hamdast/components/report';
import { useHamdastGrowthBookEmbedSrc } from '@/modules/hamdast/utils/useHamdastGrowthBookEmbedSrc';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useMemo, useRef, useState } from 'react';

const KATIBE_BILLS_FEATURE = 'hamdast::katibe-bills';
const DEFAULT_BILLS_EMBED_SRC = 'https://katibe.paziresh24.com/transactions-search';

export const Dashboard = (props: any) => {
  const user = useUserInfoStore(state => state.info);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  const sessionStartTime = useRef<any>(null);
  const appsData = useApps();
  const { isMobile } = useResponsive();

  const app = useMemo(() => appsData.data?.data?.find((item: App) => item.key === 'katibe'), [appsData.data?.data]);
  const selectedMenu = useMemo(
    () => app?.fragments.find((item: any) => item.type === 'menu')?.options.find((item: any) => item.key === 'bills'),
    [app],
  );
  const embedSrc = useHamdastGrowthBookEmbedSrc(KATIBE_BILLS_FEATURE, DEFAULT_BILLS_EMBED_SRC, user?.id);

  useEffect(() => {
    sessionStartTime.current = Date.now();

    if (app?.id && selectedMenu?.id && user?.id) {
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast-insight',
        type: 'active-users',
        event: {
          data: {
            user_id: user.id,
            job_title: user.provider?.job_title ?? 'normal',
            menu_key: 'bills',
            app_key: 'katibe',
            menu_id: selectedMenu.id,
            app_id: app.id,
          },
        },
      });
    }

    return () => {
      const sessionEndTime = Date.now();
      const sessionDuration = sessionEndTime - sessionStartTime.current;
      if (app?.id && selectedMenu?.id && user?.id) {
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast-insight',
          type: 'session-duration',
          event: {
            data: {
              user_id: user.id,
              job_title: user.provider?.job_title ?? 'normal',
              menu_key: 'bills',
              app_key: 'katibe',
              menu_id: selectedMenu.id,
              app_id: app.id,
              duration: sessionDuration,
            },
          },
        });
      }
    };
  }, [app, selectedMenu, user?.id]);

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 6000);
  }, []);

  const pageTitle = selectedMenu?.name?.fa ?? 'تراکنش‌ها';

  return (
    <LayoutWithHeaderAndFooter
      {...props.config}
      shouldShowPromoteApp={false}
      showFooter={false}
      showHeader={!isMobile}
      className="!h-svh !min-h-svh !max-h-svh:"
    >
      <AppBar
        title={pageTitle}
        className="md:hidden"
        titleLoading={!appsData.isSuccess}
        backButton={true}
        actionButton={<Report app_key="katibe" page_key="bills" />}
      />
      <SideBar className="hidden md:flex">
        <div className="flex flex-grow flex-col w-full">
          <Seo title={pageTitle} noIndex />
          <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto h-full flex-col flex-grow w-full relative">
            {(!appsData.isSuccess || isAppLoading) && (
              <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
                <Loading />
              </div>
            )}
            {appsData.isSuccess && user?.id && embedSrc && (
              <iframe
                key={embedSrc}
                ref={iframeRef}
                onLoad={() => setIsAppLoading(false)}
                className={classNames('w-full h-full flex-grow', { hidden: isAppLoading })}
                src={embedSrc}
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
