import { buildRaviMyReviewsUrl } from '@/modules/patient/utils/buildRaviMyReviewsUrl';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

/** 302 to ravi-front with session token from the patient cookie. */
export function redirectToRaviMyReviewsFromContext(
  context: GetServerSidePropsContext,
): GetServerSidePropsResult<Record<string, never>> {
  const raw = context.req.cookies?.token;
  const token = typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
  return {
    redirect: {
      destination: buildRaviMyReviewsUrl(token),
      permanent: false,
    },
  };
}
