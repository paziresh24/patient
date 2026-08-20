import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { redirectToRaviMyReviewsFromContext } from '@/modules/patient/utils/redirectToRaviMyReviewsFromContext';
import { RedirectToRaviMyReviews } from '@/modules/patient/views/redirectToRaviMyReviews';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

export const PatientReviewsPage = () => {
  const { query } = useRouter();

  return (
    <>
      <Seo title="نوبت‌ها و نظرات من" noIndex />
      <AppBar title="نوبت‌ها و نظرات من" className="hidden pwa:!flex" backButton={query.referrer === 'profile'} />
      <div className="flex flex-col bg-gray p-0 md:rounded-md md:p-5">
        <Text fontWeight="black" fontSize="xl" className="pwa:hidden mb-5 px-5 pt-5 md:px-0 md:pt-0">
          نوبت‌ها و نظرات من
        </Text>
        <RedirectToRaviMyReviews />
      </div>
    </>
  );
};

PatientReviewsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config}>
      <PatientProfileLayout>{page}</PatientProfileLayout>
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

export default PatientReviewsPage;
