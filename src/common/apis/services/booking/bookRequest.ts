import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';
import { growthbook } from 'src/pages/_app';
import { getCookie } from 'cookies-next';

interface Params {
  center_id: string;
  service_id: string;
  server_id: string;
  national_code: string;
  user_center_id: string;
  name: string;
  cell: string;
  gender: 'male' | 'female';
  description: string;
  files?: any[];
}

export const bookRequest = (params: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});
  return clinicClient.post(
    endpoints?.create_new_request_booking ?? '/api/bookRequest',
    formData({
      ...params,
    }),
    {
      headers: {
        center_id: params.center_id,
        server_id: params.server_id,
        terminal_id: getCookie('terminal_id'),
      },
    },
  );
};

export const useBookRequest = () => {
  return useMutation(bookRequest);
};
