import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  center_id: string;
  user_center_id: string;
  service_id: string;
  from: number;
  to: number;
}

export const suspend = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/api/suspend',
    formData({
      ...params,
      terminal_id: getCookie('terminal_id'),
    }),
  );
};

export const useSuspend = () => {
  return useMutation(suspend);
};
