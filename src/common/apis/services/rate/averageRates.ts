import { feedbacksClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { useQuery } from '@tanstack/react-query';

export interface AverageRates {
  slug: string;
}

export const averageRates = async (params: AverageRates) => {
  const { data } = await feedbacksClient.get(`/v1/feedbacks/average-rates`, {
    params,
  });
  return data;
};

export const useAverageRates = (params: AverageRates, options?: any) => {
  return useQuery([ServerStateKeysEnum.AverageRates, params], () => averageRates(params), options);
};
