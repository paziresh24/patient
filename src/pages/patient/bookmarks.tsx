import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { BookmarksList } from '@/modules/patientProfile/views/bookmarksList';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';

export const Bookmarks: NextPageWithLayout = () => {
  const { query } = useRouter();

  return (
    <>
      <Head>
        <title>لیست پزشکان من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {query.isWebView && <AppBar title="لیست پزشکان من" className="border-b border-slate-200" backButton={query.referrer === 'profile'} />}

      <div className="flex space-y-5 flex-col p-5 bg-white">
        {!query.isWebView && (
          <Text fontWeight="black" fontSize="xl">
            لیست پزشکان من
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

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Bookmarks;
