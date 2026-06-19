import { VardastWorkflowAppPopupAction } from '@/modules/hami/apis/parseVardastActions';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import { QueryClient } from '@tanstack/react-query';

const VARDAST_ACTION_PAGE_KEY = 'flows';
const VARDAST_ACTION_ROUTE_PARAM_COUNT = 1;

export const prefetchVardastActionEmbed = (
  queryClient: QueryClient,
  action: VardastWorkflowAppPopupAction,
) => {
  if (!action.app_key) return;

  void prefetchOneApp(queryClient, { appKey: action.app_key, pageKey: VARDAST_ACTION_PAGE_KEY }, VARDAST_ACTION_ROUTE_PARAM_COUNT);
};

export const prefetchVardastActionEmbeds = (
  queryClient: QueryClient,
  actions: VardastWorkflowAppPopupAction[],
) => {
  const seen = new Set<string>();

  actions.forEach(action => {
    if (!action.app_key || seen.has(action.app_key)) return;
    seen.add(action.app_key);
    prefetchVardastActionEmbed(queryClient, action);
  });
};
