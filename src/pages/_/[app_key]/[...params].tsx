/* eslint-disable jsx-a11y/alt-text */
import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { oneApp, useOneApp } from '@/modules/dashboard/apis/one-app';
import { HamdastAuth } from '@/modules/hamdast/components/auth';
import { HamdastPayment } from '@/modules/hamdast/components/payment';
import { Report } from '@/modules/hamdast/components/report';
import { HamdastWidget } from '@/modules/hamdast/components/widget';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import RadioFilter from '@/modules/search/components/filters/advancedSearch/sections/radio';
import { isEmpty } from 'lodash';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';
import HamdastLanding from '.plasmic/HamdastLanding';
import Logo from '@/common/components/atom/logo';
import ChevronIcon from '@/common/components/icons/chevron';

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
  } = useRouter();
  const iframeRef = useRef<any>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const [showApp, setShowApp] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

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
    setTimeout(() => {
      setIsAppLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    if (showTranslation && page?.layout?.show_landing) {
      setTimeout(() => {
        setShowApp(true);
        setShowTranslation(false);
      }, 2500);
    }
  }, [showTranslation, page?.layout?.show_landing]);
  useEffect(() => {
    if (page?.layout && !page?.layout?.show_landing) {
      setShowApp(true);
    }
  }, [page?.layout?.show_landing]);

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
        <div className="w-full flex-grow flex flex-col gap-5 justify-center items-center">
          <div className="flex items-center gap-5">
            <div className="bg-white rounded-2xl shadow-card w-20 h-20 flex justify-center items-center">
              <Logo type="compact" width={45} />
            </div>
            <ChevronIcon dir="left" className="w-4 h-4 opacity-70 animate-pulse" />
            <div className="bg-white rounded-2xl shadow-card w-20 h-20 flex justify-center items-center">
              <img src={app?.icon} className="w-14 h-14 rounded-xl" />
            </div>
          </div>
          <span className="font-semibold">درحال انتقال به {app?.name?.fa}</span>
        </div>
      )}
      {!showApp && !showTranslation && page?.layout?.show_landing && (
        <GlobalContextsProvider>
          <HamdastLanding appKey={app?.key} onClick={() => setShowTranslation(true)} />
        </GlobalContextsProvider>
      )}
      <HamdastPayment app_key={app?.key} iframeRef={iframeRef} />
      <HamdastAuth app_key={app?.key} iframeRef={iframeRef} />
      <HamdastWidget app_name={app.name?.fa} app_id={app?.id} iframeRef={iframeRef} />
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
