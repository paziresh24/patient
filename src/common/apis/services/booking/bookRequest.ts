import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

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

  return clinicClient.post(
    '/api/bookRequest',
    formData({
      ...params,
      certificate: getCookie('certificate'),
    }),
  );
};

export const useBookRequest = () => {
  return useMutation(bookRequest);
};
