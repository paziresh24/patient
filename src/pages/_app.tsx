import "../../.plasmic/plasmic/fragment_design_system/plasmic.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import "../../.plasmic/plasmic/paziresh_24_design_system/plasmic.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import "../../.plasmic/plasmic/ravi_design_system/plasmic.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import "../../.plasmic/plasmic/paziresh_24_search/plasmic.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import "../../.plasmic/plasmic/paziresh_24_booking/plasmic.css"; // plasmic-import: 8NbkXymcLwvMUC2yXeRrWk/projectcss
import "../../.plasmic/plasmic/launcher/plasmic.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import "../../.plasmic/plasmic/hamdast_cywoc_24/plasmic.css"; // plasmic-import: fc2TT88raN5pz7nywm4q4q/projectcss
import "../../.plasmic/plasmic/paziresh_24_profile/plasmic.css"; // plasmic-import: 7r312uiqyadpVPdnRoAggk/projectcss
import "../../.plasmic/plasmic/ravi_r_r/plasmic.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import "../../.plasmic/plasmic/hamdast_bimehnama/plasmic.css"; // plasmic-import: k6ZwKcaHfkxemp7yqC1vbY/projectcss
import "../../.plasmic/plasmic/paziresh_24/plasmic.css"; // plasmic-import: iDYgiKJB9Yi7CUB81stQBK/projectcss
import "../../.plasmic/plasmic/hamdast_risman/plasmic.css"; // plasmic-import: bN5uNsAhTefwW3S14VjvMG/projectcss
import "../../.plasmic/plasmic/paziresh_24_factor/plasmic.css"; // plasmic-import: 85GFtqPAFvUkDYJxzFDEYS/projectcss
import "../../.plasmic/plasmic/hamdast_hamyar/plasmic.css"; // plasmic-import: g8Bqu3xcbG5xgWev5sVtns/projectcss
import "../../.plasmic/plasmic/hamdast_cheragh/plasmic.css"; // plasmic-import: 4fjEYDyHsDvAphaYRHZchB/projectcss
import "../../.plasmic/plasmic/hamdast_rahnama/plasmic.css"; // plasmic-import: 5MMYVxpXKV5JuJRaJPvqek/projectcss
import "../../.plasmic/plasmic/hamdast_khedmat/plasmic.css"; // plasmic-import: 666TdydnqTmUJpihDvjWrt/projectcss
import ErrorBoundary from "@/common/components/layouts/errorBoundary";
import useApplication from "@/common/hooks/useApplication";
import useCustomize from "@/common/hooks/useCustomize";
import { useNetworkStatus } from "@/common/hooks/useNetworkStatus";
import useServerQuery from "@/common/hooks/useServerQuery";
import { splunkInstance } from "@/common/services/splunk";
import Provider from "@/components/layouts/provider";
import "@/firebase/analytics";
import { GrowthBook, GrowthBookProvider, configureCache } from "@growthbook/growthbook-react";
import { PlasmicRootProvider } from "@plasmicapp/react-web";
import { Hydrate } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import type { AppProps as NextAppProps, NextWebVitalsMetric } from "next/app";
import getConfig from "next/config";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import "react-photo-view/dist/react-photo-view.css";
import "../styles/globals.css";
import "../styles/nprogress.css";
import GlobalContextsProvider from "../../.plasmic/plasmic/paziresh_24/PlasmicGlobalContextsProvider";
import { useUserInfoStore } from "@/modules/login/store/userInfo";
import axios from "axios";
import RouteProgress from "@/common/components/layouts/RouteProgress";
import { RismanSurveyScript } from "@/common/components/layouts/RismanSurveyScript";
import { RoutedExternalScripts } from "@/common/components/layouts/RoutedExternalScripts";
import { useNotificationPermission } from "@/common/hooks/useNotificationPermission";
const { publicRuntimeConfig } = getConfig();
const isEnabledGrowthbook =
  !!publicRuntimeConfig.GROWTHBOOK_API_HOST &&
  !!publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY;

if (isEnabledGrowthbook) {
  configureCache({
    staleTTL: 30 * 1000,
  });
}

export const growthbook = new GrowthBook({
  enabled: isEnabledGrowthbook,
  apiHost: publicRuntimeConfig.GROWTHBOOK_API_HOST,
  clientKey: publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY,
  backgroundSync: true,
  realtimeInterval: 10000
});
function updateGrowthBookURL() {
  growthbook.setURL(window.location.href);
}
type withQueryProps = {
  query: NextParsedUrlQuery;
};
type AppProps = Omit<
  NextAppProps<withQueryProps & Record<string, unknown>>,
  "Component"
