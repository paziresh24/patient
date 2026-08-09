import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  id: string;
  centerid?: string;
}

export const payRequest = (params: Params) => {
  const body = params.centerid ? { centerid: params.centerid } : {};
  return axios.post(`https://apigw.paziresh24.com/katibe/v1/payments/${params.id}/pay`, body, {
    withCredentials: true,
  });
};

export const usePayRequest = () => useMutation(payRequest);
