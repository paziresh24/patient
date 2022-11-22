import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const withCSR = (next: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const isCSR = ctx.req.url?.startsWith('/_next');

  if (isCSR) {
    return {
      props: {},
    };
  }

  return next?.(ctx);
};
