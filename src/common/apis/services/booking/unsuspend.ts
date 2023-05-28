import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  center_id: string;
  request_code: string;
}

export const unsuspend = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/api/unsuspend',
    formData({
      ...params,
      terminal_id: getCookie('terminal_id'),
    }),
  );
};

export const useUnsuspend = () => {
  return useMutation(unsuspend);
};
