import { paziresh24AppClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';
import { growthbook } from 'src/pages/_app';

interface Params {
  center_id: string;
  book_id: string;
  pincode?: string;
}

export const receipt = ({ center_id, book_id, ...params }: Params) => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return paziresh24AppClient.get(`${endpoints?.user_book ?? '/user/v1/book/'}${center_id}/${book_id}`, { params });
};

export const useGetReceiptDetails = (params: Params) => {
  return useQuery([ServerStateKeysEnum.Receipt, params], () => receipt(params));
};
