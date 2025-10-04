import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

export const getCentersByUserId = async (user_id: string) => {
  try {
    const { data } = await apiGatewayClient.get(`/v1/doctor/${user_id}/centers`);
    return data?.items;
  } catch (error) {
    return {};
  }
};

export const useGetCentersByUserId = (user_id: string, options?: any) => {
  return useQuery(['getCentersByUserId', user_id], () => getCentersByUserId(user_id), {
    ...options,
    retry: 3,
    retryDelay: 1000,
  });
};
