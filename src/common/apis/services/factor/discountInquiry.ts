import { clinicClient } from '@/common/apis/client';
import { AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  book_id: string;
  code: string;
}

type Response = {
  result: {
    payable_cost: string;
    discount_price: string;
    token: string;
  };
  status: number;
  message: string;
};

export const discountInquiry = (params: Params): Promise<AxiosResponse<Response>> => {
  setTerminal();

  return clinicClient.get('/api/discount/v1/inquiry', {
    params: {
      ...params,
      certificate: getCookie('certificate'),
    },
  });
};

export const useDiscountInquiry = () => {
  return useMutation(discountInquiry);
};
