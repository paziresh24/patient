import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import useWebView from '@/common/hooks/useWebView';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { SubuserList } from '@/modules/patient/views/subuser';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';

export const Bookmarks: NextPageWithLayout = () => {
  const { query } = useRouter();
  const isWebView = useWebView();
  const { t } = useTranslation('patient/subuser');

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {isWebView && <AppBar title={t('title')} className="border-b border-slate-200" backButton={query.referrer === 'profile'} />}

      <div className="flex space-y-5 flex-col p-5 bg-white">
        {!isWebView && (
          <Text fontWeight="black" fontSize="xl">
            {t('title')}
          </Text>
        )}
        <SubuserList />
      </div>
    </>
  );
};

Bookmarks.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter>
      <PatientProfileLayout>{page}</PatientProfileLayout>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async () => {
  return {
    props: {},
  };
});

export default Bookmarks;
