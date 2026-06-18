import { useGetWidgets } from '@/modules/hamdast/apis/widgets';

export const hasVardastChatWidget = (widgets?: any[]) =>
  widgets?.some((widget: any) => widget.placement?.includes('vardast::CHAT')) ?? false;

export const useHasVardastChatWidget = (userId?: string | number, enabled = true) => {
  const widgetsQuery = useGetWidgets({ user_id: String(userId) }, { enabled: !!userId && enabled, staleTime: 0 });

  return {
    hasChatWidget: hasVardastChatWidget(widgetsQuery.data?.data),
    isLoading: widgetsQuery.isLoading,
    isFetched: widgetsQuery.isFetched,
  };
};
