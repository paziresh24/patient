import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';
import useCustomize from '@/common/hooks/useCustomize';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { useFeatureValue } from '@growthbook/growthbook-react';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  const university = useCustomize(state => state.customize?.partnerKey);
  const expertiseChipsConfig = useFeatureValue<{ slugs?: string[] }>('profile.expertise-chips-like-search', { slugs: [] });
  const fetchExpertiseKeywordTags = newApiFeatureFlaggingCondition(expertiseChipsConfig?.slugs ?? [], slug);

  return useQuery(
    ['profileClientData', slug, fetchExpertiseKeywordTags],
    () =>
      getAggregatedProfileData(slug, university, false, {
        useNewDoctorFullNameAPI: true,
        useNewDoctorExpertiseAPI: true,
        useNewDoctorImageAPI: true,
        useNewDoctorBiographyAPI: true,
        useNewDoctorCentersAPI: true,
        useNewDoctorGalleryAPI: true,
        fetchExpertiseKeywordTags,
      }),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
      retry: 3,
    },
  );
};
