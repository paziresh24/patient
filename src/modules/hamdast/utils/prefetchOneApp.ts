import { oneApp } from '@/modules/dashboard/apis/one-app';
import { constructUrlWithQuery, replaceKeysInString } from 'src/pages/_/[app_key]/[...params]';
import { QueryClient } from '@tanstack/react-query';

export type OneAppParams = { appKey: string; pageKey: string };

export const getOneAppQueryKey = (params: OneAppParams) => ['app', params] as const;

const ONE_APP_STALE_TIME_MS = 5 * 60 * 1000;

export const getPageFromOneAppData = (appData: unknown, pageKey: string, routeParamCount = 0) => {
  const app = appData as {
    fragments?: Array<{
      type?: string;
      options?: Array<{ key?: string; parameters?: string[]; embed_src?: string }>;
    }>;
  };
  return (
    app?.fragments
      ?.find(item => item.type === 'pages')
      ?.options?.find(
        item => item.key == pageKey && (item.parameters?.length ?? 0) === routeParamCount,
      ) ?? null
  );
};

export const buildHamdastEmbedUrl = ({
  appData,
  pageKey,
  routeParams,
  queries,
  userId,
}: {
  appData: unknown;
  pageKey: string;
  routeParams: string[];
  queries?: Record<string, string>;
  userId?: string | number;
}) => {
  const routeParamCount = Math.max(0, routeParams.length - 1);
  const page = getPageFromOneAppData(appData, pageKey, routeParamCount);
  if (!page?.embed_src) return null;

  const replaced = replaceKeysInString(page.embed_src, page.parameters ?? [], routeParams.slice(1));
  return constructUrlWithQuery(replaced, {
    ...queries,
    user_id: userId,
    hamdast_embedded: true,
  });
};

const preconnectEmbedOrigin = (embedSrcTemplate: string) => {
  if (typeof document === 'undefined') return;

  try {
    const normalized = embedSrcTemplate.replace(/\{\{.*?\}\}/g, '0');
    const origin = new URL(normalized, 'https://hamdast.paziresh24.com').origin;
    if (document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    document.head.appendChild(link);
  } catch {
    // Ignore invalid embed URLs during prefetch.
  }
};

export const prefetchOneApp = async (queryClient: QueryClient, params: OneAppParams, routeParamCount = 0) => {
  if (!params.appKey || !params.pageKey) return null;

  try {
    const response = await queryClient.fetchQuery({
      queryKey: getOneAppQueryKey(params),
      queryFn: () => oneApp(params),
      staleTime: ONE_APP_STALE_TIME_MS,
    });

    const page = getPageFromOneAppData(response?.data, params.pageKey, routeParamCount);
    if (page?.embed_src) {
      preconnectEmbedOrigin(page.embed_src);
    }

    return response?.data ?? null;
  } catch {
    return null;
  }
};

export const prefetchOneApps = (
  queryClient: QueryClient,
  entries: Array<OneAppParams & { routeParamCount?: number }>,
) => {
  entries.forEach(({ appKey, pageKey, routeParamCount = 0 }) => {
    void prefetchOneApp(queryClient, { appKey, pageKey }, routeParamCount);
  });
};

export { ONE_APP_STALE_TIME_MS };
