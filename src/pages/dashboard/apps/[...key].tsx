import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import classNames from '@/common/utils/classNames';
import { useApps } from '@/modules/dashboard/apis/apps';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { Wrapper } from '@/modules/dashboard/components/wrapper';
import { App, SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import _, { flatten } from 'lodash';
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
  const apps = useApps({ user_id: user.id ?? '', is_doctor: !!user.is_doctor }, { enabled: !!user.id });
  const {
    query: { key },
    isReady,
  } = useRouter();

  const data = flatten(apps.data?.data) as App[];

  const appKey = _.slice(key as string[], 1);
  const appAuthor = (key as string[])[0];

  const appData = useMemo(
    () =>
      data
        ?.find((app: App) => app.key === `${appAuthor}/${appKey[0]}`)
        ?.sub?.find((app: App) => app.key === `${appAuthor}/${appKey.join('/')}`) ??
      data?.find((app: App) => app.key === `${appAuthor}/${appKey[0]}`),
    [isReady, appKey, appAuthor, key],
  );
  useEffect(() => {
    setIsAppLoading(true);
  }, []);

  useEffect(() => {
    if (appData?.source?.startsWith('paziresh24://')) {
      setIsAppLoading(false);
    }

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', () => {
        setIsAppLoading(false);
      });
    }
  }, [appData]);

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

  return (
    <div className="flex flex-col w-full">
      <Seo title={appData?.name} noIndex />

      {apps.isSuccess && !appData?.source?.startsWith('paziresh24://') && (
        <AppBar title={appData?.name ?? ''} className="hidden pwa:!flex" />
      )}
      <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
        {(!apps.isSuccess || isAppLoading) && !appData?.source?.startsWith('paziresh24://') && <LoadingApps />}
        {apps.isSuccess &&
          (appData?.source?.startsWith('paziresh24://') ? (
            intents[appData.source.replace('paziresh24://', '') as Intents]
          ) : (
            <iframe
              ref={iframeRef}
              key={appData?.key}
              className={classNames('w-full h-full', { hidden: isAppLoading })}
              src={`${appData?.source}?user_id=${user.id}`}
            />
          ))}
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
