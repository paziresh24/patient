import { useGetMyApps } from '@/modules/hamdast/apis/myapps';
import { useActiveWidgetAppKeys } from '@/modules/hamdast/apis/widgets';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

type MyAppItem = { app_key?: string };

const mergeAppKeys = (keys: Set<string>, items?: MyAppItem[]) => {
  for (const item of items ?? []) {
    if (item.app_key) keys.add(item.app_key);
  }
};

export const useInstalledAppKeys = (userId?: string | number) => {
  const queryClient = useQueryClient();
  const enabled = !!userId;

  const { data: profileAddons } = useGetMyApps({ type: 'profile_addons' }, { enabled });
  const { data: addons } = useGetMyApps({ type: 'addons' }, { enabled });
  const { activeAppKeys: widgetActiveKeys, refetch: refetchWidgets } = useActiveWidgetAppKeys(userId, { enabled });

  const installedKeys = useMemo(() => {
    const keys = new Set<string>(widgetActiveKeys);
    mergeAppKeys(keys, profileAddons?.data as MyAppItem[] | undefined);
    mergeAppKeys(keys, addons?.data as MyAppItem[] | undefined);
    return keys;
  }, [widgetActiveKeys, profileAddons?.data, addons?.data]);

  const refreshInstalledState = () => {
    void refetchWidgets();
    void queryClient.invalidateQueries({ queryKey: ['getMyApps'] });
  };

  return { installedKeys, refreshInstalledState };
};

export const isAppInstalled = (installedKeys: Set<string>, appKey: string) => installedKeys.has(appKey);

export const getWidgetActionLabel = (
  isActive: boolean,
  options?: { soon?: boolean; social?: boolean },
) => {
  if (options?.soon) return 'مشاهده';
  if (options?.social) return isActive ? 'مدیریت' : 'پیوستن';
  return isActive ? 'مدیریت' : 'فعال‌سازی';
};
