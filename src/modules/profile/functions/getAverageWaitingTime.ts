import { averageWaitingTime } from '@/common/apis/services/reviews/averageWaitingTime';
import * as Sentry from '@sentry/nextjs';

type GetAverageWaitingTimeParams = { slug: string; start_date?: string; end_date?: string; limit?: string };

export const getAverageWaitingTime = async ({ slug, end_date, start_date, limit }: GetAverageWaitingTimeParams) => {
  console.log(limit, start_date, slug);

  const { data: response } = await averageWaitingTime({ slug, end_date, start_date, limit });

  if (!response) {
    Sentry.captureMessage(`get average waiting time: slug:${slug}`);
  }

  return {
    ...response,
  };
};
