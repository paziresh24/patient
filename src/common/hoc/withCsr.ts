export const withCSR = (next: any) => async (ctx: any) => {
  const isCSR = ctx.req.url?.startsWith('/_next');

  if (isCSR) {
    return {
      props: {},
    };
  }

  return next?.(ctx);
};
