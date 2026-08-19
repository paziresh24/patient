import { samanClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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

/** One deferred network hit per slug so Services + Risman + SamanBooking don't triple-fetch. */
const deferredSamanRefetchBySlug = new Map<string, ReturnType<typeof setTimeout>>();

const DEFERRED_SAMAN_REFETCH_MS = 2000;

export const useSamanDoctorAvailabilityStatus = (slug: string, options?: any) => {
  const queryClient = useQueryClient();
  const queryKey = [ServerStateKeysEnum.SamanDoctorAvailabilityStatus, slug] as const;
  const enabled = options?.enabled !== false && !!slug;

  const query = useQuery(queryKey, () => samanDoctorAvailabilityStatus(slug), {
    staleTime: 60_000,
    // SSR dehydrate paints booking UI; remount refetch on hydrate competed with first CTA (INP).
    // Product/ops still need a Network tab hit — schedule it after the first-interaction window.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });

  useEffect(() => {
    if (!enabled || !slug) return;

    const cached = queryClient.getQueryData(queryKey);
    if (cached == null) return;

    // Shared across Services / Risman / SamanBooking — do not clear on one consumer unmount.
    if (deferredSamanRefetchBySlug.has(slug)) return;

    const timeoutId = setTimeout(() => {
      deferredSamanRefetchBySlug.delete(slug);
      void queryClient.refetchQueries({ queryKey, type: 'active' });
    }, DEFERRED_SAMAN_REFETCH_MS);

    deferredSamanRefetchBySlug.set(slug, timeoutId);
  }, [enabled, slug, queryClient]);

  return query;
};
