import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  center_id: string;
  user_center_id: string;
  service_id: string;
  date: string;
}

export const getFreeTurns = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/api/getFreeTurns',
    formData({
      ...params,
      terminal_id: getCookie('terminal_id'),
    }),
  );
};

export const useGetFreeTurns = () => {
  return useMutation(getFreeTurns);
};
