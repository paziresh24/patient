import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  book_id: string;
}

export const consultPayment = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/consult-payment',
    formData({
      ...params,
    }),
  );
};

export const useConsultPayment = () => {
  return useMutation(consultPayment);
};
