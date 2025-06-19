import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const premiumPayment = async () => {
  return await clinicClient.post(`/api/payVip`);
};

export const usePremiumPayment = () => {
  return useMutation(premiumPayment);
};
