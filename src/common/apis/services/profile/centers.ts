import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

export interface Params {
  user_id: string;
}

export const getCenters = async ({ user_id }: Params) => {
  return apiGatewayClient.get(`/v1/doctor/${user_id}/centers`);
};

export const useGetCenters = (params: Params, options?: any) => {
  return useQuery(['getCenters', params], () => getCenters({ ...params }), options);
};
