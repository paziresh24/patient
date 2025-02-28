import { apiGatewayClient, clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

interface Params {
  center_id: string;
  reference_code: string;
  national_code: string;
  book_id: string;
}

export const removeBook = ({ book_id, ...params }: Params, useMoshirDeleteBook: boolean) => {
  if (useMoshirDeleteBook) {
    return apiGatewayClient.post(
      '/moshir/v1/deleteBook',
      formData({
        ...params,
        book_id,
      }),
    );
  }

  return clinicClient.post(
    '/api/deleteBook',
    formData({
      ...params,
    }),
  );
};

export const useRemoveBook = () => {
  const useMoshirDeleteBook = useFeatureIsOn('moshir-delete-book-api');
  growthbook.loadFeatures({ skipCache: true });

  return useMutation((params: Params) => removeBook(params, useMoshirDeleteBook));
};
