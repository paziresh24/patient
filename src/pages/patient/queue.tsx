import { useRouter } from 'next/router';

import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import Queue from '@/modules/myTurn/components/queue';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

export const QueuePage = () => {
  const { query } = useRouter();
  return (
    <>
      <Seo title=">شماره نوبت من" noIndex />

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

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default QueuePage;
