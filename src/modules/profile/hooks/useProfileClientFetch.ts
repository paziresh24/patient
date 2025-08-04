import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';
import useCustomize from '@/common/hooks/useCustomize';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  const university = useCustomize(state => state.customize?.partnerKey);

  return useQuery(['profileClientData', slug], () => getAggregatedProfileData(slug, university, false), {
    enabled: enabled,
    refetchOnWindowFocus: false,
    keepPreviousData: false,
    retry: 3,
  });
};
