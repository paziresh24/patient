import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useResponsive from '@/common/hooks/useResponsive';
import { useApps } from '@/modules/dashboard/apis/apps';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import flatten from 'lodash/flatten';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect } from 'react';
export const Dashboard = () => {
  const { isMobile, isDesktop } = useResponsive();
  const user = useUserInfoStore(state => state.info);
  const apps = useApps(
    { user_id: user.id ?? '', phone_number: user.cell, is_doctor: user.provider?.job_title === 'doctor' },
    { enabled: !!user.id },
  );
  const router = useRouter();

  useEffect(() => {
    if (apps.isSuccess && isDesktop) {
      if (apps.data.data.length === 0) {
        router.push('/dashboard/profile');
        return;
      }
      router.push(
        `/dashboard/apps/${(flatten(apps.data.data)?.[0] as any)?.key}/${
          (flatten(apps.data.data)?.[0] as any)?.navigation_items?.[0]?.key
        }/`,
      );
    }
  }, [apps.isSuccess, isDesktop]);

  return (
    <>
      <Seo title="داشبورد" noIndex />
      <SideBar fullWidth className="md:hidden">
        <div className="hidden md:flex   md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
          <LoadingApps />
        </div>
      </SideBar>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} shouldShowPromoteApp={false} showFooter={false}>
      {page}
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
