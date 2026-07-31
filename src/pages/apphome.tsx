import Loading from '@/common/components/atom/loading';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useApplication from '@/common/hooks/useApplication';
import { useDoctorHomeRedirectLoading } from '@/common/hooks/useDoctorHomeRedirectLoading';
import { shouldRedirectCachedDoctorHome } from '@/common/utils/doctorDeviceCache';
import { splunkInstance } from '@/common/services/splunk';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useState } from 'react';

const pageLoading = (
  <div data-doctor-boot-loading className="flex min-h-[50vh] flex-grow items-center justify-center">
    <Loading />
  </div>
);

const ApphomePatientContent = dynamic(() => import('@/modules/home/views/apphomePatientContent'), {
  loading: () => pageLoading,
});

const Home = () => {
  const isApplication = useApplication();
  const { query, isReady, ...router } = useRouter();
  const showHealthAssistantsButton = useFeatureIsOn('home-page::health-assistants-button');
  const [cachedDoctorBoot] = useState(() =>
    typeof window !== 'undefined' ? shouldRedirectCachedDoctorHome() : false,
  );
  const showBootLoading = cachedDoctorBoot || useDoctorHomeRedirectLoading();

  useEffect(() => {
    if (isReady && isApplication) {
      if (query.platform) localStorage.setItem('app:platform', query.platform as string);
      if (query.version_code) localStorage.setItem('app:version_code', query.version_code as string);
      if (query.version_name) localStorage.setItem('app:version_name', query.version_name as string);
      if (query.download_source) localStorage.setItem('app:download_source', query.download_source as string);
    }
  }, [isReady, query, isApplication]);

  useEffect(() => {
    if (showBootLoading) return;

    splunkInstance('homepage').sendEvent({
      group: 'home-page-load',
      type: 'home-page-load',
      event: {
        features: {
          'health-assistants-button': showHealthAssistantsButton,
        },
      },
    });
    router.prefetch('/s/[[...params]]');
  }, [showBootLoading, router, showHealthAssistantsButton]);

  if (showBootLoading) {
    return (
      <>
        <Seo title="اپلیکیشن پذیرش24" noIndex />
        {pageLoading}
      </>
    );
  }

  return (
    <>
      <Seo title="اپلیکیشن پذیرش24" noIndex />
      <ApphomePatientContent />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowBrand={false} shouldShowPromoteApp={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

/**
 * Keep a data-fetching export so next-translate preserves page statics like getLayout.
 * Intentionally does NOT call GrowthBook (CDN-friendly / fast TTFB).
 */
export const getServerSideProps = withCSR(async (_context: GetServerSidePropsContext) => {
  return { props: {} };
});

export default Home;
