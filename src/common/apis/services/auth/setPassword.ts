import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { apiGatewayClient } from '../../client';

interface Params {
  password: string;
}

export const setPassword = async (params: Params) => {
  return await apiGatewayClient.post(
    `/gozargah/setpassword`,
    formData({ ...params, terminal_id: getCookie('terminal_id') }),
  );
};

export const useSetPassword = () => {
  return useMutation(setPassword);
};
