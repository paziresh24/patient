import { useRouter } from 'next/router';

export const useSearchRouting = () => {
  const {
    query: { params: defualtParams, ...queries },
    ...router
  } = useRouter();
  const slug = defualtParams as string[];

  const changeRoute = ({ params, query }: { params?: Record<string, string>; query?: Record<string, string> }) => {
    router.push(
      {
        pathname: `/s/${[params?.city ?? slug?.[0], params?.category ?? slug?.[1] ?? ''].join('/')}`,
        query: {
          ...queries,
          ...query,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  return { changeRoute };
};
