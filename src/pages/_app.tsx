import useCustomize from '@/common/hooks/useCustomize';
import useServerQuery from '@/common/hooks/useServerQuery';
import { splunkInstance } from '@/common/services/splunk';
import Provider from '@/components/layouts/provider';
import localFont from '@next/font/local';
import { Hydrate } from '@tanstack/react-query';
// @ts-ignore
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import type { AppProps as NextAppProps, NextWebVitalsMetric } from 'next/app';
import getConfig from 'next/config';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import Head from 'next/head';
import { NextRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import '../styles/globals.css';

const iransansFont = localFont({
  src: '../fonts/IRANSansXV.woff2',
  variable: '--font-iran-sans',
  preload: true,
  display: 'swap',
});

const { publicRuntimeConfig } = getConfig();

const growthbook = new GrowthBook({
  apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
  clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
  trackingCallback: (experiment: any, result: any) => {
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

type withQueryProps = {
  query: NextParsedUrlQuery;
};

type AppProps = Omit<NextAppProps<withQueryProps & Record<string, unknown>>, 'Component'> & {
  Component: NextAppProps['Component'] & {
    getLayout?: (page: React.ReactElement, router: NextRouter) => React.ReactNode;
  };
};

function MyApp(props: AppProps) {
  const { Component, pageProps, router } = props;

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

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);
  return (
    <Provider pageProps={pageProps}>
      <style jsx global>{`
        :root {
          --font-iran-sans: ${iransansFont.style.fontFamily};
        }
      `}</style>
      <NextNProgress height={3} color="#3861fb" options={{ showSpinner: false }} />
      <Head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <GrowthBookProvider growthbook={growthbook}>
        <Hydrate state={pageProps.dehydratedState}>
          {getLayout(
            <Component {...pageProps} config={{ showHeader: !pageProps.query?.application, showFooter: !pageProps.query?.application }} />,
            router,
          )}
        </Hydrate>
      </GrowthBookProvider>
    </Provider>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'custom' || !publicRuntimeConfig.IS_PRODUCTION) return;

  const body = JSON.stringify({
    ...metric,
    attribution: {
      ...metric.attribution,
      userAgent: window.navigator.userAgent,
      url: window.location.pathname,
    },
  });
  const url = '/patient/api/webvitals/';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

export default MyApp;
