import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface AverageWaitingTimeParams {
  slug: string;
}

export const averageWaitingTime = async (params: AverageWaitingTimeParams) => {
  return await apiGatewayClient.get(`/ravi/v3/avg-time-for-profile`, {
    params: {
      where: `(slug,eq,${params.slug})`,
    },
    timeout: 500,
  });
};

export const useAverageWaitingTime = (params: AverageWaitingTimeParams) =>
  useQuery(['averageWaitingTime', params], () => averageWaitingTime(params));
