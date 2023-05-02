import formData from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { clinicClient } from '../../client';
import { setTerminal } from './setTerminal';

interface Params {
  cell: number;
}

export const register = async (params: Params) => {
  await setTerminal();
  return await clinicClient.post(`/api/register`, formData({ ...params, terminal_id: getCookie('terminal_id') }));
};

export const useRegister = () => {
  return useMutation(register);
};
