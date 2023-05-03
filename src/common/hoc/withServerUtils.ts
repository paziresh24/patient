import { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const withServerUtils = (next: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
  const data: any = await next?.(ctx);

  return {
    ...data,
    props: {
      ...data.props,
      query: ctx.query,
      host: ctx.req.headers.host,
    },
  };
};
