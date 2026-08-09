import { apiGatewayClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';

export const FIRST_AVAILABLE_BOOKING_STATUS = {
  SUCCESS: 0,
  BAD_PARAMETERS: 4,
  INVALID_CENTER: 13,
  NO_FREE_TURN: 42,
} as const;

export interface FirstAvailableBookingParams {
  center_id: string;
  service_id: string;
  user_center_id: string;
}

export interface FirstAvailableBookingResponse {
  status: number;
  message?: string;
  result?: {
    free_turn?: {
      from: number;
      to: number;
      rebook: boolean;
    };
    center_name?: string;
  };
}

export const getFirstAvailableBooking = async (
  params: FirstAvailableBookingParams,
): Promise<FirstAvailableBookingResponse> => {
  const { data } = await apiGatewayClient.post<FirstAvailableBookingResponse>(
    '/api/bookings/first-available',
    formData(params),
    {
      timeout: 5000,
      headers: {
        Accept: 'application/json',
      },
    },
  );

  return data;
};

export const mapFirstAvailableFreeturnMs = (response?: FirstAvailableBookingResponse | null): number | null => {
  if (!response || response.status !== FIRST_AVAILABLE_BOOKING_STATUS.SUCCESS) return null;

  const from = response.result?.free_turn?.from;
  if (typeof from !== 'number' || !Number.isFinite(from) || from <= 0) return null;

  return from * 1000;
};
