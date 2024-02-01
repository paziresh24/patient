import { useMutation } from '@tanstack/react-query';
import { apiGatewayClient } from '../../client';

export interface Params {
  bookId: string;
}

export const establishingSecureCall = async ({ bookId }: Params) => {
  return await apiGatewayClient.post(`/v1/book-safe-call/${bookId}`);
};

export const useEstablishingSecureCall = () => {
  return useMutation(establishingSecureCall);
};
