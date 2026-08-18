import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const getMe = async () => {
  // Browser: same-origin BFF so فیلترشکن/VPN cannot turn the apigw call into a CORS failure.
  // /api/** on www is clinic (Arvan seq 211); /patient/api/* already rewrites to this app.
  // Server: talk to apigw directly — no browser CORS, and the BFF would loop on itself.
  const isBrowser = typeof window !== 'undefined';
  const { data } = await apiGatewayClient.get(isBrowser ? '/patient/api/auth/me' : '/v1/auth/me', isBrowser ? { baseURL: '' } : undefined);

  return data?.users?.[0];
};

export const useGetMe = () => {
  return useMutation(getMe);
};
