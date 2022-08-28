import { useQuery } from 'react-query';
import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/ServerStateKeysEnum';

interface Params {
  return_type: 'book' | 'book_request';
  page: number;
}

export const getBooks = (params: Params) => {
  return paziresh24AppClient.get('/V1/patient/visits', { params });
};

export const useGetBooks = (params: Params) => {
  return useQuery([ServerStateKeysEnum.Books, params], () => getBooks(params), {
    enabled: false,
  });
};
