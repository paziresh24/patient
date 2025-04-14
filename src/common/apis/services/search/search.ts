import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useCustomize from '@/common/hooks/useCustomize';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  query?: any;
  route: string;
  headers?: any;
  timeout?: number;
}

export const search = async ({ route, query, headers, timeout }: Params) => {
  const { data } = await searchClient.get(`/seapi/v1/search/${encodeURI(route)}`, {
    params: {
      ...query,
    },
    headers,
    timeout,
  });
  return data;
};

export const useSearch = ({ route, query }: Params, option?: any) => {
  const university = useCustomize(state => state.customize?.partnerKey);

  const searchParams = {
    route,
    query: {
      ...query,
      ...(university && { university }),
    },
  };

  return useQuery([ServerStateKeysEnum.Search, searchParams], () => search(searchParams), {
    keepPreviousData: true,
    refetchOnMount: false,
    ...option,
  });
};

export const useConsultSearch = ({ route, query, timeout }: Params, option?: any) => {
  const searchParams = {
    route,
    query: {
      ...query,
    },
    timeout,
  };

  return useQuery([ServerStateKeysEnum.SearchConsult, searchParams], () => search(searchParams), {
    keepPreviousData: true,
    refetchOnMount: false,
    ...option,
  });
};
