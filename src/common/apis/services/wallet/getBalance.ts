import { katibeApiClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export const getBalance = async () => {
  return katibeApiClient.get(`/katibe/v1/transactions/balance/p24`);
};

export const useGetBalance = (options?: any) => {
  return useQuery([ServerStateKeysEnum.WalletBalance], () => getBalance(), options);
};
