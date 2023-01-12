import useCustomize from '@/common/hooks/useCustomize';
import useServerQuery from '@/common/hooks/useServerQuery';
import Provider from '@/components/layouts/provider';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactElement, ReactNode, useEffect } from 'react';
import { DehydratedState, Hydrate } from 'react-query';

import '../styles/globals.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface AppPropsWithLayout extends ExtendedAppProps<extendAppProps> {
  Component: NextPageWithLayout<extendAppProps>;
}

interface extendAppProps {
  dehydratedState: DehydratedState;
  query: any;
}

type ExtendedAppProps<P = {}> = AppProps<P>;

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  useEffect(() => {
    useCustomize.getState().setCustomize(pageProps.query);
    useServerQuery.getState().setQueries(pageProps.query);
  }, [pageProps.query]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <Provider>
        <Hydrate state={pageProps.dehydratedState}>{getLayout(<Component {...pageProps} />)}</Hydrate>
      </Provider>
    </>
  );
}

export default MyApp;
