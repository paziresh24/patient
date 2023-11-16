import { clinicClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

interface Params {
  id: string;
}

export const inquiryPayment = async (params: Params) => {
  return await clinicClient.get(`/api/payVip/${params.id}`);
};

export const useInquiryPayment = (params: Params) => {
  return useQuery([ServerStateKeysEnum.InquiryPayment, params], () => inquiryPayment(params));
};
