import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

interface ReviewParams {
  external_id: string;
}

export const getReviews = async (params: ReviewParams) => {
  const { data } = await apiGatewayClient.get(`/v1/feedbacks`, { params });
  return data;
};

export const useGetReview = (params: ReviewParams, options?: any) =>
  useQuery([ServerStateKeysEnum.Reviews, params], () => getReviews(params), options);
