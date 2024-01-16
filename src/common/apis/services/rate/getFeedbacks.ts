import { feedbacksClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface FeedbackParams {
  doctor_id: string;
  server_id: string;
  search?: string;
  order_by?: string;
  my_feedbacks?: boolean;
  has_nobat?: boolean;
  center_id?: string;
  page?: number;
  no_page_limit?: boolean;
}

export const getFeedbacks = async (params: FeedbackParams) => {
  const { data } = await feedbacksClient.get(`/v1/search/feedbacks/`, {
    params,
  });
  return data;
};

export const useGetFeedbacks = (params: FeedbackParams, options?: any) => {
  return useQuery([ServerStateKeysEnum.Feedbacks, params], () => getFeedbacks(params), options);
};
