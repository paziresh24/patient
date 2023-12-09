import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

export interface AverageWaitingTimeParams {
  slug: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export const averageWaitingTime = async (params: AverageWaitingTimeParams) => {
  return await apiGatewayClient.get(`/v1/feedbacks/average-waiting-time`, { params });
};

export const useAverageWaitingTime = (params: AverageWaitingTimeParams, option?: Record<string, any>) =>
  useQuery(['averageWaitingTime', params], () => averageWaitingTime(params), { ...option });
