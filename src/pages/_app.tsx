import useCustomize from '@/common/hooks/useCustomize';
import useServerQuery from '@/common/hooks/useServerQuery';
import Provider from '@/components/layouts/provider';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import NextNProgress from 'nextjs-progressbar';
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
  config: any;
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
      <NextNProgress height={3} color="#3861fb" options={{ showSpinner: false }} />

      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Provider>
        <Hydrate state={pageProps.dehydratedState}>
          {getLayout(
            <Component {...pageProps} config={{ showHeader: !pageProps.query?.application, showFooter: !pageProps.query?.application }} />,
          )}
        </Hydrate>
      </Provider>
    </>
  );
}

export default MyApp;
