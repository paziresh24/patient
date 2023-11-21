import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface DeletedBooksRateParams {
  user_center_id?: string;
}

export const deletedBooksRate = async (params: DeletedBooksRateParams) => {
  return apiGatewayClient.get(`/v1/deleted-book/rate`, { params });
};

export const useDeletedBooksRate = (params: DeletedBooksRateParams) =>
  useQuery(['deletedBooksRate', params], () => deletedBooksRate(params));
