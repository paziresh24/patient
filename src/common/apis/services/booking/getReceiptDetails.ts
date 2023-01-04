import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from 'react-query';

interface Params {
  center_id: string;
  book_id: string;
}

export const Receipt = ({ center_id, book_id }: Params) => {
  return paziresh24AppClient.get(`V1/patient/visits/${center_id}/${book_id}`);
};

export const useGetReceiptDetails = () => {
  return useMutation(Receipt);
};
