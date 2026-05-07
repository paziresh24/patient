import axios from 'axios';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export const getBalance = async () => {
  return axios.get('/patient/api/wallet/balance');
};

export const useGetBalance = (options?: any) => {
  return useQuery([ServerStateKeysEnum.WalletBalance], () => getBalance(), options);
};
