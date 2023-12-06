import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  id: string;
}

export const easyAppointments = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/appointments/${params.id}`);
};

export const useEasyAppointments = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['appointments', params], () => easyAppointments(params), { ...option });
