import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import { useApps } from '@/modules/dashboard/apis/apps';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { App, SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';

export const Dashboard = () => {
  const user = useUserInfoStore(state => state.info);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  const appsData = useApps(
    { user_id: user.id ?? '', phone_number: user.cell, is_doctor: user.provider?.job_title === 'doctor' },
    { enabled: !!user.id },
  );
  const {
    query: { key: keys },
    isReady,
  } = useRouter();

  const appKey = (keys as string[])[0];
  const menuKey = (keys as string[])[1];

  const app = useMemo(() => appsData.data?.data?.find((app: App) => app.key === `${appKey}`), [isReady, appKey, appsData]);

  const selctedMenu = useMemo(() => app?.navigation_items.find((item: any) => item.key === menuKey), [app, isReady, menuKey, appKey]);

  useEffect(() => {
    setIsAppLoading(true);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <Seo title={selctedMenu?.label} noIndex />

      {appsData.isSuccess && selctedMenu?.url && <AppBar title={selctedMenu?.label ?? app.name ?? ''} className="hidden pwa:!flex" />}
      <div
        key={selctedMenu?.key}
        className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative"
      >
        {(!appsData.isSuccess || isAppLoading) && <LoadingApps />}
        {appsData.isSuccess && selctedMenu?.url && (
          <iframe
            ref={iframeRef}
            key={selctedMenu?.key}
            onLoad={() => setIsAppLoading(false)}
            className={classNames('w-full h-full', { hidden: isAppLoading })}
            src={`${selctedMenu?.url}?user_id=${user.id}`}
          />
        )}
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      <SideBar className="hidden md:flex">{page}</SideBar>
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
