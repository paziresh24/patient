import { useMutation } from '@tanstack/react-query';
import { paziresh24AppClient } from '../../client';

interface Params {
  mobile: string;
  force?: boolean;
}

export const sendOtpCode = async (params: Params) => {
  return await paziresh24AppClient.get(`/V1/auth/resendPassword`, { params });
};

export const useSendOtpCode = () => {
  return useMutation(sendOtpCode);
};
