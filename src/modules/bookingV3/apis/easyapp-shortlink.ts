import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  id: string;
  slug: string;
  pincode: string;
}

export const easyShortlink = async ({ id, ...params }: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/share/${id}`, {
    params,
  });
};

export const useEasyShortlink = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['customers', params], () => easyShortlink(params), { ...option });
