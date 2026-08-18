import { drProfileClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';
import { normalizeDoctorOnlineChannels } from './normalizeDoctorOnlineChannels';

export { normalizeDoctorOnlineChannels } from './normalizeDoctorOnlineChannels';

export const getDoctorOnlineChannels = async (slug: string): Promise<string[]> => {
  if (!slug) return [];

  const { data } = await drProfileClient.get(`/api/doctors/${encodeURIComponent(slug)}/online-channels`, {
    timeout: 5000,
  });

  return normalizeDoctorOnlineChannels(data);
};

export const useDoctorOnlineChannels = (slug: string | undefined, options?: { enabled?: boolean }) => {
  return useQuery([ServerStateKeysEnum.DoctorOnlineChannels, slug], () => getDoctorOnlineChannels(slug!), {
    enabled: !!slug && (options?.enabled ?? true),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
};
