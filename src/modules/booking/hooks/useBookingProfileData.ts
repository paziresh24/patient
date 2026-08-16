import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { getDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { getDoctorFullName } from '@/common/apis/services/doctor/getDoctorFullName';
import { validateDoctorSlug, type DoctorSlugValidationResponse } from '@/common/apis/services/doctor/validateDoctorSlug';
import { getProfileData } from '@/common/apis/services/profile/getFullProfile';
import {
  samanCenterBookingSettings,
  type SamanCenterBookingSettingsPayload,
} from '@/common/apis/services/booking/samanCenterBookingSettings';
import { composeBookingProfile } from '@/modules/booking/functions/composeBookingProfile';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseBookingProfileDataOptions = {
  enabled?: boolean;
};

const isValidSlugInfo = (data: unknown): data is DoctorSlugValidationResponse => {
  if (!data || typeof data !== 'object') return false;
  if ('error' in data || 'redirect' in data) return false;
  return 'owner_id' in data || 'slug' in data;
};

const fetchSettingsByCenterId = async (
  centers: Array<{ id: string; user_center_id?: string }>,
): Promise<Record<string, SamanCenterBookingSettingsPayload | null>> => {
  const entries = await Promise.all(
    centers.map(async center => {
      const centerId = String(center.id);
      const userCenterId = center.user_center_id;
      if (!userCenterId) {
        return [centerId, null] as const;
      }
      try {
        const settings = await samanCenterBookingSettings({
          centerId,
          userCenterId: String(userCenterId),
        });
        return [centerId, settings] as const;
      } catch {
        return [centerId, null] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
};

/**
 * Booking profile loader: granular drprofile first, full-profile for gaps (e.g. insurances).
 * center.settings comes from Saman booking-settings only (not full-profile).
 * full-profile / settings errors soft-fail; UI is not blocked on them.
 */
export const useBookingProfileData = (slug: string | undefined, options?: UseBookingProfileDataOptions) => {
  const enabled = !!slug && options?.enabled !== false;

  const slugQuery = useQuery([ServerStateKeysEnum.SlugProfile, 'booking', slug], () => validateDoctorSlug(slug!), {
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const fullNameQuery = useQuery(
    [ServerStateKeysEnum.SlugProfile, 'doctor-fullname', 'booking', slug],
    () => getDoctorFullName(slug!),
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  const expertiseQuery = useQuery(
    [ServerStateKeysEnum.SlugProfile, 'doctor-expertise', 'booking', slug],
    () => getDoctorExpertise(slug!),
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  const centersQuery = useQuery([ServerStateKeysEnum.DoctorCenters, slug], () => getDoctorCenters(slug!), {
    enabled,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const fullProfileQuery = useQuery(
    [ServerStateKeysEnum.DoctorFullProfile, { slug }],
    async () => {
      try {
        return await getProfileData({ slug: slug! });
      } catch {
        return null;
      }
    },
    {
      enabled,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  );

  const settingsQuery = useQuery(
    [ServerStateKeysEnum.SamanCenterBookingSettings, slug, centersQuery.data?.map(c => `${c.id}:${c.user_center_id}`)],
    () => fetchSettingsByCenterId(centersQuery.data ?? []),
    {
      enabled: enabled && !!centersQuery.data?.length,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  );

  // Only honor validateDoctorSlug redirects. full-profile redirects can point at stale
  // slugs and fight the canonical chain (infinite booking URL loop).
  const redirect =
    slugQuery.data && typeof slugQuery.data === 'object' && 'redirect' in slugQuery.data
      ? (slugQuery.data as { redirect: { route: string; statusCode?: number } }).redirect
      : undefined;

  const slugInfo = isValidSlugInfo(slugQuery.data) ? slugQuery.data : null;
  const fullProfile = fullProfileQuery.data?.data ?? null;
  const fullProfileFailed = fullProfileQuery.isFetched && !fullProfile;
  const settingsByCenterId = settingsQuery.data ?? {};

  const profile = useMemo(
    () =>
      composeBookingProfile({
        slugInfo,
        fullName: fullNameQuery.data ?? null,
        expertise: expertiseQuery.data ?? null,
        doctorCenters: centersQuery.data ?? null,
        fullProfile,
        settingsByCenterId,
      }),
    [slugInfo, fullNameQuery.data, expertiseQuery.data, centersQuery.data, fullProfile, settingsByCenterId],
  );

  const essentialsReady = !slugQuery.isLoading && !centersQuery.isLoading;
  const isLoading = enabled && !essentialsReady;
  const isSuccess = !!profile && Array.isArray(profile.centers);
  const isError =
    !isLoading &&
    !isSuccess &&
    (slugQuery.isError ||
      (!!slugQuery.data && 'error' in (slugQuery.data as object) && !centersQuery.data?.length));

  const status = isLoading ? 'loading' : isSuccess ? 'success' : isError ? 'error' : 'idle';

  return {
    /** Mimics useGetProfileData envelope: `data.data` is the profile */
    data: profile
      ? { data: profile, ...(redirect ? { redirect } : {}) }
      : redirect
        ? { redirect }
        : undefined,
    profile,
    isLoading,
    isSuccess,
    isError,
    status,
    fullProfileFailed,
    redirect,
  };
};
