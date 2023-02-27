import useCustomize from '@/common/hooks/useCustomize';
import useServerQuery from '@/common/hooks/useServerQuery';
import { splunkInstance } from '@/common/services/splunk';
import Provider from '@/components/layouts/provider';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
import { ReactElement, ReactNode, useEffect } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import { DehydratedState, Hydrate } from 'react-query';
import '../styles/globals.css';
const { publicRuntimeConfig } = getConfig();

const growthbook = new GrowthBook({
  apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
  clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
  trackingCallback: (experiment, result) => {
    splunkInstance().sendEvent({
      group: 'growth-book',
      type: 'growth-book-event',
      event: {
        experiment,
        result,
        terminal_id: getCookie('terminal_id'),
      },
    });
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface AppPropsWithLayout extends ExtendedAppProps<extendAppProps> {
  Component: NextPageWithLayout<extendAppProps>;
}

interface extendAppProps {
  dehydratedState: DehydratedState;
  query: any;
  config: any;
}

type ExtendedAppProps<P = {}> = AppProps<P>;

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  useEffect(() => {
    growthbook.loadFeatures({ autoRefresh: true });
    growthbook.setAttributes({
      id: getCookie('terminal_id'),
    });
  }, []);

  useEffect(() => {
    useCustomize.getState().setCustomize(pageProps.query);
    useServerQuery.getState().setQueries(pageProps.query);
  }, [pageProps.query]);

  return (
    <>
      <NextNProgress height={3} color="#3861fb" options={{ showSpinner: false }} />
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Provider pageProps={pageProps}>
        <Hydrate state={pageProps.dehydratedState}>
          {getLayout(
            <GrowthBookProvider growthbook={growthbook}>
              <Component {...pageProps} config={{ showHeader: !pageProps.query?.application, showFooter: !pageProps.query?.application }} />
            </GrowthBookProvider>,
          )}
        </Hydrate>
      </Provider>
    </>
  );
}

export default MyApp;
