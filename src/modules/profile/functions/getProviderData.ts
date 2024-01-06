import { splunkInstance } from '@/common/services/splunk';
import { providers } from '../apis/providers';

type GetProviderData = { slug: string };

export const getProviderData = async ({ slug }: GetProviderData) => {
  const providerData: Record<string, string> = await providers({ slug });

  if (!providerData?.user_id) {
    splunkInstance().sendEvent({
      group: 'empty-providers',
      type: 'empty-providers-profile',
      event: {
        slug,
      },
    });
  }

  return {
    ...providerData,
  };
};
