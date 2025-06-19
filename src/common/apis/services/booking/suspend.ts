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
  from: number;
  to: number;
}

export const suspend = (params: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});
  return clinicClient.post(
    endpoints?.block_slot ?? '/api/suspend',
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

export const useSuspend = () => {
  return useMutation(suspend);
};
