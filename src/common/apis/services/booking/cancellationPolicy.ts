import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

interface Params {
  book_id?: string;
}

export const getCancellationPolicyStatus = (params: Params) => {
  return apiGatewayClient.get('/payment/v1/cancellation-policy', { params });
};

export const useGetCancellationPolicyStatus = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.GetCancellationPolicyStatus, params], () => getCancellationPolicyStatus(params), {
    ...options,
  });
};
