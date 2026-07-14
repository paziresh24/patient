import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';
import { AggregatedProfileResponse } from '@/modules/profile/types/doctorProfilePage';
import useCustomize from '@/common/hooks/useCustomize';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  const university = useCustomize(state => state.customize?.partnerKey);

  return useQuery<AggregatedProfileResponse>(
    ['profileClientData', slug],
    () =>
      getAggregatedProfileData(slug, university, false, {
        useNewDoctorFullNameAPI: true,
        useNewDoctorExpertiseAPI: true,
        useNewDoctorImageAPI: true,
        useNewDoctorBiographyAPI: true,
        useNewDoctorCentersAPI: true,
        useNewDoctorGalleryAPI: true,
      }) as Promise<AggregatedProfileResponse>,
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
      retry: 3,
    },
  );
};
