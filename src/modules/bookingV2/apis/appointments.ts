import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface BookParams {
  membership_id: string;
  service_id: string;
  time: string;
  sub_user?: string;
}

export const appointments = async (params: BookParams) => {
  return await apiGatewayClient.post(`/v1/appointments`, params);
};

export const useAppointments = () => useMutation(appointments);
