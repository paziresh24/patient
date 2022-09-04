import Head from 'next/head';
import { useRouter } from 'next/router';

import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Queue from '@/modules/myTurn/components/queue';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

export const QueuePage: NextPageWithLayout = () => {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <title>شماره نوبت من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col h-[80vh] lg:rounded-3xl lg:m-10 bg-white">
        <div className="lg:p-5 space-y-3 w-full lg:w-3/12 self-center">
          <Queue bookId={query.book_id as string} />
        </div>
      </div>
    </>
  );
};

QueuePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter>{page}</LayoutWithHeaderAndFooter>;
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default QueuePage;
