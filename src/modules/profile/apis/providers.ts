import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface ProvidersParams {
  slug?: string;
  user_id?: string;
}

export const providers = async (params: ProvidersParams) => {
  const { data } = await apiGatewayClient.get(`/v1/providers`, { params });

  return data?.providers?.[0];
};

export const useProviders = () => useMutation(providers);
