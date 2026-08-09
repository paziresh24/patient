import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useHamdastAppListParams } from '../hooks/usePrefetchHamdastLauncherAppLists';

export interface HamdastCatalogCategory {
  key: string;
  title: string;
}

export interface HamdastCatalogApp {
  app_key: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  link?: string;
  badges?: string[];
  functions?: string[];
  category?: HamdastCatalogCategory;
}

export interface CatalogCategoryGroup {
  key: string;
  title: string;
  apps: HamdastCatalogApp[];
}

const UNCATEGORIZED_KEY = 'other';
const UNCATEGORIZED_TITLE = 'سایر ابزارک‌ها';

const appSortRank = (app: HamdastCatalogApp) => {
  if (app.badges?.includes('NEW')) return 0;
  if (app.badges?.includes('SOON')) return 1;
  return 2;
};

export const groupCatalogAppsByCategory = (apps: HamdastCatalogApp[]): CatalogCategoryGroup[] => {
  const groups = new Map<string, CatalogCategoryGroup>();
  const order: string[] = [];

  for (const app of apps) {
    const key = app.category?.key || UNCATEGORIZED_KEY;
    const title = app.category?.title || UNCATEGORIZED_TITLE;

    if (!groups.has(key)) {
      groups.set(key, { key, title, apps: [] });
      order.push(key);
    }

    groups.get(key)!.apps.push(app);
  }

  groups.forEach(group => {
    group.apps.sort((a, b) => {
      const diff = appSortRank(a) - appSortRank(b);
      if (diff !== 0) return diff;
      return (a.title ?? a.app_key).localeCompare(b.title ?? b.app_key, 'fa');
    });
  });

  return order
    .map(key => groups.get(key)!)
    .filter(group => group.apps.length > 0)
    .sort((a, b) => {
      if (a.key === UNCATEGORIZED_KEY) return 1;
      if (b.key === UNCATEGORIZED_KEY) return -1;
      return 0;
    });
};

const HAMDAST_LIST_URL = 'https://hamdast.paziresh24.com/api/v1/list';

export const getHamdastAppCatalog = async (params: Record<string, unknown>) => {
  const { data } = await axios.get<HamdastCatalogApp[]>(HAMDAST_LIST_URL, {
    params,
    withCredentials: true,
  });
  return data ?? [];
};

export const useHamdastAppCatalog = () => {
  const user = useUserInfoStore(state => state.info);
  const params = useHamdastAppListParams();

  return useQuery({
    queryKey: ['hamdast-app-catalog', user?.id, params],
    queryFn: () => getHamdastAppCatalog(params),
    enabled: !!user?.id,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};
