import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect } from 'react';

/** Legacy /patient/reviews → dashboard embed (keeps SideBar via /dashboard/my-reviews). */
export const PatientReviewsPage = () => {
  const router = useRouter();

  useEffect(() => {
    void router.replace('/dashboard/my-reviews/');
  }, [router]);

  return (
    <>
      <Seo title="نوبت‌ها و نظرات من" noIndex />
      <AppBar title="نوبت‌ها و نظرات من" className="hidden pwa:!flex" backButton={router.query.referrer === 'profile'} />
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
      redirect: {
        destination: '/dashboard/my-reviews/',
        permanent: false,
      },
    };
  }),
);

export default PatientReviewsPage;
