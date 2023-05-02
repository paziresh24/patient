import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';

interface Params {
  center_id: string;
  reference_code: string;
  request_code: string;
}

export const moveBook = (params: Params) => {
  return clinicClient.post(
    '/api/moveBook',
    formData({
      ...params,
      certificate: getCookie('certificate'),
    }),
  );
};

export const useMoveBook = () => {
  return useMutation(moveBook);
};
