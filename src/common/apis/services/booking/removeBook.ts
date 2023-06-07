import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';

interface Params {
  center_id: string;
  reference_code: string;
  national_code: string;
}

export const removeBook = (params: Params) => {
  return clinicClient.post(
    '/api/deleteBook',
    formData({
      ...params,
      certificate: getCookie('certificate'),
    }),
  );
};

export const useRemoveBook = () => {
  return useMutation(removeBook);
};
