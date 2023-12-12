import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface AppointmentsCountParams {
  user_center_id?: string;
  from_less_than?: number;
  from_greather_than?: number;
  payment_status_in?: number[];
  deleted_at_greater_than?: string;
}

export const appointmentsCount = async (params: AppointmentsCountParams) => {
  return apiGatewayClient.get(`/v1/appointments/count`, { params });
};

export const useAppointmentsCount = (params: AppointmentsCountParams) =>
  useQuery(['appointmentsCount', params], () => appointmentsCount(params));
