import { raviApisClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';

interface AverageWaitingTimeParams {
  slug: string;
}

/** GET /ravi/v1/avg-waiting-time/doctors/{slug} — calculator rows per center for profile wait-time. */
export const averageWaitingTime = async (params: AverageWaitingTimeParams) => {
  return await raviApisClient.get(`/ravi/v1/avg-waiting-time/doctors/${encodeURIComponent(params.slug)}`, {
    params: {
      page: 1,
      pageSize: 25,
    },
    timeout: 500,
  });
};

export const useAverageWaitingTime = (params: AverageWaitingTimeParams) =>
  useQuery(['averageWaitingTime', params], () => averageWaitingTime(params));
