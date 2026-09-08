import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import {
  raviDocsideHandoffCacheHeaders,
} from '@/modules/patient/utils/buildRaviDocsideHandoff';
import { buildRaviDocsideUrl } from '@/modules/patient/utils/buildRaviDocsideUrl';
import { readRequestSessionToken } from '@/modules/patient/utils/buildRaviMyReviewsHandoff';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement } from 'react';

/** Same-origin bounce: httpOnly cookie → ravi-front docside with that session's token. */
const RaviDocsideHandoffPage = () => null;

RaviDocsideHandoffPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    Object.entries(raviDocsideHandoffCacheHeaders()).forEach(([key, value]) => {
      context.res.setHeader(key, value);
    });
    const token = readRequestSessionToken(context.req.cookies);
    if (!token) {
      return {
        redirect: {
          destination: `/login?redirect_url=${encodeURIComponent('/dashboard/reviews/')}`,
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: buildRaviDocsideUrl(token),
        permanent: false,
      },
    };
  }),
);

export default RaviDocsideHandoffPage;
