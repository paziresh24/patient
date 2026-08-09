import { useQuery } from '@tanstack/react-query';
import { drProfileClient } from '../../client';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

export type DoctorCenterServiceResponse = {
  id: string;
  can_booking: boolean;
  can_request: boolean;
  duration: string | null;
  request_description: string | null;
  terms_and_conditions: string | null;
  service: {
    id: string;
    title: string;
    price: number;
    description: string | null;
    service_type_id: number;
    server_id: number;
  };
};

export const getDoctorCenterServices = async (
  slug: string,
  centerId: string,
): Promise<DoctorCenterServiceResponse[]> => {
  const encodedSlug = encodeURIComponent(slug);
  const { data } = await drProfileClient.get<DoctorCenterServiceResponse[]>(
    `/api/doctors/${encodedSlug}/centers/${centerId}/services`,
    { timeout: 5000 },
  );
  return Array.isArray(data) ? data : [];
};

export const useDoctorCenterServices = (
  slug: string,
  centerId: string | undefined,
  options?: { enabled?: boolean; [key: string]: unknown },
) => {
  return useQuery(
    [ServerStateKeysEnum.DoctorCenterServices, slug, centerId],
    () => getDoctorCenterServices(slug, centerId!),
    {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      ...options,
      enabled: !!slug && !!centerId && (options?.enabled ?? true),
    },
  );
};
