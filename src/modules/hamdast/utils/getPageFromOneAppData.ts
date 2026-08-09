export type OneAppPageOption = {
  key?: string;
  parameters?: string[];
  embed_src?: string;
  name?: { fa?: string; en?: string };
  layout?: Record<string, unknown>;
  is_protected_route?: boolean;
  id?: string;
};

/** PocketBase page.parameters stores route segment values (e.g. ['CHAT']), not placeholder names. */
export const pageParametersMatch = (pageParameters: string[] | undefined, routeParamValues: string[]) => {
  const params = pageParameters ?? [];
  if (params.length !== routeParamValues.length) return false;
  return params.every((param, index) => param === routeParamValues[index]);
};

export const getPageFromOneAppData = (
  appData: unknown,
  pageKey: string,
  routeParamValues: string[] = [],
): OneAppPageOption | null => {
  const app = appData as {
    fragments?: Array<{
      type?: string;
      options?: OneAppPageOption[];
    }>;
  };
  return (
    app?.fragments
      ?.find(item => item.type === 'pages')
      ?.options?.find(item => item.key == pageKey && pageParametersMatch(item.parameters, routeParamValues)) ?? null
  );
};
