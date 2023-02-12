import { paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from 'react-query';

export interface FeedbackParams {
  doctor_id: string;
  server_id: string;
  search?: string;
  order_by?: string;
  my_feedbacks?: boolean;
  has_nobat?: boolean;
  center_id?: string;
  page?: number;
}

export const getFeedbacks = (params: FeedbackParams) => {
  return paziresh24AppClient.get(`/mizaan/v1/search/feedbacks/`, {
    params,
  });
};

export const useGetFeedbacks = (params: FeedbackParams, options?: any) => {
  return useQuery([ServerStateKeysEnum.Feedbacks, params], () => getFeedbacks(params), options);
};
