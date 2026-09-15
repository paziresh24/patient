import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import {
  raviMyReviewsHandoffCacheHeaders,
  readRequestSessionToken,
} from '@/modules/patient/utils/buildRaviMyReviewsHandoff';
import { buildRaviMyReviewsUrl } from '@/modules/patient/utils/buildRaviMyReviewsUrl';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

/** Same-origin bounce: httpOnly cookie → ravi-front with that session's token. */
const RaviMyReviewsHandoffPage = () => null;

RaviMyReviewsHandoffPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    Object.entries(raviMyReviewsHandoffCacheHeaders()).forEach(([key, value]) => {
      context.res.setHeader(key, value);
    });
    const token = readRequestSessionToken(context.req.cookies);
    if (!token) {
      return {
        redirect: {
          destination: `/login?redirect_url=${encodeURIComponent('/dashboard/my-reviews/')}`,
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: buildRaviMyReviewsUrl(token),
        permanent: false,
      },
    };
  }),
);

export default RaviMyReviewsHandoffPage;
