import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { Wrapper } from '@/modules/dashboard/components/wrapper';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { redirectToRaviMyReviewsFromContext } from '@/modules/patient/utils/redirectToRaviMyReviewsFromContext';
import { RedirectToRaviMyReviews } from '@/modules/patient/views/redirectToRaviMyReviews';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

export const MyReviewsDashboardPage = () => {
  return (
    <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
      <Wrapper>
        <RedirectToRaviMyReviews />
      </Wrapper>
    </div>
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
    return redirectToRaviMyReviewsFromContext(context);
  }),
);

export default MyReviewsDashboardPage;
