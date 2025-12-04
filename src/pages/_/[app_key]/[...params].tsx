/* eslint-disable jsx-a11y/alt-text */
import Loading from '@/common/components/atom/loading';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import classNames from '@/common/utils/classNames';
import { oneApp } from '@/modules/dashboard/apis/one-app';
import { HamdastAuth } from '@/modules/hamdast/components/auth';
import { HamdastPayment } from '@/modules/hamdast/components/payment';
import { Report } from '@/modules/hamdast/components/report';
import { HamdastWidget } from '@/modules/hamdast/components/widget';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { isEmpty } from 'lodash';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';
import LauncherProfile from '.plasmic/LauncherProfile';
import Logo from '@/common/components/atom/logo';
import { splunkInstance } from '@/common/services/splunk';
import Permissions from '@/modules/hamdast/components/permissions';
import { HamdastSubscriptionPayment, HamdastSubscriptionPaymentRef } from '@/modules/hamdast/components/subscription-payment';

export function replaceKeysInString(template: string, keys: string[], values: string[]) {
  // Create a regular expression to find placeholders like {{key}}
  const regex = /{{(.*?)}}/g;

  // Replace placeholders with corresponding values from the values array
  return template.replace(regex, (match, key) => {
    // Find the index of the key in the keys array
    const index = keys.indexOf(key);

    // Return the value from values array if index is found, else return the original match
    return index !== -1 ? values[index] : match;
  });
}
export function constructUrlWithQuery(template: string, queryParams: any) {
  const [_, queryPart] = template.split('?');

  if (isEmpty(queryParams)) return template;

  const queryString = new URLSearchParams(queryParams).toString();
  if (queryPart) {
    const existingQueryParams = new URLSearchParams(queryPart);
    for (const [key, value] of Object.entries<string>(queryParams)) {
      existingQueryParams.set(key, value);
    }
    return `${_}?${existingQueryParams.toString()}`;
  }

  return queryString ? `${_}?${queryString}` : template;
}
const Page = ({ page, app }: any) => {
  const {
    asPath,
    query: { app_key, params, ...queries },
    ...router
  } = useRouter();

  const iframeRef = useRef<any>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const [showApp, setShowApp] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const subscriptionPaymentRef = useRef<HamdastSubscriptionPaymentRef>(null);

  const embedSrc = useMemo(() => {
    const replaceParameters = page?.embed_src ? replaceKeysInString(page?.embed_src, page?.parameters, params?.slice(1) as string[]) : '';
    return page?.embed_src ? constructUrlWithQuery(replaceParameters, queries) : null;
  }, [page, params, queries]);

  const showIframe = page?.is_protected_route ? !!user.id : true;

  useEffect(() => {
    if (!userPending && !isLogin && page?.is_protected_route) {
      handleOpenLoginModal({
        state: true,
        closable: false,
        description: `برای نمایش ${page.name?.fa} لازم است وارد شوید.`,
      });
    }

    return () => {
      handleOpenLoginModal({
        state: false,
      });
    };
  }, [isLogin, userPending]);

  useEffect(() => {
    if (app?.key && page?.key && !userPending) {
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast-insight',
        type: 'pages',
        data: {
          app_key: app?.key,
          page_key: page?.key,
          user_id: user.id,
        },
      });
    }
  }, [app?.key, page?.key, user?.id, userPending]);

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    if (showTranslation) {
      setTimeout(() => {
        setShowApp(true);
        setShowTranslation(false);
      }, 3000);
    }
  }, [showTranslation]);

  useEffect(() => {
    if (params?.[0] != 'launcher') {
      setShowApp(true);
    }
  }, [params?.[0]]);

  return (
    <LayoutWithHeaderAndFooter
      showSearchSuggestionButton={false}
      shouldShowPromoteApp={false}
      showHeader={page?.layout?.show_header ?? false}
      showFooter={page?.layout?.show_footer ?? false}
      showBottomNavigation={page?.layout?.show_bottom_navigation ?? false}
      className="!h-svh !min-h-svh !max-h-svh:"
    >
      {page?.layout?.show_appbar && (
        <AppBar title={page.name?.fa} backButton={true} actionButton={<Report app_key={app_key as string} page_key={page?.key} />} />
      )}
      <Seo title={page.name?.fa} noIndex />
      {showTranslation && (
        <div className="w-full flex-grow bg-white flex flex-col gap-5 justify-center items-center">
          <div className="flex items-center gap-5">
            <div className="bg-white rounded-xl shadow-card w-16 h-16 flex justify-center items-center">
              <Logo type="compact" width={40} />
            </div>
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary">
              <polyline
                points="60,20 30,50 60,80"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                stroke-linecap="round"
                stroke-linejoin="round"
                opacity="0"
              >
                <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="translate"
                  from="0 0"
                  to="-10 0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </polyline>
            </svg>

            <div className="bg-white rounded-xl shadow-card w-16 h-16 flex justify-center items-center">
              <img src={app?.icon} className="w-10 h-10 rounded-xl" />
            </div>
          </div>
          <span className="text-sm">
            درحال انتقال از <span className="font-bold">پذیرش۲۴ به {app?.name?.fa}</span>
          </span>
        </div>
      )}
      {!showApp && !showTranslation && params?.[0] == 'launcher' && (
        <div className="w-full flex-grow bg-[#f4f5f8] flex flex-col gap-5 pb-16 justify-center items-center overflow-x-auto">
          <GlobalContextsProvider>
            <LauncherProfile
              appKey={app?.key}
              onClick={() => setShowTranslation(true)}
              onSubscribe={async planKey => {
                const result = await subscriptionPaymentRef.current?.open(planKey);
                if (result?.success) {
                  setShowTranslation(true);
                }
              }}
            />
          </GlobalContextsProvider>
        </div>
      )}
      <HamdastPayment app_key={app?.key} iframeRef={iframeRef} />
      <HamdastAuth app_key={app?.key} iframeRef={iframeRef} />
      <HamdastWidget app_name={app.name?.fa} app_id={app?.id} iframeRef={iframeRef} />
      <HamdastSubscriptionPayment ref={subscriptionPaymentRef} app_key={app?.key} app_name={app.display_name?.fa} iframeRef={iframeRef} />
      {page?.key == 'launcher' && <Permissions onClose={() => router.back()} />}

      <div className={classNames('w-full flex-grow flex flex-col', { '!hidden !opacity-0': !showApp })}>
        {(!showIframe || isAppLoading) && (
          <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
            <Loading />
          </div>
        )}
        {showIframe && (
          <iframe
            ref={iframeRef}
            onLoad={() => setIsAppLoading(false)}
            className={classNames('w-full flex-grow h-full', { hidden: isAppLoading })}
            src={`https://hamdast.paziresh24.com/bridge/?app=${app?.id}&page=${page?.id}&user_id=${user.id}&src=${encodeURIComponent(
              embedSrc!,
            )}`}
          />
        )}
      </div>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    const { app_key, params, ...query } = context.query;

    const getOneApp = await oneApp({ appKey: app_key as string, pageKey: params?.[0] as string });

    const app = getOneApp?.data;
    const page = app?.fragments
      ?.find((item: any) => item.type === 'pages')
      ?.options?.find((item: any) => item.key == params?.[0] && (item.parameters?.length ?? 0) == (params?.length ?? 1) - 1);

    return {
      props: {
        app,
        page,
      },
    };
  },
);

export default Page;
