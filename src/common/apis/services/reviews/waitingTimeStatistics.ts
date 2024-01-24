import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface WaitingTimeStatisticsParams {
  slug: string;
  start_date?: string;
  end_date?: string;
  limit?: string;
}

export const waitingTimeStatistics = async (params: WaitingTimeStatisticsParams) => {
  return await apiGatewayClient.get(`/v1/feedbacks/waiting-time-statistics`, { params });
};

export const useWaitingTimeStatistics = (params: WaitingTimeStatisticsParams) =>
  useQuery(['waitingTimeStatistics', params], () => waitingTimeStatistics(params));
