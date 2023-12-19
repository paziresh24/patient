import { feedbacksClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface SatisfactionPercent {
  slug: string;
}

export const satisfactionPercent = async (params: SatisfactionPercent) => {
  const { data } = await feedbacksClient.get(`/v1/feedbacks/satisfaction-percent`, {
    params,
  });
  return data;
};

export const useSatisfactionPercent = (params: SatisfactionPercent, options?: any) => {
  return useQuery([ServerStateKeysEnum.SatisfactionPercent, params], () => satisfactionPercent(params), options);
};
