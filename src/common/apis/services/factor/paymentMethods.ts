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
  center_id?: string;
  /** فقط وقتی سرویس balance با موفقیت مقدار داده باشد ارسال می‌شود */
  balance?: number;
}

type Response = {
  data: {
    payment_methods: PaymentMethod[];
    additional_html?: string;
    payment_description_html?: string;
    scroll_to_payment_methods?: boolean;
  };
};

export const getPaymentMethods = async (params: Params) => {
  const query: Record<string, string | undefined> = {
    amount: params.amount,
    timezone: params.timezone,
    'country-code': params.countryCode,
    center_id: params.center_id,
  };
  if (typeof params.balance === 'number' && !Number.isNaN(params.balance)) {
    query.balance = String(params.balance);
  }
  return apiGatewayClient.get<Response>(`/katibe/v1/payment-methods/p24`, {
    params: query,
  });
};

export const useGetPaymentMethods = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.PaymentMethods, params], () => getPaymentMethods(params), options);
};

