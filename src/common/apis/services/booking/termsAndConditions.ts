import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  center_id: string;
  user_center_id: string;
  service_id: string;
}

export const termsAndConditions = (params: Params) => {
  setTerminal();

  return clinicClient.post(
    '/api/termsAndConditions',
    formData({
      ...params,
    }),
  );
};

export const useTermsAndConditions = () => {
  return useMutation(termsAndConditions);
};
