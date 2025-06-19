import { splunkInstance } from '@/common/services/splunk';
import { providers } from '../apis/providers';

type GetProviderData = { slug: string };

export const getProviderData = async ({ slug }: GetProviderData) => {
  const providerData: Record<string, string> = await providers({ slug });

  return {
    ...providerData,
  };
};
