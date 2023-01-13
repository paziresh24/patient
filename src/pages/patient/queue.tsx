import Head from 'next/head';
import { useRouter } from 'next/router';

import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import Queue from '@/modules/myTurn/components/queue';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../_app';

export const QueuePage: NextPageWithLayout = () => {
  const { query } = useRouter();
  return (
    <>
      <Head>
        <title>شماره نوبت من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col h-[80vh] lg:rounded-3xl lg:m-10 bg-white">
        <div className="self-center w-full space-y-3 lg:p-5 lg:w-3/12">
          <Queue bookId={query.book_id as string} />
        </div>
      </div>
    </>
  );
};

QueuePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter {...page.props.config}>{page}</LayoutWithHeaderAndFooter>;
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default QueuePage;
