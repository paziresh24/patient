import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { clinicClient } from '../../client';
import { setTerminal } from './setTerminal';

interface Params {
  cell: number;
  number_reset_password?: number;
}

export const resetPassword = async (params: Params) => {
  await setTerminal();
  return await clinicClient.post(`/api/resetPassword`, formData({ ...params, terminal_id: getCookie('terminal_id') }));
};

export const useResetPassword = () => {
  return useMutation(resetPassword);
};
