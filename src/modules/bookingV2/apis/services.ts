import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  membership_id: string;
}

export const services = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/booking/services`, { params });
};

export const useServices = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['services', params], () => services(params), { ...option });
