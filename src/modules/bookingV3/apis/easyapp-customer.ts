import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface FreeturnParams {
  id: string;
}

export const easyCustomer = async (params: FreeturnParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/customers/${params.id}`);
};

export const useEasyCustomers = (params: FreeturnParams, option?: Record<string, any>) =>
  useQuery(['customers', params], () => easyCustomer(params), { ...option });
