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
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { useEffect, useRef, useState } from 'react';

export const Dashboard = (props: any) => {
  const user = useUserInfoStore(state => state.info);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  const { isMobile } = useResponsive();
  const {
    asPath,
    query: { id },
  } = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);
  }, []);

  return (
    <LayoutWithHeaderAndFooter
      {...props.config}
      shouldShowPromoteApp={false}
      showFooter={false}
      showHeader={false}
      showBottomNavigation={false}
      className="!h-svh !min-h-svh !max-h-svh:"
    >
      <AppBar
        title={'گفت‌وگو‌ها'}
        className="md:hidden"
        backButton={true}
        actionButton={<Report app_key={'drapp'} page_key={'appointments'} />}
      />
      <SideBar className="hidden md:flex">
        <div className="flex flex-grow flex-col w-full">
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
              src={`https://messaging-back.paziresh24.com/api/external/conversations/${id}/`}
            />
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
