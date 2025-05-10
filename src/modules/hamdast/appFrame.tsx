import Loading from '@/common/components/atom/loading';
import { HamdastAuth } from './components/auth';
import { HamdastPayment } from './components/payment';
import { HamdastWidget } from './components/widget';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useUserInfoStore } from '../login/store/userInfo';
import { useLoginModalContext } from '../login/context/loginModal';
import { constructUrlWithQuery, replaceKeysInString } from 'src/pages/_/[app_key]/[...params]';
import classNames from '@/common/utils/classNames';
import { useOneApp } from '../dashboard/apis/one-app';
import AppBar from '@/common/components/layouts/appBar';
import { Report } from './components/report';

export const AppFrame = ({ appKey, params, queries }: { appKey: string; params: string[]; queries?: string[] }) => {
  const getOneApp = useOneApp({ appKey: appKey, pageKey: params?.[0] as string });
  const [app, setApp] = useState<any>({});
  const [page, setPage] = useState<any>({});

  useEffect(() => {
    if (getOneApp?.data?.data && getOneApp.isSuccess) {
      const app = getOneApp?.data?.data;
      const page = app?.fragments
        ?.find((item: any) => item.type === 'pages')
        ?.options?.find((item: any) => item.key == params?.[0] && (item.parameters?.length ?? 0) == (params?.length ?? 1) - 1);

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

  const embedSrc = useMemo(() => {
    console.log(page);

    const replaceParameters = page?.embed_src ? replaceKeysInString(page?.embed_src, page?.parameters, params?.slice(1) as string[]) : '';
    return page?.embed_src ? constructUrlWithQuery(replaceParameters, queries) : null;
  }, [page, params, queries]);

  console.log(embedSrc);

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
    setTimeout(() => {
      setIsAppLoading(false);
    }, 6000);
  }, []);

  console.log(showIframe);

  return (
    <div className="flex flex-col h-full w-full">
      <AppBar
        title={page.name?.fa}
        backButton={false}
        titleLoading={!page?.name}
        actionButton={<Report app_key={appKey as string} page_key={page?.key} />}
      />
      <HamdastPayment app_key={app?.key} iframeRef={iframeRef} />
      <HamdastAuth app_key={app?.key} iframeRef={iframeRef} />
      <HamdastWidget app_name={app.name?.fa} app_id={app?.id} iframeRef={iframeRef} />
      <div className="w-full flex-grow flex flex-col">
        {(!showIframe || isAppLoading) && !embedSrc && (
          <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
            <Loading />
          </div>
        )}
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
