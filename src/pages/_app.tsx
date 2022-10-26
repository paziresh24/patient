import Provider from '@/components/layouts/provider';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
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
}

type ExtendedAppProps<P = {}> = AppProps<P>;

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);
  return (
    <Provider>
      <Hydrate state={pageProps.dehydratedState}>{getLayout(<Component {...pageProps} />)}</Hydrate>
    </Provider>
  );
}

export default MyApp;
