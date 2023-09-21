import { providers } from '../apis/providers';

type GetProviderData = { slug: string };

export const getProviderData = async ({ slug }: GetProviderData) => {
  const { data: response } = await providers({ slug });
  const firstItemData = response.providers[0];

  return {
    user_id: firstItemData?.user_id as string,
    biography: firstItemData?.biography as string,
    employee_id: firstItemData?.employee_id as string,
    prefix: firstItemData?.prefix as string,
  };
};
