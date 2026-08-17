import { drProfileClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export type DoctorCenterDescriptionsResponse = {
  center_description: string | null;
  user_center_description: string | null;
};

export const getDoctorCenterDescriptions = async (
  slug: string,
  centerId: string,
): Promise<DoctorCenterDescriptionsResponse> => {
  const encodedSlug = encodeURIComponent(slug);
  const encodedCenterId = encodeURIComponent(centerId);
  const { data } = await drProfileClient.get<DoctorCenterDescriptionsResponse>(
    `/api/doctors/${encodedSlug}/centers/${encodedCenterId}/descriptions`,
    { timeout: 5000 },
  );

  return {
    center_description: data?.center_description ?? null,
    user_center_description: data?.user_center_description ?? null,
  };
};

export const useDoctorCenterDescriptions = (
  slug: string | undefined,
  centerId: string | undefined,
  options?: { enabled?: boolean },
) => {
  return useQuery(
    [ServerStateKeysEnum.DoctorCenterDescriptions, slug, centerId],
    () => getDoctorCenterDescriptions(slug!, centerId!),
    {
      enabled: !!slug && !!centerId && (options?.enabled ?? true),
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  );
};
