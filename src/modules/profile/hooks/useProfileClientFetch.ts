import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';
import useCustomize from '@/common/hooks/useCustomize';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  const university = useCustomize(state => state.customize?.partnerKey);
  const isClapiActive = useFeatureIsOn('use-clapi-profile-page');
  const useNewDoctorFullNameAPI = useFeatureIsOn('doctor_fullname_for_new_profileapi');
  const useNewDoctorExpertiseAPI = useFeatureIsOn('doctor_expertise_for_new_profileapi');
  const useNewDoctorImageAPI = useFeatureIsOn('doctor_image_for_new_profileapi');
  const useNewDoctorBiographyAPI = useFeatureIsOn('doctor_bio_for_new_profileapi');
  const useNewDoctorCentersAPI = useFeatureIsOn('doctor_centers_for_new_profileapi');

  return useQuery(
    ['profileClientData', slug],
    () =>
      getAggregatedProfileData(slug, university, false, {
        useClApi: isClapiActive,
        useNewDoctorFullNameAPI: useNewDoctorFullNameAPI,
        useNewDoctorExpertiseAPI: useNewDoctorExpertiseAPI,
        useNewDoctorImageAPI: useNewDoctorImageAPI,
        useNewDoctorBiographyAPI: useNewDoctorBiographyAPI,
        useNewDoctorCentersAPI: useNewDoctorCentersAPI,
      }),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: false,

      retry: 3,
    },
  );
};
