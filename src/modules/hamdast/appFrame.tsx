import Loading from '@/common/components/atom/loading';
import AppBar from '@/common/components/layouts/appBar';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import classNames from '@/common/utils/classNames';
import { useOneApp } from '@/modules/dashboard/apis/one-app';
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
import HamdastLanding from '.plasmic/HamdastLanding';
import Logo from '@/common/components/atom/logo';
import { constructUrlWithQuery, replaceKeysInString } from 'src/pages/_/[app_key]/[...params]';

export const AppFrame = ({
  appKey,
  params,
  queries,
  showBackButton,
}: {
  appKey: string;
  params: string[];
  queries?: any;
  showBackButton?: boolean;
}) => {
  const getOneApp = useOneApp({ appKey: appKey, pageKey: params?.[0] as string });
  const [app, setApp] = useState<any>({});
  const [page, setPage] = useState<any>({});

  useEffect(() => {
    if (getOneApp?.data?.data && getOneApp.isSuccess) {
      const app = getOneApp?.data?.data;
      const page = app?.fragments
        ?.find((item: any) => item.type === 'pages')
        ?.options?.find((item: any) => item.key == params?.[0] && (item.parameters?.length ?? 0) == (params?.length ?? 1) - 1);

      if (page?.layout && !page?.layout?.show_landing) {
        setShowApp(true);
      }
      setApp(app);
      setPage(page);
    }
  }, [getOneApp?.data?.data, getOneApp.isSuccess]);

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
  }, [isLogin, userPending, page]);

  useEffect(() => {
    getOneApp.refetch();
    setTimeout(() => {
      setIsAppLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    if (showTranslation && page?.layout?.show_landing) {
      setTimeout(() => {
        setShowApp(true);
        setShowTranslation(false);
      }, 3000);
    }
  }, [showTranslation, page?.layout?.show_landing]);

  return (
    <div className="flex flex-col h-full w-full">
      <AppBar
        title={page?.name?.fa}
        backButton={showBackButton}
        titleLoading={!page?.name}
        actionButton={<Report app_key={appKey as string} page_key={page?.key} />}
      />
      {app?.id && (
        <>
          <HamdastPayment app_key={appKey} iframeRef={iframeRef} />
          <HamdastAuth app_key={appKey} iframeRef={iframeRef} />
          <HamdastWidget app_name={app.name?.fa} app_id={app?.id} iframeRef={iframeRef} />

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
                  <img src={app?.icon} className="w-10 h-10 rounded-xl" alt="" />
                </div>
              </div>
              <span className="text-sm">
                درحال انتقال از <span className="font-bold">پذیرش۲۴ به {app?.name?.fa}</span>
              </span>
            </div>
          )}
          {!showApp && app?.key && !showTranslation && page?.layout?.show_landing && (
            <div className="w-full flex-grow bg-white flex flex-col gap-5 justify-center items-center">
              <GlobalContextsProvider>
                <HamdastLanding appKey={app?.key} onClick={() => setShowTranslation(true)} mobileView />
              </GlobalContextsProvider>
            </div>
          )}
        </>
      )}

      {(!showIframe || isAppLoading || !app?.key) && !page?.layout?.show_landing && (
        <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
          <Loading />
        </div>
      )}
      <div className={classNames('w-full flex-grow flex flex-col', { hidden: !showApp })}>
        {showIframe && embedSrc && (
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
    </div>
  );
};
