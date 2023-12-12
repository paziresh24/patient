import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface FreeturnParams {
  id: string;
}

export const easyDeleteAppointments = async (params: FreeturnParams) => {
  return await apiGatewayClient.delete(`/v1/easyapp/appointments/${params.id}`);
};

export const useEasyDeleteAppointments = () => useMutation(easyDeleteAppointments);
