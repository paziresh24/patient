import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  return useQuery(
    ['profileClientData', slug],

    () => getAggregatedProfileData(slug, undefined, false),

    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
      retry: 3,
    },
  );
};
