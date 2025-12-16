import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface PaymentMethod {
  payment_method: string;
  title: string;
  display_amount: string;
  logo: string;
  html_content: string;
  additional_html?: string;
}

interface Params {
  amount?: string;
  timezone?: string;
  countryCode?: string;
}

type Response = {
  data: {
    payment_methods: PaymentMethod[];
    additional_content?: string;
  };
};

export const getPaymentMethods = async (params: Params) => {
  return apiGatewayClient.get<Response>(`/katibe/v1/payment-methods/p24`, {
    params: {
      'amount': params.amount,
      'timezone': params.timezone,
      'country-code': params.countryCode,
    },
  });
};

export const useGetPaymentMethods = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.PaymentMethods, params], () => getPaymentMethods(params), options);
};
