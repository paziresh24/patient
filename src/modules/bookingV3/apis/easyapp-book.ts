import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const easyBook = async (params: any) => {
  return await apiGatewayClient.post(`/v1/easyapp/book/`, params);
};

export const useEasyBook = () => useMutation(easyBook);
