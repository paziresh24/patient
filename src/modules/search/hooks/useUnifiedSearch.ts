import { useInfiniteQuery } from '@tanstack/react-query';
import { search as searchApi } from '@/common/apis/services/search/search';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import flatten from 'lodash/flatten';

type Params = {
  route: string;
  query: any;
};

export const useUnifiedSearch = ({ route, query }: Params, options?: any) => {
  const { page, ...restQuery } = query; // Exclude page from query key to prevent refetch on pagination

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isSuccess, remove } = useInfiniteQuery(
    [
      ServerStateKeysEnum.Search,
      {
        route,
        query: restQuery,
      },
    ],
    ({ pageParam = query.page ?? 1 }) =>
      searchApi({
        route,
        query: {
          page: pageParam,
          ...restQuery,
        },
      }),
    {
      getNextPageParam: (lastPage: any) => {
        const { page, limit } = lastPage?.search?.pagination || {};
        const total = lastPage?.search?.total || 0;
        if (page * limit < total) {
          return page + 1;
        }
        return undefined;
      },
      ...options,
    },
  );

  const results = flatten(data?.pages?.map((page: any) => page?.search?.result) ?? []);
  const total = data?.pages?.[0]?.search?.total ?? 0;
  const pagination = data?.pages?.[0]?.search?.pagination ?? {};
  const responseData = data?.pages?.[0] ?? {};

  return {
    results,
    total,
    pagination,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isSuccess,
    data, // Full data if needed
    responseData, // First page response (useful for metadata like categories, etc.)
    remove,
  };
};
