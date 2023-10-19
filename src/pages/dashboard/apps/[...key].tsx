import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import classNames from '@/common/utils/classNames';
import { useApps } from '@/modules/dashboard/apis/apps';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { Wrapper } from '@/modules/dashboard/components/wrapper';
import { App, SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import Appointments from 'src/pages/patient/appointments';
import Bookmarks from 'src/pages/patient/bookmarks';
import PatinetProfile from 'src/pages/patient/profile';
import Subusers from 'src/pages/patient/subuser';

export const Dashboard = () => {
  const user = useUserInfoStore(state => state.info);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  const appsData = useApps({ user_id: user.id ?? '', phone_number: user.cell, is_doctor: !!user.is_doctor }, { enabled: !!user.id });
  const {
    query: { key: keys },
    isReady,
  } = useRouter();

  const appKey = (keys as string[])[0];
  const menuKey = (keys as string[])[1];

  console.log(appKey, menuKey);
  console.log(appsData.data?.data);

  const app = useMemo(() => appsData.data?.data?.find((app: App) => app.key === `${appKey}`), [isReady, appKey, appsData]);
  console.log({ app });

  const selctedMenu = useMemo(() => app?.navigation_items.find((item: any) => item.key === menuKey), [app, isReady, menuKey, appKey]);
  console.log({ selctedMenu });

  useEffect(() => {
    setIsAppLoading(true);
  }, []);

  const intents = {
    appointments: (
      <Wrapper>
        <Appointments />
      </Wrapper>
    ),
    bookmarks: (
      <Wrapper>
        <Bookmarks />
      </Wrapper>
    ),
    subuser: (
      <Wrapper>
        <Subusers />
      </Wrapper>
    ),
    profile: (
      <Wrapper>
        <PatinetProfile />
      </Wrapper>
    ),
  };

  type Intents = 'appointments' | 'bookmarks' | 'subuser';
  console.log(isAppLoading);

  return (
    <div className="flex flex-col w-full">
      <Seo title={selctedMenu?.label} noIndex />
      {/* 
      {apps.isSuccess && !appData?.source?.startsWith('paziresh24://') && (
        <AppBar title={appData?.name ?? ''} className="hidden pwa:!flex" />
      )} */}
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

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Dashboard;
