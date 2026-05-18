import { useQuery } from '@tanstack/react-query';
import { fetchProfileHamdastWidgets, PROFILE_HAMDAST_WIDGETS_QUERY_KEY } from '@/modules/profile/functions/fetchProfileHamdastWidgets';

export function useProfileHamdastWidgets(
  userId: string | number | null | undefined,
  doctorId: string | number | undefined,
  enabled: boolean,
) {
  return useQuery(
    [PROFILE_HAMDAST_WIDGETS_QUERY_KEY, userId, doctorId],
    () => fetchProfileHamdastWidgets(userId!, doctorId),
    {
      enabled: enabled && !!userId,
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  );
}
