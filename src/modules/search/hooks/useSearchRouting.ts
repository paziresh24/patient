import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';

export const useSearchRouting = () => {
  const {
    query: { params: defualtParams, ...queries },
    ...router
  } = useRouter();
  const slug = defualtParams as string[];

  const changeRoute = ({
    params,
    query,
    overWrite = false,
    previousQueries = true,
    scroll = true,
    pageParam = false,
    replace = false,
  }: {
    params?: Record<string, string>;
    query?: ParsedUrlQueryInput | null | undefined;
    overWrite?: boolean;
    previousQueries?: boolean;
    scroll?: boolean;
    pageParam?: boolean;
    replace?: boolean;
  }) => {
    const formattedSlug = [
      overWrite ? params?.city : params?.city ?? slug?.[0],
      overWrite ? params?.category : params?.category ?? slug?.[1] ?? '',
    ]
      .filter(item => item)
      .join('/');

    router[replace ? 'replace' : 'push'](
      {
        pathname: `/s/${formattedSlug}`,
        query: {
          ...(!overWrite && previousQueries && { ...omit(queries, !pageParam ? 'page' : '') }),
          ...query,
        },
      },
      undefined,
      { shallow: true, scroll },
    );
  };

  return { changeRoute };
};
