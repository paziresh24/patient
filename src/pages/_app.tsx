import ErrorBoundary from '@/common/components/layouts/errorBoundary';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import { useNetworkStatus } from '@/common/hooks/useNetworkStatus';
import useServerQuery from '@/common/hooks/useServerQuery';
import { splunkInstance } from '@/common/services/splunk';
import Provider from '@/components/layouts/provider';
import '@/firebase/analytics';
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
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import Script from 'next/script';

const { publicRuntimeConfig } = getConfig();

const isEnabledGrowthbook = !!publicRuntimeConfig.GROWTHBOOK_API_HOST && !!publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY;

export const growthbook = new GrowthBook({
  enabled: isEnabledGrowthbook,
  apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
  clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
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
  const isLogin = useUserInfoStore(state => state.isLogin);
  const user = useUserInfoStore(state => state.info);

  useEffect(() => {
    if (isEnabledGrowthbook) {
      growthbook.loadFeatures({ autoRefresh: true, skipCache: router.query.skipFlagsCache === 'true' });
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        id: getCookie('terminal_id'),
      });
      router.events.on('routeChangeComplete', updateGrowthBookURL);
    }
    return () => {
      if (growthbook.ready) router.events.off('routeChangeComplete', updateGrowthBookURL);
    };
  }, []);

  useEffect(() => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      url: location.href,
      host: location.host,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [asPath]);

  useEffect(() => {
    useCustomize.getState().setCustomize(pageProps.themeConfing);
    useServerQuery.getState().setQueries(pageProps.query);
  }, [pageProps.query, pageProps.themeConfing]);

  useEffect(() => {
    if (isLogin && (isApplication || ('Notification' in window && Notification?.permission === 'granted'))) {
      window.najvaUserSubscribed = function (najva_user_token: string) {
        axios.post('https://hamdast.paziresh24.com/api/v1/notification/subscribers/', {
          user_id: user.id,
          subscriber_token: najva_user_token,
        });
      };
    }
  }, [isLogin, isApplication]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => page);
  return (
    <ErrorBoundary>
      <GrowthBookProvider growthbook={growthbook}>
        <Provider pageProps={pageProps}>
          <GlobalContextsProvider>
            <PlasmicRootProvider disableLoadingBoundary>
              <NextNProgress height={3} color="#3861fb" options={{ showSpinner: false }} transformCSS={() => <></>} />
              {isLogin && (isApplication || ('Notification' in window && Notification?.permission === 'granted')) && (
                <Script id="najva-script">{`(function(){
        var now = new Date();
        var version = now.getFullYear().toString() + "0" + now.getMonth() + "0" + now.getDate() +
            "0" + now.getHours();
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://van.najva.com/static/cdn/css/local-messaging.css" + "?v=" + version;
        head.appendChild(link);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://van.najva.com/static/js/scripts/new-website387894-website-58369-ca07382e-9477-44a1-90a3-1a65b5a0557e.js" + "?v=" + version;
        head.appendChild(script);
        })()`}</Script>
              )}
              <Head>
                <meta
                  name="viewport"
                  content={`viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=${
                    isApplication ? '1.0' : '5.0'
                  }`}
                />
              </Head>
              <Hydrate state={pageProps.dehydratedState}>{getLayout(<Component {...pageProps} />, router)}</Hydrate>
            </PlasmicRootProvider>
          </GlobalContextsProvider>
        </Provider>
      </GrowthBookProvider>
    </ErrorBoundary>
  );
}

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'custom' || !publicRuntimeConfig.IS_PRODUCTION) return;

  // splunkInstance('cwv').sendEvent({
  //   group: 'core_web_vitals',
  //   type: `${metric.label}_${metric.name}`,
  //   event: {
  //     ...metric,
  //   },
  // });
}

export default MyApp;
