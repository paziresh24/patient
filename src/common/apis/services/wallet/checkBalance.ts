import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

interface Params {
  amount: string;
}

export const checkBalance = async (params: Params) => {
  return apiGatewayClient.get(`/katibe/v1/check-balance-or-pay`, {
    params: {
      amount: params.amount,
    },
  });
};

export const useCheckBalance = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.CheckBalance, params], () => checkBalance(params), options);
};
