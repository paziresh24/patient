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
      refetchOnWindowFocus: false,
      ...options,
    },
  );
};
