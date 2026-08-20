import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { RaviMyReviewsEmbed } from '@/modules/patient/views/RaviMyReviewsEmbed';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

export const MyReviewsDashboardPage = () => {
  return (
    <>
      <Seo title="نظرات من" noIndex />
      <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
        <RaviMyReviewsEmbed />
      </div>
    </>
  );
};

MyReviewsDashboardPage.getLayout = function getLayout(page: ReactElement) {
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

export default MyReviewsDashboardPage;
