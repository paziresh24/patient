import Head from 'next/head';
import { ReactElement } from 'react';

import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { PatientProfileLayout } from '@/modules/patient/layout/patientProfile';
import { BookmarksList } from '@/modules/patientProfile/views/bookmarksList';
import { NextPageWithLayout } from '../_app';

export const Bookmarks: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>پروفایل</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex space-y-5 flex-col p-5 bg-white">
        <Text fontWeight="black" fontSize="xl">
          لیست پزشکان من
        </Text>
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
