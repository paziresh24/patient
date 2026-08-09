import { hamdastClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export interface Params {
  user_id: string;
}

export interface HamdastUserWidget {
  id?: string | number;
  app?: string;
  placement?: string | string[];
  data_endpoint?: string;
  placements_metadata?: Record<string, unknown>;
}

export const getWidgets = ({ user_id }: Params) => {
  return hamdastClient.get<HamdastUserWidget[]>('/api/v1/widgets/', {
    params: { user_id },
  });
};

export const useGetWidgets = (data: Params, options?: Record<string, unknown>) => {
  return useQuery(['getWidgets', data], () => getWidgets(data), options);
};

export const getActiveWidgetAppKeys = (widgets?: HamdastUserWidget[] | null) => {
  const keys = new Set<string>();
  if (!Array.isArray(widgets)) return keys;

  for (const widget of widgets) {
    if (widget.app) keys.add(widget.app);
  }

  return keys;
};

export const useActiveWidgetAppKeys = (userId?: string | number, options?: { enabled?: boolean }) => {
  const widgetsQuery = useGetWidgets(
    { user_id: String(userId) },
    {
      enabled: !!userId && (options?.enabled ?? true),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  );

  const activeAppKeys = useMemo(
    () => getActiveWidgetAppKeys(widgetsQuery.data?.data),
    [widgetsQuery.data?.data],
  );

  return {
    activeAppKeys,
    isLoading: widgetsQuery.isLoading,
    refetch: widgetsQuery.refetch,
  };
};
