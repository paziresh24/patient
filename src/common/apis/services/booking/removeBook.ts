import { apiGatewayClient, clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { growthbook } from 'src/pages/_app';

interface Params {
  center_id: string;
  reference_code: string;
  national_code: string;
  book_id: string;
  isBookRequest?: boolean;
}

export const removeBook = ({ book_id, isBookRequest, ...params }: Params, useMoshirDeleteBook: boolean) => {
  if (isBookRequest) {
    return apiGatewayClient.delete(`/core-booking/v1/book-requests/${book_id}`);
  }
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

  useEffect(() => {
    growthbook.loadFeatures({ skipCache: true });
  }, []);

  return useMutation((params: Params) => removeBook(params, useMoshirDeleteBook));
};
