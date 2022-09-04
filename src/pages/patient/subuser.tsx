import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { SubuserList } from '@/modules/patientProfile/views/subuser';
import { NextPageWithLayout } from '../_app';

export const Bookmarks: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>کاربران زیرمجموعه</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex space-y-5 flex-col p-5 bg-white">
        <Text fontWeight="black" fontSize="xl">
          کاربران زیرمجوعه من
        </Text>
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
