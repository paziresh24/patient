import * as Sentry from '@sentry/nextjs';
import { providers } from '../apis/providers';

type GetProviderData = { slug: string };

export const getProviderData = async ({ slug }: GetProviderData) => {
  const { data: response } = await providers({ slug });
  const firstItemData = response.providers?.[0] as Record<string, string>;

  if (!firstItemData?.user_id || !firstItemData?.employee_id) {
    Sentry.captureMessage(`user_id:${firstItemData?.user_id} employee_id:${firstItemData?.employee_id}`);
  }

  return {
    ...firstItemData,
  };
};
