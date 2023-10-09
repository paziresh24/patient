import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface ReserveParams {
  membership_id: string;
  service_id: string;
  time: string;
}

export const reserve = async (params: ReserveParams) => {
  return await apiGatewayClient.post(`/v1/reserve`, params);
};

export const useReserve = () => useMutation(reserve);
