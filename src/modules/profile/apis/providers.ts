import { apiGatewayClient } from '@/common/apis/client';

interface ProvidersParams {
  slug: string;
}

export const providers = async (params: ProvidersParams) => {
  return await apiGatewayClient.get(`/v1/providers`, { params });
};
