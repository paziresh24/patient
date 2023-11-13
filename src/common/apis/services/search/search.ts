import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import useCustomize from '@/common/hooks/useCustomize';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  query?: any;
  route: string;
  headers?: any;
}

export const search = async ({ route, query, headers }: Params) => {
  const { data } = await searchClient.get(`/seapi/v1/search/${encodeURI(route)}`, {
    params: {
      ...query,
    },
    headers,
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
