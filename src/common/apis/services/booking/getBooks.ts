import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

interface Params {
  return_type: 'book' | 'book_request' | 'online_visit';
  page: number;
  university?: string;
}

export const getBooks = (params: Params) => {
  return paziresh24AppClient.get('/V1/patient/visits', { params });
};

export const useGetBooks = (params: Params, options?: any) => {
  return useQuery([ServerStateKeysEnum.Books, params], () => getBooks(params), {
    ...options,
  });
};
