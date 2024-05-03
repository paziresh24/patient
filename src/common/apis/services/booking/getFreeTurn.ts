import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';
import { growthbook } from 'src/pages/_app';
import axios from 'axios';

interface Params {
  center_id: string;
  user_center_id: string;
  service_id: string;
  type: 'web' | 'app';
}

export const getFreeTurn = (params: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});
  return axios.post(
    endpoints?.first_time_available ?? '/api/getFreeTurn',
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

export const useGetFreeTurn = () => {
  return useMutation(getFreeTurn);
};
