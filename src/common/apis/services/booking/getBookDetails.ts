import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  book_id: string;
  type?: 'factor';
}

export const getBookDetails = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/api/getBooks',
    formData({
      ...params,
      certificate: getCookie('certificate'),
    }),
  );
};

export const useGetBookDetails = () => {
  return useMutation(getBookDetails);
};
