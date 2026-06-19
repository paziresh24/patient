import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOneAppQueryKey, ONE_APP_STALE_TIME_MS } from '@/modules/hamdast/utils/prefetchOneApp';

export const oneApp = ({ appKey, pageKey }: { appKey: string; pageKey: string }) => {
  return axios.get(`https://hamdast.paziresh24.com/api/v1/apps/${appKey}/pages/${pageKey}/`);
};

export const useOneApp = (params: { appKey: string; pageKey: string }, option?: Record<string, any>) =>
  useQuery({
    queryKey: getOneAppQueryKey(params),
    queryFn: () => oneApp(params),
    staleTime: ONE_APP_STALE_TIME_MS,
    ...option,
  });
