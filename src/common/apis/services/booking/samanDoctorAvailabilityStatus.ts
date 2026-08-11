import { samanClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export type SamanAvailabilityItem = {
  booking_available: boolean;
  nearest_time_slot: string | null;
  nearest_available_time: string | null;
};

export type SamanCenterAvailability = {
  id: string;
  availability_status: SamanAvailabilityItem;
};

export type SamanDoctorAvailabilityStatus = {
  in_person_availability: SamanAvailabilityItem;
  online_visit_availability: SamanAvailabilityItem;
  centers: SamanCenterAvailability[];
};

export const samanDoctorAvailabilityStatus = async (slug: string) => {
  const encodedSlug = encodeURIComponent(slug);
  const { data } = await samanClient.get<SamanDoctorAvailabilityStatus>(
    `/v1/doctors/${encodedSlug}/availability-status`,
  );
  return data;
};

export const useSamanDoctorAvailabilityStatus = (slug: string, options?: any) => {
  return useQuery(
    [ServerStateKeysEnum.SamanDoctorAvailabilityStatus, slug],
    () => samanDoctorAvailabilityStatus(slug),
    {
      staleTime: 60_000,
      // Keep 'always': product/ops expect Saman availability-status to hit the network on
      // profile mount (browser Network tab). Skipping remount refetch after SSR dehydrate
      // looked like "Saman does not run on profile pages" (!199 follow-up).
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
      ...options,
    },
  );
};
