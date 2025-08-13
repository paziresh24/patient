import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';
import useCustomize from '@/common/hooks/useCustomize';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  const university = useCustomize(state => state.customize?.partnerKey);
  const isClapiActive = useFeatureIsOn('use-clapi-profile-page');

  return useQuery(
    ['profileClientData', slug],
    () =>
      getAggregatedProfileData(slug, university, false, {
        useClApi: isClapiActive,
      }),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: false,

      retry: 3,
    },
  );
};
