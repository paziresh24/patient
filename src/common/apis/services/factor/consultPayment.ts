import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';
import { growthbook } from 'src/pages/_app';

interface Params {
  book_id: string;
  payment_method?: string;
}

export const consultPayment = (params: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return clinicClient.post(
    endpoints.consult_payment ?? '/consult-payment',
    formData({
      ...params,
    }),
  );
};

export const useConsultPayment = () => {
  return useMutation(consultPayment);
};
