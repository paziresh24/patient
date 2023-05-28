import { clinicClient } from '@/common/apis/client';
import { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';

interface Params {
  book_id: string;
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

export const consultInvoice = (params: Params): Promise<AxiosResponse<Response>> => {
  return clinicClient.get('/api/consultInvoiceDetails', {
    params: {
      ...params,
    },
  });
};

export const useConsultInvoice = () => {
  return useMutation(consultInvoice);
};
