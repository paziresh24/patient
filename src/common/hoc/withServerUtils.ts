import { GrowthBook } from '@growthbook/growthbook-react';
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next';
import { getServerSideGrowthBookContext } from '../helper/getServerSideGrowthBookContext';
import { splunkInstance } from '../services/splunk';

export const withServerUtils = (next: GetServerSideProps & any) => async (ctx: GetServerSidePropsContext) => {
  const host = ctx.req.headers?.host;
  let themeConfing = {};
  try {
    const growthbookContext = getServerSideGrowthBookContext(ctx.req as NextApiRequest);
    const growthbook = new GrowthBook(growthbookContext);
    await growthbook.loadFeatures({ timeout: 500 });

    themeConfing = growthbook.getFeatureValue(`theme-config:${host}`, {});

    splunkInstance('doctor-profile').sendEvent({
      group: 'theme-config',
      type: 'theme-config',
      event: {
        host: host,
        headers: ctx.req.headers,
        config: themeConfing,
      },
    });
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
      host: ctx.req.headers.host,
    },
  };
};
