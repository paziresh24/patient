import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface ProvidersParams {
  slug?: string;
  user_id?: string;
}

export const providers = async (params: ProvidersParams) => {
  return null;
};

export const useProviders = () => useMutation(providers);
