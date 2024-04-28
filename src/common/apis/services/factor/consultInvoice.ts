import { clinicClient } from '@/common/apis/client';
import { AxiosResponse } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

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
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return clinicClient.get(endpoints?.consult_invoice_details ?? '/api/consultInvoiceDetails', {
    params: {
      ...params,
    },
  });
};

export const useConsultInvoice = () => {
  return useMutation(consultInvoice);
};
