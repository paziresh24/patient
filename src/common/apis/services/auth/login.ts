import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { apiGatewayClient } from '../../client';
import { setTerminal } from './setTerminal';

interface Params {
  username: number;
  password: string;
}

export const login = async (params: Params) => {
  return await apiGatewayClient.post(`/gozargah/v1/login`, formData({ ...params, terminal_id: getCookie('terminal_id') }));
};

export const useLogin = () => {
  return useMutation(login);
};
