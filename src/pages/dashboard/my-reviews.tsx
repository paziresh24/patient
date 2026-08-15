import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { Wrapper } from '@/modules/dashboard/components/wrapper';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';
import PatientReviewsPage from '../patient/reviews';

export const MyReviewsDashboardPage = () => {
  return (
    <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
      <Wrapper>
        <PatientReviewsPage />
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
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default MyReviewsDashboardPage;
