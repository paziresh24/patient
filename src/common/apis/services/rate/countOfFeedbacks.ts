import { feedbacksClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface CountOfFeedbacks {
  slug: string;
}

export const countOfFeedbacks = async (params: CountOfFeedbacks) => {
  const { data } = await feedbacksClient.get(`/v1/feedbacks/count`, {
    params,
  });
  return data;
};

export const useCountOfFeedbacks = (params: CountOfFeedbacks, options?: any) => {
  return useQuery([ServerStateKeysEnum.CountOfFeedbacks, params], () => countOfFeedbacks(params), options);
};
