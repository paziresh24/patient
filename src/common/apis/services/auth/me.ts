import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const getMe = async () => {
  const { data } = await apiGatewayClient.get(`https://apigw.paziresh24.com/v1/auth/me`);

  return data?.users?.[0];
};

export const useGetMe = () => {
  return useMutation(getMe);
};
