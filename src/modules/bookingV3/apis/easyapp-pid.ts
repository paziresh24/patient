import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface MembershipParams {
  provider_id: string;
}

export const easyPidConveter = async (params: MembershipParams) => {
  return await apiGatewayClient.get(`/v1/easyapp/pid-converter`, { params });
};

export const useEasyPidConverter = (params: MembershipParams, option?: Record<string, any>) =>
  useQuery(['easyPidConveter', params], () => easyPidConveter(params), { ...option });
