import { clinicClient } from '@/common/apis/client';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export const premiumPayment = async () => {
  return await clinicClient.post(`/api/payVip`, formData({ certificate: getCookie('certificate') }));
};

export const usePremiumPayment = () => {
  return useMutation(premiumPayment);
};
