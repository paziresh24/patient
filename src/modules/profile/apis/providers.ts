import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface ProvidersParams {
  slug?: string;
  user_id?: string;
}

export const providers = async (params: ProvidersParams) => {
  return await apiGatewayClient.get(`/v1/providers`, { params });
};

export const useProviders = (params: ProvidersParams, options?: any) =>
  useQuery(['providers', params], () => providers(params), { ...options });
