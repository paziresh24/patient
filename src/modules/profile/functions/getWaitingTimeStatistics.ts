import { waitingTimeStatistics } from '@/common/apis/services/reviews/waitingTimeStatistics';
import * as Sentry from '@sentry/nextjs';

type GetWaitingTimeStatisticsParams = { slug: string; start_date?: string; end_date?: string; limit?: string };

export const getWaitingTimeStatistics = async ({ slug, end_date, start_date, limit }: GetWaitingTimeStatisticsParams) => {
  const { data: response } = await waitingTimeStatistics({ slug, end_date, start_date, limit });

  if (!response) {
    Sentry.captureMessage(`get waiting time statistics: slug:${slug}`);
  }

  return {
    ...response,
  };
};
