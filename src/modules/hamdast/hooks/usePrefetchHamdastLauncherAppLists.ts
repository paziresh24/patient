import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { getHamdastAppListParams } from '@/modules/hamdast/utils/hamdastAppListParams';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useSyncExternalStore, useMemo } from 'react';
import { growthbook } from 'src/pages/_app';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export interface HamdastListApp {
  app_key: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  link?: string;
  badges?: string[];
}

const HAMDAST_LIST_BASE = 'https://hamdast.paziresh24.com/api/v1/list';

const subscribeGrowthbook = (onStoreChange: () => void) => growthbook.subscribe(onStoreChange) ?? (() => undefined);

const fetchHamdastAppList = async (path: 'featured' | 'new-releases', params: Record<string, unknown>) => {
  const { data } = await axios.get<HamdastListApp[]>(`${HAMDAST_LIST_BASE}/${path}`, {
    params,
    withCredentials: true,
  });
  return data ?? [];
};

export const useHamdastAppListParams = () => {
  const user = useUserInfoStore(state => state.info);
  const growthbookReady = useSyncExternalStore(subscribeGrowthbook, () => growthbook.ready, () => false);

  return useMemo(() => {
    if (!growthbookReady) return {};
    return getHamdastAppListParams();
  }, [growthbookReady, user?.id, user?.is_doctor, user?.provider?.job_title, user?.provider?.slug]);
};

export const usePrefetchHamdastLauncherAppLists = () => {
  const user = useUserInfoStore(state => state.info);
  const isDoctor = isDoctorUser(user);
  const params = useHamdastAppListParams();
  const enabled = isDoctor && !!user?.id;

  useQuery({
    queryKey: ['hamdast-app-list', 'featured', user?.id, params],
    queryFn: () => fetchHamdastAppList('featured', params),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

  useQuery({
    queryKey: ['hamdast-app-list', 'new-releases', user?.id, params],
    queryFn: () => fetchHamdastAppList('new-releases', params),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
};
