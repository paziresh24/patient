import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  book_id: string;
}

export const centerPayment = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/center-payment',
    formData({
      ...params,
    }),
  );
};

export const useCenterPayment = () => {
  return useMutation(centerPayment);
};
