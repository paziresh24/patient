import { GrowthBook } from '@growthbook/growthbook-react';
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next';
import { getServerSideGrowthBookContext } from '../helper/getServerSideGrowthBookContext';
import { splunkInstance } from '../services/splunk';
import { getHost } from '../utils/getHost';
import { trackSsrError } from '../utils/ssrErrorTracker';

export const withServerUtils = (next: GetServerSideProps & any) => async (ctx: GetServerSidePropsContext) => {
  const host = getHost(ctx.req.headers);
  let themeConfing = {};
  try {
    const growthbookContext = getServerSideGrowthBookContext(ctx.req as NextApiRequest);
    const growthbook = new GrowthBook(growthbookContext);
    await growthbook.loadFeatures({ timeout: 500 });

    themeConfing = growthbook.getFeatureValue(`theme-config:${host}`, {});
  } catch (error) {
    trackSsrError(error, {
      source: 'GrowthBook',
      message: 'Failed to load theme config features',
      path: ctx.resolvedUrl || ctx.req.url,
    });
  }

  const data: any = await next?.(ctx, themeConfing);

  // Next.js GSSP must return exactly one of: props | redirect | notFound.
  // Spreading props onto a redirect/notFound response causes a 500
  // (e.g. center slugProfile 301 rename redirects).
  if (data?.redirect || data?.notFound) {
    return data;
  }

  return {
    ...data,
    props: {
      ...data?.props,
      query: ctx.query,
      themeConfing,
      host: getHost(ctx.req.headers),
    },
  };
};
