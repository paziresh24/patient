import Loading from '@/common/components/atom/loading';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useResponsive from '@/common/hooks/useResponsive';
import { useApps } from '@/modules/dashboard/apis/apps';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect } from 'react';
export const Dashboard = () => {
  const { isDesktop } = useResponsive();
  const apps = useApps();
  const router = useRouter();

  useEffect(() => {
    if (apps.isError && isDesktop) {
      router.push('/dashboard/profile');
    }
    const firstApp = apps.data?.data?.[0];
    const firstAppMenu = firstApp?.fragments?.find((item: any) => item.type === 'menu')?.options?.[0];
    if (apps.isSuccess && isDesktop) {
      if (!firstAppMenu) {
        router.push('/dashboard/profile');
        return;
      }
      router.push(`/dashboard/apps/${firstApp?.key}/${firstAppMenu?.key}/`);
    }
  }, [apps.status, isDesktop]);

  return (
    <>
      <Seo title="داشبورد" noIndex />
      <SideBar fullWidth className="md:hidden">
        <div className="w-full bg-white hidden md:flex  md:h-[calc(100vh-80px)]  justify-center items-center h-full flex-grow">
          <Loading />
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
