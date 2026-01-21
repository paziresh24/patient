import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  id: string;
}

export const payRequest = (params: Params) => {
  return axios.post(`https://apigw.paziresh24.com/katibe/v1/payments/${params.id}/pay`, undefined, {
    withCredentials: true,
  });
};

export const usePayRequest = () => useMutation(payRequest);
