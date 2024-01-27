import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import config from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useRef } from 'react';
const { publicRuntimeConfig } = config();

export const BazaarPage = () => {
  const { query } = useRouter();
  const iframe = useRef<any>(null);

  return (
    <>
      <Seo title="راوی" noIndex />
      <div className="relative flex flex-col items-center justify-center flex-grow w-full overflow-y-auto">
        <iframe
          ref={iframe}
          className={classNames('w-full flex-grow')}
          src={`${publicRuntimeConfig.RAVI_IFRAME_BASE_URL}/${query?.user_id}`}
        />
      </div>
    </>
  );
};

BazaarPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
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

export default BazaarPage;
