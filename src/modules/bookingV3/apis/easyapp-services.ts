import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  service_id: string;
}

export const easyServices = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/services/${params.service_id}`);
};

export const useEasyServices = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['services', params], () => easyServices(params), { ...option });
