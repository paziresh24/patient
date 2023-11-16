import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  ea_id: string;
}

export const easyProvider = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/providers/${params.ea_id}`);
};

export const useEasyProvider = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['providers', params], () => easyProvider(params), { ...option });
