import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { SubuserList } from '@/modules/patientProfile/views/subuser';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';

export const Bookmarks: NextPageWithLayout = () => {
  const { query } = useRouter();

  return (
    <>
      <Head>
        <title>کاربران زیرمجموعه من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      {query.isWebView && (
        <AppBar title="کاربران زیرمجموعه من" className="border-b border-slate-200" backButton={query.referrer === 'profile'} />
      )}

      <div className="flex space-y-5 flex-col p-5 bg-white">
        {!query.isWebView && (
          <Text fontWeight="black" fontSize="xl">
            کاربران زیرمجموعه من
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

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Bookmarks;
