import { providers } from '../apis/providers';

type GetProviderData = { slug: string };

export const getProviderData = async ({ slug }: GetProviderData) => {
  const { data: response } = await providers({ slug });
  const firstItemData = response.providers[0];

  return {
    biography: firstItemData?.biography as string,
  };
};
