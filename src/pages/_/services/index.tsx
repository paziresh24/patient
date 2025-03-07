import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';
import LauncherServices from '.plasmic/LauncherServices';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';
import AppBar from '@/common/components/layouts/appBar';
import Seo from '@/common/components/layouts/seo';

const Page = () => {
  return (
    <>
      <Seo title="همه خدمات" noIndex />
      <AppBar title="همه خدمات" backButton={true} />
      <GlobalContextsProvider>
        <LauncherServices />
      </GlobalContextsProvider>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter
      className="bg-white"
      showHeader={false}
      showBottomNavigation={false}
      showFooter={false}
      shouldShowPromoteApp={false}
      {...page.props.config}
    >
      {page}
    </LayoutWithHeaderAndFooter>
  );
};
export const getServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    return {};
  },
);

export default Page;
