import ErrorBoundary from '@/common/components/layouts/errorBoundary';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import { useNetworkStatus } from '@/common/hooks/useNetworkStatus';
import useServerQuery from '@/common/hooks/useServerQuery';
import Provider from '@/components/layouts/provider';
import ServiceWorkerOptimizer from '@/common/components/serviceWorkerOptimizer';
import LazyGoogleTagManager from '@/common/components/lazyGoogleTagManager';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';
import { PlasmicRootProvider } from '@plasmicapp/react-web';
import { Hydrate } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import type { AppProps as NextAppProps, NextWebVitalsMetric } from 'next/app';
import getConfig from 'next/config';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from 'react';
import 'react-photo-view/dist/react-photo-view.css';
import '../styles/globals.css';
import '../styles/nprogress.css';
import GlobalContextsProvider from '../../.plasmic/plasmic/paziresh_24/PlasmicGlobalContextsProvider';

const { publicRuntimeConfig } = getConfig();

const isEnabledGrowthbook = !!publicRuntimeConfig.GROWTHBOOK_API_HOST && !!publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY;

export const growthbook = new GrowthBook({
  enabled: isEnabledGrowthbook,
  apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
  clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
  backgroundSync: true,
  realtimeInterval: 10000,
});

function updateGrowthBookURL() {
  growthbook.setURL(window.location.href);
}

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
  useNetworkStatus();
  const isApplication = useApplication();
  const { asPath } = useRouter();

  useEffect(() => {
    if (isEnabledGrowthbook) {
      const timer = setTimeout(() => {
        growthbook.loadFeatures({ autoRefresh: true, skipCache: router.query.skipFlagsCache === 'true' });
        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          id: getCookie('terminal_id'),
        });
        router.events.on('routeChangeComplete', updateGrowthBookURL);
      }, 100);

      return () => {
        clearTimeout(timer);
        if (growthbook.ready) router.events.off('routeChangeComplete', updateGrowthBookURL);
      };
    }
  }, [router.query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        url: location.href,
        host: location.host,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [asPath]);

  useEffect(() => {
    useCustomize.getState().setCustomize(pageProps?.themeConfing);
    useServerQuery.getState().setQueries(pageProps?.query);
  }, [pageProps?.query, pageProps?.themeConfing]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);
  return (
    <ErrorBoundary>
      <GrowthBookProvider growthbook={growthbook}>
        <Provider pageProps={pageProps}>
          <GlobalContextsProvider>
            <PlasmicRootProvider disableLoadingBoundary>
              <NextNProgress height={2} color="#3861fb" options={{ showSpinner: false, minimum: 0.3 }} />
              <Head>
                <meta
                  name="viewport"
                  content={`viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=${
                    isApplication ? '1.0' : '5.0'
                  }`}
                />
              </Head>
              <Hydrate state={pageProps.dehydratedState}>{getLayout(<Component {...pageProps} />, router)}</Hydrate>
              {typeof window !== 'undefined' && <LazyGoogleTagManager />}
              <ServiceWorkerOptimizer delay={10000} />
            </PlasmicRootProvider>
          </GlobalContextsProvider>
        </Provider>
      </GrowthBookProvider>
    </ErrorBoundary>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'custom' || !publicRuntimeConfig.IS_PRODUCTION) return;
}

export default MyApp;
