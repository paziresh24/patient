import * as Sentry from '@sentry/nextjs';
import { providers } from '../apis/providers';

type GetProviderData = { slug: string };

export const getProviderData = async ({ slug }: GetProviderData) => {
  const providerData: Record<string, string> = await providers({ slug });

  if (!providerData?.user_id || !providerData?.employee_id) {
    Sentry.captureMessage(`user_id:${providerData?.user_id} employee_id:${providerData?.employee_id}`);
  }

  return {
    ...providerData,
  };
};
