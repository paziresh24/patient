import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';
import { growthbook } from 'src/pages/_app';
import { getCookie } from 'cookies-next';

interface Params {
  server_id: string;
  request_code: string;
  national_code: string;
  cell: string;
  email?: string;
  gender?: 'male' | 'female';
  is_foreigner: boolean;
  selected_user_id: string;
  // insurance_id: this.insurance.id,
  // insurance_number: this.insurance.number,
  first_name: string;
  last_name: string;
  is_webview: 1 | 0;
  symptomes?: string;
  center_id: string;
  user_center_id: string;
}

export const book = ({ user_center_id, ...params }: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});
  return clinicClient.post(
    endpoints?.create_new_booking ?? '/api/book',
    formData({
      ...params,
    }),
    {
      headers: {
        center_id: params.center_id,
        server_id: params.server_id,
        user_id: params.selected_user_id,
        user_center_id: user_center_id,
        terminal_id: getCookie('terminal_id'),
      },
    },
  );
};

export const useBook = () => {
  return useMutation(book);
};