> & {
  Component: NextAppProps["Component"] & {
    getLayout?: (
      page: React.ReactElement,
      router: NextRouter
    ) => React.ReactNode;
  };
};
function MyApp(props: AppProps) {
  const { Component, pageProps, router } = props;
  useNetworkStatus();
  const isApplication = useApplication();
  const { asPath } = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const user = useUserInfoStore(state => state.info);
  const [isGtmReady, setIsGtmReady] = useState(false);
  const gtmEnabledRef = useRef(false);
  const gtmId = "GTM-P5RPLDP";
  const isGtmDisabled =
    String(publicRuntimeConfig.DESABLED_GTM).toLowerCase() === "true";
  useEffect(() => {
    if (isEnabledGrowthbook) {
      growthbook.loadFeatures({
        autoRefresh: true,
        skipCache: router.query.skipFlagsCache === "true"
      });
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        id: getCookie("terminal_id")
      });
      router.events.on("routeChangeComplete", updateGrowthBookURL);
    }
    return () => {
      if (growthbook.ready)
        router.events.off("routeChangeComplete", updateGrowthBookURL);
    };
  }, [router.query]);
  useEffect(() => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      url: location.href,
      host: location.host,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  }, [asPath]);
  useEffect(() => {
    useCustomize.getState().setCustomize(pageProps?.themeConfing);
    useServerQuery.getState().setQueries(pageProps?.query);
  }, [pageProps?.query, pageProps?.themeConfing]);
  useEffect(() => {
    if (
      isLogin &&
      (isApplication ||
        ("Notification" in window && Notification?.permission === "granted"))
    ) {
      window.najvaUserSubscribed = function (najva_user_token: string) {
        axios.post(
          `${publicRuntimeConfig.API_GATEWAY_BASE_URL}/v1/notification/subscribers`,
          {
            user_id: user.id,
            subscriber_token: najva_user_token
          }
        );
      };
    }
  }, [isLogin, isApplication]);

  // Auto-subscribe نوتیفیکشن در صورت login و وجود دسترسی
  useNotificationPermission({
    autoSubscribe: isLogin // فقط وقتی login است auto-subscribe کند
  });
  useEffect(() => {
    if (isGtmDisabled || gtmEnabledRef.current) return;
    const isDoctorPage =
      router.pathname === "/dr/[slug]" || router.asPath.startsWith("/dr/");
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: any;
    const enable = () => {
      if (gtmEnabledRef.current) return;
      gtmEnabledRef.current = true;
      setIsGtmReady(true);
    };
    const onInteract = () => enable();
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId && typeof (window as any).cancelIdleCallback === "function")
        (window as any).cancelIdleCallback(idleId);
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("mousemove", onInteract);
    };
    if (isDoctorPage) {
      window.addEventListener("pointerdown", onInteract, {
        passive: true,
        once: true
      });
      window.addEventListener("keydown", onInteract, {
        passive: true,
        once: true
      });
      window.addEventListener("touchstart", onInteract, {
        passive: true,
        once: true
      });
      window.addEventListener("scroll", onInteract, {
        passive: true,
        once: true
      });
      window.addEventListener("mousemove", onInteract, {
        passive: true,
        once: true
      });
      timeoutId = setTimeout(enable, 10000);
    } else {
      const ric = (window as any).requestIdleCallback as
        | undefined
        | ((
            cb: () => void,
            opts?: {
              timeout: number;
            }
          ) => any);
      if (typeof ric === "function")
        idleId = ric(enable, {
          timeout: 2000
        });
      else timeoutId = setTimeout(enable, 1500);
    }
    return cleanup;
  }, [router.pathname, router.asPath, isGtmDisabled]);
  const getLayout = Component.getLayout ?? (page => page);
  return (
    <ErrorBoundary>
      <GrowthBookProvider growthbook={growthbook}>
        <Provider pageProps={pageProps}>
          <GlobalContextsProvider>
            <PlasmicRootProvider disableLoadingBoundary>
              <RouteProgress
                height={2}
                color="#3861fb"
                showSpinner={false}
                minimum={0.3}
              />
              <Head>
                <meta
                  name="viewport"
                  content={`viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=${isApplication ? "1.0" : "5.0"}`}
                />
              </Head>
              <Hydrate state={pageProps.dehydratedState}>
                {getLayout(<Component {...pageProps} />, router)}
              </Hydrate>
              {!isGtmDisabled && isGtmReady && (
                <Script
                  id="gtm-script"
                  strategy="afterInteractive"
                  dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`
                  }}
                />
              )}
              <RismanSurveyScript />
              <RoutedExternalScripts />
            </PlasmicRootProvider>
          </GlobalContextsProvider>
        </Provider>
      </GrowthBookProvider>
    </ErrorBoundary>
  );
}
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === "custom" || !publicRuntimeConfig.IS_PRODUCTION) return;
}
export default MyApp;
