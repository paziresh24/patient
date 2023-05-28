import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';
import { clinicClient } from '../../client';
import { setTerminal } from './setTerminal';

interface Params {
  username: number;
  password: string;
}

export const login = async (params: Params) => {
  await setTerminal();
  return await clinicClient.post(`/api/login`, formData({ ...params, terminal_id: getCookie('terminal_id') }));
};

export const useLogin = () => {
  return useMutation(login);
};
