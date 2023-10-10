import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface MembershipParams {
  provider_id: string;
}

export const membership = async (params: MembershipParams) => {
  return await apiGatewayClient.get(`/v1/memberships`, { params });
};

export const useMembership = (params: MembershipParams, option?: Record<string, any>) =>
  useQuery(['membership', params], () => membership(params), { ...option });
