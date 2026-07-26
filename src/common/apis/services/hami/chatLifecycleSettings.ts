import { drProfileClient } from '@/common/apis/client';
import { getAppointmentDoctor } from '@/common/apis/services/booking/getAppointmentDoctor';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const hamiBackClient = axios.create({
  baseURL: 'https://hami-back.paziresh24.com',
  timeout: 4000,
});

/** Fallback when feature is on but lifecycle API fails / returns no hours — never show the legacy duration. */
export const CHAT_LIFECYCLE_FALLBACK_HOURS = 1;

export type ChatLifecycleSettings = {
  auto_close_hours?: number;
  auto_close_idle_hours?: number;
  closed_chat_mode?: string;
  closed_reply_days_limit?: number;
  require_reopen_reason?: boolean;
  allow_reopen_after_rejection?: boolean;
};

type ChatLifecycleSettingsResponse = {
  status?: string;
  data?: ChatLifecycleSettings;
};

const hasUserId = (value?: string | number | null) => value !== undefined && value !== null && value !== '';

export const getChatLifecycleSettings = async (userId: string): Promise<ChatLifecycleSettings> => {
  const { data } = await hamiBackClient.get<ChatLifecycleSettingsResponse>(
    `/api/external/users/${encodeURIComponent(userId)}/chat-lifecycle-settings`,
  );
  return data?.data ?? (data as ChatLifecycleSettings);
};

/**
 * Resolve doctor user_id then read auto_close_hours from Hami.
 *
 * Profile: pass doctor.user_id directly.
 * Receipt: pass doctorUserId from page (doctor slug → drprofile). If not ready yet:
 *   1) bookId → appointments/.../doctor
 *   2) slug → drprofile
 */
export const fetchChatLifecycleAutoCloseHours = async (params: {
  doctorUserId?: string | number | null;
  doctorSlug?: string | null;
  bookId?: string | null;
}): Promise<number | null> => {
  let userId: string | null = hasUserId(params.doctorUserId) ? String(params.doctorUserId) : null;

  if (!userId && params.bookId) {
    const appointmentDoctor = await getAppointmentDoctor(params.bookId);
    if (hasUserId(appointmentDoctor?.user_id)) {
      userId = String(appointmentDoctor.user_id);
    }
  }

  if (!userId && params.doctorSlug) {
    const { data } = await drProfileClient.get(`/api/doctors/${encodeURIComponent(params.doctorSlug)}`, { timeout: 4000 });
    if (hasUserId(data?.user_id)) {
      userId = String(data.user_id);
    }
  }

  if (!userId) return null;

  const settings = await getChatLifecycleSettings(userId);
  const hours = settings?.auto_close_hours;
  return typeof hours === 'number' && Number.isFinite(hours) ? hours : null;
};

export const useChatLifecycleAutoCloseHours = ({
  enabled,
  doctorUserId,
  doctorSlug,
  bookId,
}: {
  enabled: boolean;
  doctorUserId?: string | number | null;
  doctorSlug?: string | null;
  bookId?: string | null;
}) => {
  const canResolve = hasUserId(doctorUserId) || !!doctorSlug || !!bookId;

  const query = useQuery(
    [ServerStateKeysEnum.ChatLifecycleAutoCloseHours, doctorUserId, doctorSlug, bookId],
    () =>
      fetchChatLifecycleAutoCloseHours({
        doctorUserId,
        doctorSlug,
        bookId,
      }),
    {
      enabled: !!enabled && canResolve,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      // Receipt doctorUserId arrives async after slug→drprofile; keep prior hours to avoid skeleton flash.
      keepPreviousData: true,
    },
  );

  // Prefer API hours; if finished without a usable value (error / null / cannot resolve), use 1h — never legacy duration.
  const hours =
    !enabled
      ? null
      : query.data != null
        ? query.data
        : !canResolve || query.isFetched || query.isError
          ? CHAT_LIFECYCLE_FALLBACK_HOURS
          : null;

  return {
    ...query,
    hours,
    isPending: !!enabled && hours == null,
  };
};
