import { apiGatewayClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  user_id?: string;
  name?: string;
  family?: string;
  national_code?: string;
  gender?: 'male' | 'female';
  cell?: string;
  country_code?: string;
}

export const patchUser = async ({ user_id, national_code, ...params }: Params) => {
  return await apiGatewayClient.patch(`/v1/users/${user_id}`, {
    ...params,
    ...(national_code && { national_code }),
  });
};

export const usePatchUser = () => {
  return useMutation(patchUser);
};
