import { paziresh24AppClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

interface Params {
  center_id: string;
  book_id: string;
  pincode?: string;
}

export const receipt = ({ center_id, book_id, ...params }: Params) => {
  return paziresh24AppClient.get(`/user/v1/book/${center_id}/${book_id}`, { params });
};

export const useGetReceiptDetails = (params: Params) => {
  return useQuery([ServerStateKeysEnum.Receipt, params], () => receipt(params));
};
