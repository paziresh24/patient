import { workflowClient } from './../../client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  bookId: string;
}

export const establishingSecureCall = async ({ bookId }: Params) => {
  return await workflowClient.post(`/webhook/483835a3-d567-47e6-adfb-fe698f9eb2c6/safe-call/${bookId}`);
};

export const useEstablishingSecureCall = () => {
  return useMutation(establishingSecureCall);
};
