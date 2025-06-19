import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

interface Params {
  user_id: string;
  center_id: string[];
}

export const availabilityStatus = ({ user_id, ...params }: Params) => {
  return apiGatewayClient.get(`/core-booking/v1/providers/${user_id}/availability-status`, { params });
};

export const useAvailabilityStatus = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.AvailabilityStatus, params], () => availabilityStatus(params), options);
};
