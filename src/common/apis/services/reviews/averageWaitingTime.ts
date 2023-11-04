import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface AverageWaitingTimeParams {
  slug: string;
}

export const averageWaitingTime = async (params: AverageWaitingTimeParams) => {
  return await apiGatewayClient.get(`/v1/feedbacks/average-waiting-time`, { params });
};

export const useAverageWaitingTime = (params: AverageWaitingTimeParams) =>
  useQuery(['averageWaitingTime', params], () => averageWaitingTime(params));
