import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import useWebView from '@/common/hooks/useWebView';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { BookmarksList } from '@/modules/patient/views/bookmarksList';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { NextPageWithLayout } from '../_app';

export const Bookmarks: NextPageWithLayout = () => {
  const { query } = useRouter();
  const isWebView = useWebView();
  const { t } = useTranslation('patient/bookmarks');

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="robots" content="noindex" />
      </Head>

      {isWebView && <AppBar title={t('title')} className="border-b border-slate-200" backButton={query.referrer === 'profile'} />}

      <div className="flex flex-col p-5 space-y-5 bg-white">
        {!isWebView && (
          <Text fontWeight="black" fontSize="xl">
            {t('title')}
          </Text>
        )}
        <BookmarksList />
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

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Bookmarks;
