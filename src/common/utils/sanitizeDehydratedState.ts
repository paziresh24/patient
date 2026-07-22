import type { DehydratedState } from '@tanstack/react-query';

type InfiniteDataLike = {
  pageParams?: unknown[];
  pages?: unknown[];
};

function isInfiniteQueryData(data: unknown): data is InfiniteDataLike {
  return !!data && typeof data === 'object' && Array.isArray((data as InfiniteDataLike).pageParams);
}

export function sanitizeDehydratedState(dehydratedState: DehydratedState): DehydratedState {
  const filtered: DehydratedState = {
    ...dehydratedState,
    queries: dehydratedState.queries
      .filter(query => !isInfiniteQueryData(query.state?.data))
      .map(query => {
        const data = query.state?.data;
        if (!isInfiniteQueryData(data)) {
          return query;
        }

        return {
          ...query,
          state: {
            ...query.state,
            data: {
              ...data,
              pageParams: data.pageParams.map(param => (param === undefined ? { page: 1 } : param)),
            },
          },
        };
      }),
  };

  // Next.js cannot serialize `undefined` anywhere in getServerSideProps props.
  return JSON.parse(JSON.stringify(filtered, (_, value) => (value === undefined ? null : value))) as DehydratedState;
}
