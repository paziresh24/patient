import { searchClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useQuery } from 'react-query';

export interface Params {
  query?: ParsedUrlQuery;
  route: string;
}

export const search = async ({ route, query }: Params) => {
  const { data } = await searchClient.get(`/seapi/v1/search/${route}`, {
    params: {
      ...query,
    },
  });
  return data;
};

export const useSearch = () => {
  const {
    query: { params, ...query },
  } = useRouter();

  const searchParams = {
    route: (params as string[])?.join('/') ?? '',
    query: {
      ...query,
    },
  };

  return useQuery([ServerStateKeysEnum.Search, searchParams], () => search(searchParams), {
    keepPreviousData: true,
  });
};
