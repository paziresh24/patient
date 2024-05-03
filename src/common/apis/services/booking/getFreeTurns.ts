import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';
import { growthbook } from 'src/pages/_app';

interface Params {
  center_id: string;
  user_center_id: string;
  service_id: string;
  date: string;
}

export const getFreeTurns = (params: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});
  return clinicClient.post(
    endpoints?.available_times ?? '/api/getFreeTurns',
    formData({
      ...params,
      terminal_id: getCookie('terminal_id'),
    }),
    {
      headers: {
        center_id: params.center_id,
        terminal_id: getCookie('terminal_id'),
      },
    },
  );
};

export const useGetFreeTurns = () => {
  return useMutation(getFreeTurns);
};
