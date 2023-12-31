import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

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
}

export const book = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/api/book',
    formData({
      ...params,
    }),
  );
};

export const useBook = () => {
  return useMutation(book);
};
