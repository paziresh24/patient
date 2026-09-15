import { useActiveWidgetAppKeys } from '@/modules/hamdast/apis/widgets';

export const useInstalledAppKeys = (
  userId?: string | number,
  options?: { enabled?: boolean },
) => {
  const enabled = !!userId && (options?.enabled ?? true);
  const { activeAppKeys: installedKeys, refetch: refreshInstalledState } = useActiveWidgetAppKeys(userId, {
    enabled,
  });

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
