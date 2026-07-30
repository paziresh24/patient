import { useQuery } from '@tanstack/react-query';
import { getAggregatedProfileData } from '@/modules/profile/functions/getAggregatedProfileData';
import useCustomize from '@/common/hooks/useCustomize';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { getProfileMicroserviceConfig } from '@/common/apis/clients/profileMicroserviceClient';
import {
  isProfileMicroserviceEnabledForSlug,
  PROFILE_API_SOURCE_FEATURE_KEY,
} from '@/modules/profile/utils/profileApiSourceBySlugFlag';

export const useProfileClientFetch = (slug: string, enabled: boolean) => {
  const university = useCustomize(state => state.customize?.partnerKey);
  const expertiseChipsConfig = useFeatureValue<{ slugs?: string[] }>('profile.expertise-chips-like-search', { slugs: [] });
  const fetchExpertiseKeywordTags = newApiFeatureFlaggingCondition(expertiseChipsConfig?.slugs ?? [], slug);

  const apiSourceConfig = useFeatureValue<{ slugs?: string[] }>(PROFILE_API_SOURCE_FEATURE_KEY, { slugs: [] });
  const { baseURL } = getProfileMicroserviceConfig();
  const useProfileMicroservice =
    !!baseURL && isProfileMicroserviceEnabledForSlug(slug, apiSourceConfig?.slugs ?? []);

  return useQuery(
    ['profileClientData', slug, fetchExpertiseKeywordTags, useProfileMicroservice],
    () =>
      getAggregatedProfileData(slug, university, false, {
        useNewDoctorFullNameAPI: true,
        useNewDoctorExpertiseAPI: true,
        useNewDoctorImageAPI: true,
        useNewDoctorBiographyAPI: true,
        useNewDoctorCentersAPI: true,
        useNewDoctorGalleryAPI: true,
        fetchExpertiseKeywordTags,
        useProfileMicroservice,
      }),
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
      retry: 3,
    },
  );
};
