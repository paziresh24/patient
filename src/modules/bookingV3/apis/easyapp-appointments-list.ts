import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  user_phone: string;
}

export const easyAppointmentsList = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/appointments/`, { params });
};

export const useEasyAppointmentsList = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['appointments', params], () => easyAppointmentsList(params), { ...option });
