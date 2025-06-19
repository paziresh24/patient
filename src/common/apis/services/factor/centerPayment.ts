import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';
import { growthbook } from 'src/pages/_app';

interface Params {
  book_id: string;
}

export const centerPayment = (params: Params) => {
  setTerminal();
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return clinicClient.post(
    endpoints?.center_payment ?? '/center-payment',
    formData({
      ...params,
    }),
  );
};

export const useCenterPayment = () => {
  return useMutation(centerPayment);
};
