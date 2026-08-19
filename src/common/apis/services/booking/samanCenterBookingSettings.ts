import { samanClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export type SamanCenterBookingSettingsPayload = {
  booking_enable_insurance?: string | null;
  booking_new_turn_suggestion_type?: string | null;
  booking_paging_from_clinic?: unknown;
  [key: string]: unknown;
};

export type SamanCenterBookingSettingsResponse = {
  center_id: string;
  user_center_id: string;
  settings: SamanCenterBookingSettingsPayload;
};

export type SamanCenterBookingSettingsParams = {
  centerId: string;
  userCenterId: string;
};

export const samanCenterBookingSettings = async ({
  centerId,
  userCenterId,
}: SamanCenterBookingSettingsParams): Promise<SamanCenterBookingSettingsPayload | null> => {
  if (!centerId || !userCenterId) return null;

  const { data } = await samanClient.get<SamanCenterBookingSettingsResponse>(
    `/v1/centers/${encodeURIComponent(centerId)}/booking-settings`,
    {
      params: { user_center_id: userCenterId },
      timeout: 5000,
    },
  );

  return data?.settings ?? null;
};

export const useSamanCenterBookingSettings = (
  centerId: string | undefined,
  userCenterId: string | undefined,
  options?: { enabled?: boolean },
) => {
  return useQuery(
    [ServerStateKeysEnum.SamanCenterBookingSettings, centerId, userCenterId],
    () => samanCenterBookingSettings({ centerId: centerId!, userCenterId: userCenterId! }),
    {
      enabled: !!centerId && !!userCenterId && (options?.enabled ?? true),
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  );
};
