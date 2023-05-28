import { ReactElement } from 'react';

import Text from '@/common/components/atom/text/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import useApplication from '@/common/hooks/useApplication';
import useWebView from '@/common/hooks/useWebView';
import demond from '@/modules/patient/assets/demond.png';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';

export const Premium = () => {
  const { query } = useRouter();
  const isWebView = useWebView();
  const isApplication = useApplication();
  const { t } = useTranslation('patient/premium');

  return (
    <>
      <Seo title={t('title')} noIndex />

      {(isWebView || isApplication) && (
        <AppBar title={t('title')} className="border-b border-slate-200" backButton={query.referrer === 'profile'} />
      )}

      <div className="relative flex flex-col items-center flex-grow p-5 bg-white pt-11">
        <img src={demond.src} className="absolute z-20 top-3" />
        <div className="relative flex flex-col items-center justify-center w-full p-4 pt-5 space-y-2 border rounded-lg before:-top-2 before:content before:absolute before:w-20 before:h-3 before:bg-white border-amber-500">
          <Text fontWeight="bold" fontSize="lg">
            اشتراک طلایی
          </Text>
          <Text align="center" fontSize="sm">
            اشتراک ماهانه طلایی برای تجربه ای بهتر در ویزیت آنلاین و بهرمندی از سایر خدمات ویژه پذیرش 24
          </Text>
        </div>
      </div>
    </>
  );
};

Premium.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showBottomNavigation={false} shouldShowPromoteApp={false} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Premium;
