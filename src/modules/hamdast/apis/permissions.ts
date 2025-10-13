import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

export const getPermissions = () => {
  return apiGatewayClient.get('/v1/hamdast/permissions');
};

export const useGetPermissions = (options: any) => {
  return useQuery(['getPermissions'], () => getPermissions(), {
    ...options,
  });
};
