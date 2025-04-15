import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { setTerminal } from '../auth/setTerminal';

interface Params {
  book_id: string;
  code: string;
  centerId?: string;
  serviceId?: string;
  userCenterId?: string;
}

type Response = {
  result: {
    payable_cost: string;
    discount_price: string;
    token: string;
    vat: string;
  };
  status: number;
  message: string;
};

export const discountInquiry = (params: Params): Promise<AxiosResponse<Response>> => {
  setTerminal();

  return clinicClient.get('/api/discount/v1/inquiry', {
    params: {
      ...params,
    },
  });
};

export const useDiscountInquiry = () => {
  return useMutation(discountInquiry);
};
