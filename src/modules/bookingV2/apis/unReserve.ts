import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface UnReserveParams {
  membership_id: string;
  reserve_id: string;
}

export const unReserve = async ({ membership_id, reserve_id }: UnReserveParams) => {
  return await apiGatewayClient.delete(`/v1/reserve/${reserve_id}`, { params: { membership_id } });
};

export const useUnReserve = () => useMutation(unReserve);
