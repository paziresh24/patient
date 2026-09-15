import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { getDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { getDoctorFullName } from '@/common/apis/services/doctor/getDoctorFullName';
import { validateDoctorSlug, type DoctorSlugValidationResponse } from '@/common/apis/services/doctor/validateDoctorSlug';
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

/**
 * Booking profile loader from granular drprofile APIs.
 * center.settings, insurances, descriptions, and online-channels are fetched
 * later in BookingSteps for the selected center / SELECT_USER.
 * Failed sources stay null; full-profile is not fetched.
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

  const redirect =
    slugQuery.data && typeof slugQuery.data === 'object' && 'redirect' in slugQuery.data
      ? (slugQuery.data as { redirect: { route: string; statusCode?: number } }).redirect
      : undefined;

  const slugInfo = isValidSlugInfo(slugQuery.data) ? slugQuery.data : null;

  const profile = useMemo(
    () =>
      composeBookingProfile({
        slugInfo,
        fullName: fullNameQuery.isError ? null : fullNameQuery.data ?? null,
        expertise: expertiseQuery.isError ? null : expertiseQuery.data ?? null,
        doctorCenters: centersQuery.isError ? null : centersQuery.data ?? null,
      }),
    [slugInfo, fullNameQuery.data, fullNameQuery.isError, expertiseQuery.data, expertiseQuery.isError, centersQuery.data, centersQuery.isError],
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
    redirect,
  };
};
