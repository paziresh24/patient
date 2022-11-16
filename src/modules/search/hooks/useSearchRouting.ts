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
  }: {
    params?: Record<string, string>;
    query?: ParsedUrlQueryInput | null | undefined;
    overWrite?: boolean;
    previousQueries?: boolean;
    scroll?: boolean;
  }) => {
    router.push(
      {
        pathname: `/s/${[
          overWrite ? params?.city : params?.city ?? slug?.[0],
          overWrite ? params?.category : params?.category ?? slug?.[1] ?? '',
        ].join('/')}`,
        query: {
          ...(!overWrite && previousQueries && { ...queries }),
          ...query,
        },
      },
      undefined,
      { shallow: true, scroll },
    );
  };

  return { changeRoute };
};
