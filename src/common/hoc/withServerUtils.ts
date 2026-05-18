import { GrowthBook } from '@growthbook/growthbook-react';
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next';
import { getServerSideGrowthBookContext } from '../helper/getServerSideGrowthBookContext';
import { splunkInstance } from '../services/splunk';
import { getHost } from '../utils/getHost';

export const withServerUtils = (next: GetServerSideProps & any) => async (ctx: GetServerSidePropsContext) => {
  const host = getHost(ctx.req.headers);
  let themeConfing = {};
  try {
    const growthbookContext = getServerSideGrowthBookContext(ctx.req as NextApiRequest);
    const growthbook = new GrowthBook(growthbookContext);
    await growthbook.loadFeatures({ timeout: 500 });

    themeConfing = growthbook.getFeatureValue(`theme-config:${host}`, {});
  } catch (error) {
    console.error(error);
  }

  const data: any = await next?.(ctx, themeConfing);

  return {
    ...data,
    props: {
      ...data.props,
      query: ctx.query,
      themeConfing,
      host: getHost(ctx.req.headers),
    },
  };
};
